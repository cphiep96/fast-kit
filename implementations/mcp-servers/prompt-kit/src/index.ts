#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { PromptKitServer } from './server.js';

/**
 * PromptKit MCP Server Entry Point
 *
 * Provides a library of optimized AI prompts and prompt engineering tools.
 */

async function main() {
  // Initialize MCP server
  const server = new Server(
    {
      name: 'prompt-kit',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize PromptKit business logic
  const promptKit = new PromptKitServer();
  await promptKit.initialize();

  // Define available tools
  const tools: Tool[] = [
    {
      name: 'list_prompts',
      description: 'List available prompt templates with filtering',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by category (code_generation, refactoring, testing, etc)',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by tags',
          },
          search: {
            type: 'string',
            description: 'Search query',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results',
          },
        },
      },
    },
    {
      name: 'get_prompt',
      description: 'Get a specific prompt template',
      inputSchema: {
        type: 'object',
        properties: {
          prompt_id: {
            type: 'string',
            description: 'Prompt template ID',
          },
          include_examples: {
            type: 'boolean',
            description: 'Include usage examples',
          },
        },
        required: ['prompt_id'],
      },
    },
    {
      name: 'compose_prompt',
      description: 'Compose a prompt from a template with variables',
      inputSchema: {
        type: 'object',
        properties: {
          prompt_id: {
            type: 'string',
            description: 'Prompt template ID',
          },
          variables: {
            type: 'object',
            description: 'Variables to fill in the template',
          },
          inject_context: {
            type: 'boolean',
            description: 'Auto-inject context from ContextKit',
          },
        },
        required: ['prompt_id', 'variables'],
      },
    },
    {
      name: 'search_prompts',
      description: 'Semantic search for prompts',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (e.g., "how to write unit tests")',
          },
          limit: {
            type: 'number',
            description: 'Maximum results',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'create_custom_prompt',
      description: 'Create a custom prompt template',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Prompt name',
          },
          category: {
            type: 'string',
            description: 'Category',
          },
          description: {
            type: 'string',
            description: 'Description',
          },
          template: {
            type: 'string',
            description: 'Handlebars template string',
          },
          variables: {
            type: 'array',
            description: 'Variable definitions',
          },
        },
        required: ['name', 'category', 'description', 'template'],
      },
    },
    {
      name: 'track_usage',
      description: 'Track prompt usage and effectiveness',
      inputSchema: {
        type: 'object',
        properties: {
          prompt_id: {
            type: 'string',
            description: 'Prompt ID',
          },
          success: {
            type: 'boolean',
            description: 'Whether the prompt was successful',
          },
          feedback: {
            type: 'string',
            description: 'Optional feedback',
          },
        },
        required: ['prompt_id', 'success'],
      },
    },
  ];

  // Handle list_tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Handle call_tool request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'list_prompts':
          return await promptKit.listPrompts((args || {}) as any);

        case 'get_prompt':
          return await promptKit.getPrompt((args || {}) as any);

        case 'compose_prompt':
          return await promptKit.composePrompt((args || {}) as any);

        case 'search_prompts':
          return await promptKit.searchPrompts((args || {}) as any);

        case 'create_custom_prompt':
          return await promptKit.createCustomPrompt((args || {}) as any);

        case 'track_usage':
          return await promptKit.trackUsage((args || {}) as any);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('PromptKit MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
