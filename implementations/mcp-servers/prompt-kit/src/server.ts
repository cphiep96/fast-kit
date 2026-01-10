import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import Handlebars from 'handlebars';
import Database from 'better-sqlite3';
import { encoding_for_model } from 'tiktoken';

/**
 * PromptKit Server - Core Business Logic
 *
 * Manages prompt templates, composition, and analytics.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface PromptTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  version: string;
  metadata: {
    author: string;
    created_at: string;
    updated_at: string;
    tags: string[];
    model_optimized_for?: string[];
    avg_success_rate?: number;
  };
  variables: VariableDefinition[];
  template: string;
  examples?: PromptExample[];
  settings?: {
    temperature?: number;
    max_tokens?: number;
  };
}

export interface VariableDefinition {
  name: string;
  type: 'string' | 'code' | 'file_path' | 'list' | 'boolean';
  description: string;
  required: boolean;
  default?: any;
  validation?: {
    pattern?: string;
    min_length?: number;
    max_length?: number;
    allowed_values?: string[];
  };
}

export interface PromptExample {
  input: Record<string, any>;
  output: string;
  explanation?: string;
}

// ============================================================================
// PromptKit Server Class
// ============================================================================

export class PromptKitServer {
  private storageDir: string;
  private promptsDir: string;
  private customDir: string;
  private db: Database.Database | null = null;
  private encoder: any;

  constructor(storageDir?: string) {
    this.storageDir = storageDir || path.join(process.env.HOME || '~', '.fast-kit');
    this.promptsDir = path.join(__dirname, '../prompts');
    this.customDir = path.join(this.storageDir, 'prompts', 'custom');
  }

  /**
   * Initialize storage and database
   */
  async initialize(): Promise<void> {
    // Ensure directories
    await fs.ensureDir(this.customDir);
    await fs.ensureDir(path.join(this.storageDir, 'analytics'));

    // Initialize SQLite database for analytics
    const dbPath = path.join(this.storageDir, 'analytics', 'prompt-usage.db');
    this.db = new Database(dbPath);

    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS prompt_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        variables TEXT,
        success BOOLEAN,
        completion_time_ms INTEGER,
        token_count INTEGER,
        feedback TEXT
      );

      CREATE TABLE IF NOT EXISTS prompt_performance (
        prompt_id TEXT PRIMARY KEY,
        total_uses INTEGER DEFAULT 0,
        successful_uses INTEGER DEFAULT 0,
        avg_completion_time_ms REAL,
        avg_tokens REAL,
        last_used TEXT
      );
    `);

    // Initialize tiktoken encoder
    try {
      this.encoder = encoding_for_model('gpt-4');
    } catch {
      // Fallback if tiktoken not available
      this.encoder = null;
    }

    // Ensure builtin prompts directory exists
    await this.ensureBuiltinPrompts();
  }

  /**
   * List prompts with filtering
   */
  async listPrompts(args: {
    category?: string;
    tags?: string[];
    search?: string;
    limit?: number;
  }): Promise<any> {
    const allPrompts = await this.getAllPrompts();
    let filtered = allPrompts;

    // Apply filters
    if (args.category) {
      filtered = filtered.filter(p => p.category === args.category);
    }
    if (args.tags && args.tags.length > 0) {
      filtered = filtered.filter(p =>
        p.metadata.tags?.some(t => args.tags!.includes(t))
      );
    }
    if (args.search) {
      const query = args.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Apply limit
    const limit = args.limit || 50;
    const results = filtered.slice(0, limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            prompts: results.map(p => ({
              id: p.id,
              name: p.name,
              category: p.category,
              description: p.description,
              tags: p.metadata.tags,
              success_rate: p.metadata.avg_success_rate,
            })),
            total: results.length,
            categories: [...new Set(allPrompts.map(p => p.category))],
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Get specific prompt template
   */
  async getPrompt(args: {
    prompt_id: string;
    include_examples?: boolean;
  }): Promise<any> {
    const prompt = await this.loadPrompt(args.prompt_id);

    if (!prompt) {
      throw new Error(`Prompt not found: ${args.prompt_id}`);
    }

    // Get usage stats
    const stats = this.getUsageStats(args.prompt_id);

    const response: any = {
      template: prompt,
      usage_stats: stats,
    };

    if (!args.include_examples) {
      delete response.template.examples;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  /**
   * Compose prompt from template
   */
  async composePrompt(args: {
    prompt_id: string;
    variables: Record<string, any>;
    inject_context?: boolean;
  }): Promise<any> {
    const prompt = await this.loadPrompt(args.prompt_id);

    if (!prompt) {
      throw new Error(`Prompt not found: ${args.prompt_id}`);
    }

    // Validate variables
    const validation = this.validateVariables(prompt.variables, args.variables);
    if (validation.errors.length > 0) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Variable validation failed',
              validation_errors: validation.errors,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }

    // Compile template
    const template = Handlebars.compile(prompt.template);
    const rendered = template(args.variables);

    // Count tokens
    const tokenCount = this.countTokens(rendered);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            rendered_prompt: rendered,
            token_count: tokenCount,
            prompt_id: args.prompt_id,
            variables_used: Object.keys(args.variables),
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Search prompts semantically
   */
  async searchPrompts(args: {
    query: string;
    limit?: number;
  }): Promise<any> {
    const allPrompts = await this.getAllPrompts();
    const query = args.query.toLowerCase();

    // Simple keyword-based search (TODO: implement semantic search with embeddings)
    const matches = allPrompts
      .map(p => {
        let score = 0;
        const nameMatch = p.name.toLowerCase().includes(query);
        const descMatch = p.description.toLowerCase().includes(query);
        const tagsMatch = p.metadata.tags?.some(t => t.toLowerCase().includes(query));

        if (nameMatch) score += 3;
        if (descMatch) score += 2;
        if (tagsMatch) score += 1;

        return { prompt: p, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, args.limit || 10);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results: matches.map(m => ({
              prompt: {
                id: m.prompt.id,
                name: m.prompt.name,
                category: m.prompt.category,
                description: m.prompt.description,
              },
              relevance: m.score / 3, // Normalize to 0-1
              matching_reason: m.score >= 3 ? 'Name match' :
                               m.score >= 2 ? 'Description match' : 'Tag match',
            })),
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Create custom prompt template
   */
  async createCustomPrompt(args: {
    name: string;
    category: string;
    description: string;
    template: string;
    variables?: VariableDefinition[];
  }): Promise<any> {
    const prompt_id = `custom_${nanoid(10)}`;
    const now = new Date().toISOString();

    const promptTemplate: PromptTemplate = {
      id: prompt_id,
      category: args.category,
      name: args.name,
      description: args.description,
      version: '1.0.0',
      metadata: {
        author: 'user',
        created_at: now,
        updated_at: now,
        tags: ['custom'],
      },
      variables: args.variables || [],
      template: args.template,
    };

    // Save to custom directory
    const filePath = path.join(this.customDir, `${prompt_id}.yaml`);
    await fs.writeFile(filePath, YAML.stringify(promptTemplate), 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            prompt_id,
            created_at: now,
            message: 'Custom prompt created successfully',
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Track prompt usage
   */
  async trackUsage(args: {
    prompt_id: string;
    success: boolean;
    feedback?: string;
    completion_time_ms?: number;
    token_count?: number;
  }): Promise<any> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const now = new Date().toISOString();

    // Insert usage record
    this.db.prepare(`
      INSERT INTO prompt_usage (prompt_id, timestamp, success, feedback, completion_time_ms, token_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      args.prompt_id,
      now,
      args.success ? 1 : 0,
      args.feedback || null,
      args.completion_time_ms || null,
      args.token_count || null
    );

    // Update performance stats
    this.updatePerformanceStats(args.prompt_id);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            tracked: true,
            prompt_id: args.prompt_id,
            timestamp: now,
          }, null, 2),
        },
      ],
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async getAllPrompts(): Promise<PromptTemplate[]> {
    const prompts: PromptTemplate[] = [];

    // Load builtin prompts
    const builtinDir = path.join(this.promptsDir, 'builtin');
    if (await fs.pathExists(builtinDir)) {
      const categories = await fs.readdir(builtinDir);
      for (const category of categories) {
        const categoryPath = path.join(builtinDir, category);
        if ((await fs.stat(categoryPath)).isDirectory()) {
          const files = await fs.readdir(categoryPath);
          for (const file of files) {
            if (file.endsWith('.yaml')) {
              const content = await fs.readFile(path.join(categoryPath, file), 'utf-8');
              prompts.push(YAML.parse(content));
            }
          }
        }
      }
    }

    // Load custom prompts
    if (await fs.pathExists(this.customDir)) {
      const files = await fs.readdir(this.customDir);
      for (const file of files) {
        if (file.endsWith('.yaml')) {
          const content = await fs.readFile(path.join(this.customDir, file), 'utf-8');
          prompts.push(YAML.parse(content));
        }
      }
    }

    return prompts;
  }

  private async loadPrompt(prompt_id: string): Promise<PromptTemplate | null> {
    const allPrompts = await this.getAllPrompts();
    return allPrompts.find(p => p.id === prompt_id) || null;
  }

  private validateVariables(
    definitions: VariableDefinition[],
    values: Record<string, any>
  ): { errors: string[] } {
    const errors: string[] = [];

    for (const def of definitions) {
      if (def.required && !(def.name in values)) {
        errors.push(`Missing required variable: ${def.name}`);
        continue;
      }

      const value = values[def.name];
      if (value === undefined) continue;

      // Type validation
      if (def.type === 'string' && typeof value !== 'string') {
        errors.push(`Variable ${def.name} must be a string`);
      }
      if (def.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Variable ${def.name} must be a boolean`);
      }
      if (def.type === 'list' && !Array.isArray(value)) {
        errors.push(`Variable ${def.name} must be an array`);
      }

      // Additional validation
      if (def.validation) {
        if (def.validation.min_length && value.length < def.validation.min_length) {
          errors.push(`Variable ${def.name} must be at least ${def.validation.min_length} characters`);
        }
        if (def.validation.max_length && value.length > def.validation.max_length) {
          errors.push(`Variable ${def.name} must be at most ${def.validation.max_length} characters`);
        }
        if (def.validation.allowed_values && !def.validation.allowed_values.includes(value)) {
          errors.push(`Variable ${def.name} must be one of: ${def.validation.allowed_values.join(', ')}`);
        }
      }
    }

    return { errors };
  }

  private countTokens(text: string): number {
    if (this.encoder) {
      try {
        return this.encoder.encode(text).length;
      } catch {
        // Fallback
      }
    }
    // Simple approximation: ~4 chars per token
    return Math.ceil(text.length / 4);
  }

  private getUsageStats(prompt_id: string): any {
    if (!this.db) return null;

    const stats = this.db.prepare(`
      SELECT * FROM prompt_performance WHERE prompt_id = ?
    `).get(prompt_id);

    return stats || {
      total_uses: 0,
      successful_uses: 0,
      avg_completion_time_ms: 0,
      avg_tokens: 0,
    };
  }

  private updatePerformanceStats(prompt_id: string): void {
    if (!this.db) return;

    const stats = this.db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
        AVG(completion_time_ms) as avg_time,
        AVG(token_count) as avg_tokens,
        MAX(timestamp) as last_used
      FROM prompt_usage
      WHERE prompt_id = ?
    `).get(prompt_id) as any;

    this.db.prepare(`
      INSERT OR REPLACE INTO prompt_performance
      (prompt_id, total_uses, successful_uses, avg_completion_time_ms, avg_tokens, last_used)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      prompt_id,
      stats.total,
      stats.successful,
      stats.avg_time,
      stats.avg_tokens,
      stats.last_used
    );
  }

  private async ensureBuiltinPrompts(): Promise<void> {
    const builtinDir = path.join(this.promptsDir, 'builtin');
    await fs.ensureDir(path.join(builtinDir, 'code_generation'));
    await fs.ensureDir(path.join(builtinDir, 'refactoring'));
    await fs.ensureDir(path.join(builtinDir, 'testing'));
    await fs.ensureDir(path.join(builtinDir, 'debugging'));
    await fs.ensureDir(path.join(builtinDir, 'documentation'));
  }
}
