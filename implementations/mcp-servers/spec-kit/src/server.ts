import { nanoid } from 'nanoid';
import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml';
import { z } from 'zod';
import Ajv from 'ajv';

/**
 * SpecKit Server - Core Business Logic
 *
 * Handles all specification management operations including
 * creation, validation, storage, and export.
 */

// ============================================================================
// Types & Schemas
// ============================================================================

export type SpecTemplate = 'prd' | 'rfc' | 'adr' | 'user_story' | 'api_spec';
export type SpecStatus = 'draft' | 'review' | 'approved' | 'deprecated';
export type SpecFormat = 'yaml' | 'json' | 'markdown';

export interface SpecMetadata {
  spec_id: string;
  template: SpecTemplate;
  title: string;
  status: SpecStatus;
  created_at: string;
  updated_at: string;
  author?: string;
  tags?: string[];
}

export interface SpecData {
  metadata: SpecMetadata;
  content: Record<string, any>;
}

// Zod schemas for validation
const PRDSchema = z.object({
  metadata: z.object({
    title: z.string(),
    author: z.string().optional(),
    status: z.enum(['draft', 'review', 'approved', 'deprecated']),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  }),
  overview: z.object({
    problem: z.string(),
    solution: z.string(),
    target_users: z.array(z.string()),
    success_metrics: z.array(z.string()),
  }),
  requirements: z.object({
    functional: z.array(z.object({
      id: z.string().optional(),
      title: z.string(),
      description: z.string(),
      acceptance_criteria: z.array(z.string()),
      priority: z.enum(['must', 'should', 'could', 'wont']),
    })).optional(),
    non_functional: z.array(z.object({
      category: z.string(),
      requirement: z.string(),
      target: z.string().optional(),
    })).optional(),
  }).optional(),
});

const RFCSchema = z.object({
  metadata: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['draft', 'in-review', 'accepted', 'rejected', 'superseded']),
  }),
  summary: z.object({
    problem: z.string(),
    proposed_solution: z.string(),
    impact: z.string(),
  }),
  proposal: z.object({
    background: z.string().optional(),
    detailed_design: z.string(),
    alternatives_considered: z.array(z.object({
      option: z.string(),
      pros: z.array(z.string()),
      cons: z.array(z.string()),
    })).optional(),
  }),
});

const ADRSchema = z.object({
  metadata: z.object({
    title: z.string(),
    status: z.enum(['proposed', 'accepted', 'deprecated', 'superseded']),
    deciders: z.array(z.string()),
  }),
  context: z.string(),
  decision: z.string(),
  rationale: z.object({
    factors: z.array(z.string()).optional(),
    assumptions: z.array(z.string()).optional(),
    constraints: z.array(z.string()).optional(),
  }).optional(),
  consequences: z.object({
    positive: z.array(z.string()).optional(),
    negative: z.array(z.string()).optional(),
    neutral: z.array(z.string()).optional(),
  }).optional(),
});

const TEMPLATE_SCHEMAS: Record<SpecTemplate, z.ZodSchema> = {
  prd: PRDSchema,
  rfc: RFCSchema,
  adr: ADRSchema,
  user_story: z.any(), // TODO: Implement
  api_spec: z.any(),   // TODO: Implement
};

// ============================================================================
// SpecKit Server Class
// ============================================================================

export class SpecKitServer {
  private storageDir: string;
  private specsDir: string;
  private templatesDir: string;

  constructor(storageDir?: string) {
    this.storageDir = storageDir || path.join(process.env.HOME || '~', '.fast-kit');
    this.specsDir = path.join(this.storageDir, 'specs');
    this.templatesDir = path.join(__dirname, '../templates');
  }

  /**
   * Initialize storage directories
   */
  async initialize(): Promise<void> {
    await fs.ensureDir(this.specsDir);
    await fs.ensureDir(path.join(this.specsDir, 'prd'));
    await fs.ensureDir(path.join(this.specsDir, 'rfc'));
    await fs.ensureDir(path.join(this.specsDir, 'adr'));
    await fs.ensureDir(path.join(this.specsDir, 'user_stories'));
    await fs.ensureDir(path.join(this.specsDir, 'api_specs'));
  }

