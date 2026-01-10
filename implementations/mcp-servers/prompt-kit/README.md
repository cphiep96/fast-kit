# PromptKit MCP Server

AI Prompt Library & Engineering System - MCP Server Implementation

## 🚀 Quick Start

### Installation

```bash
# From the monorepo root
pnpm install

# Build PromptKit
cd implementations/mcp-servers/prompt-kit
pnpm install
pnpm build
```

### Usage with Claude Code

Add to your Claude Code config (`~/.config/claude/config.json`):

```json
{
  "mcpServers": {
    "prompt-kit": {
      "command": "node",
      "args": ["/path/to/fast-kit/implementations/mcp-servers/prompt-kit/dist/index.js"]
    }
  }
}
```

## 🎯 Features

- ✅ 5+ curated prompt templates (more coming!)
- ✅ Template composition with Handlebars
- ✅ Variable validation
- ✅ Usage analytics tracking
- ✅ Custom prompt creation
- ✅ Semantic search
- ⏳ 100+ prompts (in progress)
- ⏳ Prompt chaining (coming soon)

## 📦 Available Tools

### `list_prompts`
List available prompt templates with filtering.

**Parameters:**
- `category` (optional): Filter by category
- `tags` (optional): Filter by tags
- `search` (optional): Search query
- `limit` (optional): Max results

### `get_prompt`
Get a specific prompt template.

**Parameters:**
- `prompt_id` (required): Prompt template ID
- `include_examples` (optional): Include usage examples

### `compose_prompt`
Compose a prompt from template with variables.

**Parameters:**
- `prompt_id` (required): Prompt template ID
- `variables` (required): Variables object
- `inject_context` (optional): Auto-inject context

**Example:**
```json
{
  "prompt_id": "function_creation",
  "variables": {
    "function_name": "calculateTax",
    "purpose": "Calculate tax amount based on price and tax rate",
    "language": "typescript",
    "parameters": [
      {"name": "price", "type": "number", "description": "Base price"},
      {"name": "taxRate", "type": "number", "description": "Tax rate (0-1)"}
    ],
    "return_type": "number"
  }
}
```

### `search_prompts`
Search for prompts semantically.

**Parameters:**
- `query` (required): Search query
- `limit` (optional): Max results

### `create_custom_prompt`
Create a custom prompt template.

**Parameters:**
- `name` (required): Prompt name
- `category` (required): Category
- `description` (required): Description
- `template` (required): Handlebars template
- `variables` (optional): Variable definitions

### `track_usage`
Track prompt usage for analytics.

**Parameters:**
- `prompt_id` (required): Prompt ID
- `success` (required): Was it successful?
- `feedback` (optional): User feedback

## 📚 Built-in Prompt Library

### Code Generation
- **function_creation** - Generate function implementations
- More coming soon...

### Testing
- **unit_test_creation** - Generate comprehensive unit tests

### Debugging
- **fix_bug** - Debug and fix bugs with analysis

### Refactoring
- **refactor_code** - Refactor for readability, performance, etc.

### Documentation
- **add_documentation** - Generate code documentation

## 💾 Data Storage

```
~/.fast-kit/
├── prompts/
│   └── custom/
│       └── {prompt-id}.yaml
└── analytics/
    └── prompt-usage.db
```

## 🎨 Prompt Template Format

```yaml
id: my_prompt
category: code_generation
name: My Custom Prompt
description: What this prompt does
version: 1.0.0

metadata:
  author: your-name
  created_at: '2026-01-10'
  tags: [tag1, tag2]

variables:
  - name: var_name
    type: string
    description: Variable description
    required: true

template: |
  # Your prompt template using {{var_name}}

  ## Instructions
  ...

settings:
  temperature: 0.3
  max_tokens: 2000
```

## 📖 Examples

### Example 1: Create a Function

```bash
# Using Claude Code
> Use the function_creation prompt to create a validateEmail function in TypeScript
```

Claude will call `compose_prompt` and generate a detailed prompt for implementing the function.

### Example 2: Generate Tests

```bash
> Use the unit_test_creation prompt to write tests for my calculateDiscount function
```

### Example 3: Search for Prompts

```bash
> Search for prompts about "testing APIs"
```

### Example 4: Custom Prompt

```bash
> Create a custom prompt for generating React components
```

## 🧪 Analytics

PromptKit tracks:
- Total uses per prompt
- Success rate
- Average tokens
- User feedback

View stats:
```bash
# Get prompt with stats
> Show me stats for the function_creation prompt
```

## 🔧 Development

### Add New Prompts

1. Create a YAML file in `prompts/builtin/{category}/`
2. Follow the template format
3. Test with `compose_prompt`

### Run Tests

```bash
pnpm test
```

## 📝 License

MIT
