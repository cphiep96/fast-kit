#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { SpecKitServer } from './server.js';

/**
 * SpecKit MCP Server Entry Point
 *
 * This is the main entry point for the SpecKit MCP server.
 * It initializes the server and handles MCP protocol communication.
 */

async function main() {
  // Initialize MCP server
  const server = new Server(
    {
      name: 'spec-kit',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Initialize SpecKit business logic
  const specKit = new SpecKitServer();
  await specKit.initialize();

  // Define available tools
  const tools: Tool[] = [
    {
      name: 'create_spec',
      description: 'Create a new specification from a template',
      inputSchema: {
        type: 'object',
        properties: {
          template: {
            type: 'string',
            enum: ['prd', 'rfc', 'adr', 'user_story', 'api_spec'],
            description: 'Template type to use',
          },
          title: {
            type: 'string',
            description: 'Title of the specification',
          },
          data: {
            type: 'object',
            description: 'Initial data for the spec',
          },
          source: {
            type: 'string',
            enum: ['manual', 'notion', 'markdown'],
            description: 'Source of the spec',
          },
        },
        required: ['template', 'title'],
      },
    },
    {
      name: 'get_spec',
      description: 'Get specification details',
      inputSchema: {
        type: 'object',
        properties: {
          spec_id: {
            type: 'string',
            description: 'Specification ID',
          },
          format: {
            type: 'string',
            enum: ['yaml', 'json', 'markdown'],
            description: 'Output format',
          },
        },
        required: ['spec_id'],
      },
    },
    {
      name: 'list_specs',
      description: 'List all specifications with filtering',
      inputSchema: {
        type: 'object',
        properties: {
          template: {
            type: 'string',
            description: 'Filter by template type',
          },
          status: {
            type: 'string',
            description: 'Filter by status',
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
      name: 'validate_spec',
      description: 'Validate a specification',
      inputSchema: {
        type: 'object',
        properties: {
          spec_id: {
            type: 'string',
            description: 'Specification ID',
          },
          strict: {
            type: 'boolean',
            description: 'Use strict validation',
          },
        },
        required: ['spec_id'],
      },
    },
    {
      name: 'export_to_prompt',
      description: 'Export specification to Claude Code prompt format',
      inputSchema: {
        type: 'object',
        properties: {
          spec_id: {
            type: 'string',
            description: 'Specification ID',
          },
          include_context: {
            type: 'boolean',
            description: 'Include additional context',
          },
          prompt_template: {
            type: 'string',
            description: 'Custom prompt template',
          },
        },
        required: ['spec_id'],
      },
    },
    {
      name: 'list_templates',
      description: 'List available specification templates',
      inputSchema: {
        type: 'object',
        properties: {},
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
        case 'create_spec':
          return await specKit.createSpec((args || {}) as any);

        case 'get_spec':
          return await specKit.getSpec((args || {}) as any);

        case 'list_specs':
          return await specKit.listSpecs((args || {}) as any);

        case 'validate_spec':
          return await specKit.validateSpec((args || {}) as any);

        case 'export_to_prompt':
          return await specKit.exportToPrompt((args || {}) as any);

        case 'list_templates':
          return await specKit.listTemplates();

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

  console.error('SpecKit MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