  /**
   * Create a new specification
   */
  async createSpec(args: {
    template: SpecTemplate;
    title: string;
    data?: Record<string, any>;
    source?: 'manual' | 'notion' | 'markdown';
  }): Promise<any> {
    const spec_id = nanoid(10);
    const now = new Date().toISOString();

    const spec: SpecData = {
      metadata: {
        spec_id,
        template: args.template,
        title: args.title,
        status: 'draft',
        created_at: now,
        updated_at: now,
      },
      content: args.data || {},
    };

    // Save to file
    const filePath = this.getSpecPath(args.template, spec_id);
    await fs.writeFile(filePath, YAML.stringify(spec), 'utf-8');

    // Validate
    const validation = await this.validateSpecData(spec);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            spec_id,
            template: args.template,
            created_at: now,
            validation_status: validation.valid ? 'valid' : 'incomplete',
            validation_errors: validation.errors,
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Get specification details
   */
  async getSpec(args: {
    spec_id: string;
    format?: SpecFormat;
  }): Promise<any> {
    const spec = await this.loadSpec(args.spec_id);

    if (!spec) {
      throw new Error(`Spec not found: ${args.spec_id}`);
    }

    let content: string;
    switch (args.format) {
      case 'json':
        content = JSON.stringify(spec, null, 2);
        break;
      case 'markdown':
        content = this.convertToMarkdown(spec);
        break;
      case 'yaml':
      default:
        content = YAML.stringify(spec);
    }

    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  /**
   * List specifications with filtering
   */
  async listSpecs(args: {
    template?: string;
    status?: string;
    tags?: string[];
    search?: string;
    limit?: number;
  }): Promise<any> {
    const allSpecs = await this.getAllSpecs();

    let filtered = allSpecs;

    // Apply filters
    if (args.template) {
      filtered = filtered.filter(s => s.metadata.template === args.template);
    }
    if (args.status) {
      filtered = filtered.filter(s => s.metadata.status === args.status);
    }
    if (args.tags && args.tags.length > 0) {
      filtered = filtered.filter(s =>
        s.metadata.tags?.some(t => args.tags!.includes(t))
      );
    }
    if (args.search) {
      const query = args.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.metadata.title.toLowerCase().includes(query)
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
            specs: results.map(s => ({
              spec_id: s.metadata.spec_id,
              template: s.metadata.template,
              title: s.metadata.title,
              status: s.metadata.status,
              created_at: s.metadata.created_at,
              updated_at: s.metadata.updated_at,
            })),
            total: results.length,
            has_more: filtered.length > limit,
          }, null, 2),
        },
      ],
    };
  }

  /**
   * Validate specification
   */
  async validateSpec(args: {
    spec_id: string;
    strict?: boolean;
  }): Promise<any> {
    const spec = await this.loadSpec(args.spec_id);

    if (!spec) {
      throw new Error(`Spec not found: ${args.spec_id}`);
    }

    const validation = await this.validateSpecData(spec, args.strict);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(validation, null, 2),
        },
      ],
    };
  }

  /**
   * Export specification to Claude Code prompt format
   */
  async exportToPrompt(args: {
    spec_id: string;
    include_context?: boolean;
    prompt_template?: string;
  }): Promise<any> {
    const spec = await this.loadSpec(args.spec_id);

    if (!spec) {
      throw new Error(`Spec not found: ${args.spec_id}`);
    }

    const prompt = this.generatePrompt(spec, args.include_context);

    return {
      content: [
        {
          type: 'text',
          text: prompt,
        },
      ],
    };
  }

  /**
   * List available templates
   */
  async listTemplates(): Promise<any> {
    const templates = [
      {
        id: 'prd',
        name: 'Product Requirements Document',
        description: 'Comprehensive product specification',
        version: '1.0',
      },
      {
        id: 'rfc',
        name: 'Request for Comments',
        description: 'Technical proposal and discussion',
        version: '1.0',
      },
      {
        id: 'adr',
        name: 'Architecture Decision Record',
        description: 'Document architectural decisions',
        version: '1.0',
      },
      {
        id: 'user_story',
        name: 'User Story',
        description: 'Agile user story format',
        version: '1.0',
      },
      {
        id: 'api_spec',
        name: 'API Specification',
        description: 'REST/GraphQL API documentation',
        version: '1.0',
      },
    ];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ templates }, null, 2),
        },
      ],
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private getSpecPath(template: SpecTemplate, spec_id: string): string {
    const dir = template === 'user_story' ? 'user_stories' :
                 template === 'api_spec' ? 'api_specs' : template;
    return path.join(this.specsDir, dir, `${spec_id}.yaml`);
  }

  private async loadSpec(spec_id: string): Promise<SpecData | null> {
    // Try all template directories
    const templates: SpecTemplate[] = ['prd', 'rfc', 'adr', 'user_story', 'api_spec'];

    for (const template of templates) {
      const filePath = this.getSpecPath(template, spec_id);
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf-8');
        return YAML.parse(content);
      }
    }

    return null;
  }

  private async getAllSpecs(): Promise<SpecData[]> {
    const specs: SpecData[] = [];
    const templates: SpecTemplate[] = ['prd', 'rfc', 'adr', 'user_story', 'api_spec'];

    for (const template of templates) {
      const dir = template === 'user_story' ? 'user_stories' :
                   template === 'api_spec' ? 'api_specs' : template;
      const dirPath = path.join(this.specsDir, dir);

      if (await fs.pathExists(dirPath)) {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
          if (file.endsWith('.yaml')) {
            const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
            specs.push(YAML.parse(content));
          }
        }
      }
    }

    return specs;
  }

  private async validateSpecData(spec: SpecData, strict = false): Promise<{
    valid: boolean;
    completeness: number;
    errors: any[];
    warnings: any[];
  }> {
    const schema = TEMPLATE_SCHEMAS[spec.metadata.template];
    const errors: any[] = [];
    const warnings: any[] = [];

    try {
      schema.parse(spec.content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors);
      }
    }

    // Calculate completeness (simple heuristic)
    const totalFields = Object.keys(schema.shape || {}).length;
    const filledFields = Object.keys(spec.content).length;
    const completeness = totalFields > 0 ? (filledFields / totalFields) * 100 : 100;

    return {
      valid: errors.length === 0,
      completeness,
      errors,
      warnings,
    };
  }

  private convertToMarkdown(spec: SpecData): string {
    let md = `# ${spec.metadata.title}\n\n`;
    md += `**Status**: ${spec.metadata.status}\n`;
    md += `**Template**: ${spec.metadata.template}\n`;
    md += `**Created**: ${spec.metadata.created_at}\n\n`;

    // Convert content to markdown (simplified)
    md += '## Content\n\n';
    md += '```yaml\n';
    md += YAML.stringify(spec.content);
    md += '```\n';

    return md;
  }

  private generatePrompt(spec: SpecData, includeContext = false): string {
    let prompt = `# Task: ${spec.metadata.title}\n\n`;

    if (spec.metadata.template === 'prd') {
      const content = spec.content as any;

      prompt += `## Overview\n`;
      if (content.overview?.problem) {
        prompt += `**Problem**: ${content.overview.problem}\n\n`;
      }
      if (content.overview?.solution) {
        prompt += `**Solution**: ${content.overview.solution}\n\n`;
      }

      if (content.requirements?.functional) {
        prompt += `## Functional Requirements\n`;
        content.requirements.functional.forEach((req: any, idx: number) => {
          prompt += `${idx + 1}. **${req.title}** (${req.priority})\n`;
          prompt += `   ${req.description}\n`;
          if (req.acceptance_criteria) {
            prompt += `   Acceptance Criteria:\n`;
            req.acceptance_criteria.forEach((ac: string) => {
              prompt += `   - ${ac}\n`;
            });
          }
          prompt += `\n`;
        });
      }
    } else if (spec.metadata.template === 'rfc') {
      const content = spec.content as any;

      prompt += `## Summary\n`;
      prompt += `**Problem**: ${content.summary?.problem || 'N/A'}\n`;
      prompt += `**Proposed Solution**: ${content.summary?.proposed_solution || 'N/A'}\n\n`;

      if (content.proposal?.detailed_design) {
        prompt += `## Detailed Design\n${content.proposal.detailed_design}\n\n`;
      }
    } else if (spec.metadata.template === 'adr') {
      const content = spec.content as any;

      prompt += `## Context\n${content.context || 'N/A'}\n\n`;
      prompt += `## Decision\n${content.decision || 'N/A'}\n\n`;

      if (content.consequences) {
        prompt += `## Consequences\n`;
        if (content.consequences.positive) {
          prompt += `**Positive**:\n`;
          content.consequences.positive.forEach((c: string) => {
            prompt += `- ${c}\n`;
          });
        }
        if (content.consequences.negative) {
          prompt += `**Negative**:\n`;
          content.consequences.negative.forEach((c: string) => {
            prompt += `- ${c}\n`;
          });
        }
      }
    }

    prompt += `\n---\n`;
    prompt += `*Generated from ${spec.metadata.template} spec: ${spec.metadata.spec_id}*\n`;

    return prompt;
  }
}
