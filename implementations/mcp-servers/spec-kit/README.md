# SpecKit MCP Server

Specification Management System - MCP Server Implementation

## 🚀 Quick Start

### Installation

```bash
# From the monorepo root
pnpm install

# Build SpecKit
cd implementations/mcp-servers/spec-kit
pnpm build
```

### Usage with Claude Code

Add to your Claude Code config (`~/.config/claude/config.json`):

```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["/path/to/fast-kit/implementations/mcp-servers/spec-kit/dist/index.js"]
    }
  }
}
```

## 🎯 Features

- ✅ Create specs from templates (PRD, RFC, ADR, User Story, API Spec)
- ✅ Validate specs against schemas
- ✅ List and search specifications
- ✅ Export to Claude Code prompt format
- ✅ YAML/JSON storage
- ⏳ Notion integration (coming soon)
- ⏳ Markdown export (coming soon)

## 📦 Available Tools

### `create_spec`
Create a new specification from a template.

**Parameters:**
- `template` (required): `prd` | `rfc` | `adr` | `user_story` | `api_spec`
- `title` (required): Title of the specification
- `data` (optional): Initial spec data
- `source` (optional): `manual` | `notion` | `markdown`

**Example:**
```typescript
{
  "template": "prd",
  "title": "User Authentication System",
  "data": {
    "overview": {
      "problem": "Users need secure login",
      "solution": "OAuth2 + JWT authentication",
      "target_users": ["End users", "Admins"],
      "success_metrics": ["Login success rate > 99%"]
    }
  }
}
```

### `get_spec`
Get specification details.

**Parameters:**
- `spec_id` (required): Specification ID
- `format` (optional): `yaml` | `json` | `markdown`

### `list_specs`
List all specifications with filtering.

**Parameters:**
- `template` (optional): Filter by template type
- `status` (optional): Filter by status
- `tags` (optional): Filter by tags
- `search` (optional): Search query
- `limit` (optional): Maximum results (default: 50)

### `validate_spec`
Validate a specification.

**Parameters:**
- `spec_id` (required): Specification ID
- `strict` (optional): Use strict validation

### `export_to_prompt`
Export specification to Claude Code prompt format.

**Parameters:**
- `spec_id` (required): Specification ID
- `include_context` (optional): Include additional context
- `prompt_template` (optional): Custom template

### `list_templates`
List available specification templates.

## 📁 Data Storage

Specifications are stored at `~/.fast-kit/specs/`:

```
~/.fast-kit/specs/
├── prd/
│   └── {spec-id}.yaml
├── rfc/
│   └── {spec-id}.yaml
├── adr/
│   └── {spec-id}.yaml
├── user_stories/
│   └── {spec-id}.yaml
└── api_specs/
    └── {spec-id}.yaml
```

## 🧪 Development

### Run in Development Mode

```bash
pnpm dev
```

### Run Tests

```bash
pnpm test
```

### Build

```bash
pnpm build
```

## 📖 Examples

### Create a PRD

```bash
# Using Claude Code
> Create a PRD spec for user authentication with OAuth2 and JWT
```

Claude Code will call:
```json
{
  "tool": "create_spec",
  "arguments": {
    "template": "prd",
    "title": "User Authentication System",
    "data": {
      "overview": {
        "problem": "Users need secure authentication",
        "solution": "Implement OAuth2 + JWT",
        "target_users": ["End users"],
        "success_metrics": ["99% uptime", "< 500ms login time"]
      }
    }
  }
}
```

### Export to Prompt

```bash
# Get the spec as a Claude-ready prompt
> Export spec abc123 to a prompt
```

Output:
```markdown
# Task: User Authentication System

## Overview
**Problem**: Users need secure authentication
**Solution**: Implement OAuth2 + JWT

## Functional Requirements
1. **OAuth2 Login** (must)
   Support Google and GitHub providers
   Acceptance Criteria:
   - User can login with Google
   - User can login with GitHub
   - OAuth tokens are securely stored

...
```

## 🔧 Configuration

Coming soon: support for custom config at `~/.fast-kit/config.yaml`

## 📝 License

MIT
