# Getting Started with Fast-Kit

Welcome to Fast-Kit! This guide will help you get started with the essential package.

## 📋 What is Fast-Kit?

Fast-Kit is an AI-powered development acceleration toolkit that integrates with Claude Code to supercharge your development workflow. It provides:

- **SpecKit**: Manage specifications and requirements
- **ContextKit**: Smart project knowledge base (coming soon)
- **PromptKit**: Library of optimized AI prompts (coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PNPM 8+ (or npm/yarn)
- Claude Code CLI

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fast-kit.git
cd fast-kit
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Build SpecKit

```bash
cd implementations/mcp-servers/spec-kit
pnpm install
pnpm build
```

#### 4. Configure Claude Code

Add SpecKit to your Claude Code configuration:

**Location**: `~/.config/claude/config.json` (Linux/Mac) or `%APPDATA%\claude\config.json` (Windows)

```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["/absolute/path/to/fast-kit/implementations/mcp-servers/spec-kit/dist/index.js"]
    }
  }
}
```

**Windows Example**:
```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["D:\\project\\fast-kit\\implementations\\mcp-servers\\spec-kit\\dist\\index.js"]
    }
  }
}
```

#### 5. Restart Claude Code

```bash
# Restart Claude Code to load the new MCP server
claude-code
```

## 💡 Usage Examples

### Creating Specifications

#### Example 1: Create a PRD (Product Requirements Document)

```
You: Create a PRD spec for a user authentication system with OAuth2 and JWT
```

Claude Code will use SpecKit to create a structured PRD:
- Validates the spec format
- Stores it in `~/.fast-kit/specs/prd/`
- Returns the spec ID for future reference

#### Example 2: Create an RFC (Request for Comments)

```
You: Create an RFC for migrating from REST to GraphQL
```

#### Example 3: Create an ADR (Architecture Decision Record)

```
You: Create an ADR for choosing PostgreSQL over MongoDB for our user database
```

### Managing Specifications

#### List All Specs

```
You: Show me all my specifications
```

#### List Filtered Specs

```
You: Show me all draft PRDs
You: Show me all approved RFCs
```

#### Get Spec Details

```
You: Show me the details of spec abc123xyz
You: Export spec abc123xyz as markdown
```

### Exporting to Prompts

One of the most powerful features is exporting specs to Claude-ready prompts:

```
You: Export spec abc123xyz to a prompt

# Claude will generate a comprehensive prompt like:

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

You can then use this prompt to start coding immediately!

## 📁 Data Storage

Fast-Kit stores all data locally at `~/.fast-kit/`:

```
~/.fast-kit/
├── specs/
│   ├── prd/
│   │   └── {spec-id}.yaml
│   ├── rfc/
│   │   └── {spec-id}.yaml
│   ├── adr/
│   │   └── {spec-id}.yaml
│   ├── user_stories/
│   │   └── {spec-id}.yaml
│   └── api_specs/
│       └── {spec-id}.yaml
└── config.yaml (future)
```

## 🎨 Workflow Examples

### Workflow 1: Spec → Code

```mermaid
graph LR
    A[Write Spec in Notion] --> B[Parse with SpecKit]
    B --> C[Validate Spec]
    C --> D[Export to Prompt]
    D --> E[Code with Claude]
    E --> F[Create Tasks in Kanban]
```

**Steps**:
1. "Create a PRD for user profile API"
2. "Validate the spec"
3. "Export to prompt"
4. "Now implement the user profile API endpoint"

### Workflow 2: Quick Feature Development

```
You: I need to add a feature for password reset via email

Claude: Let me help you create a spec for that first.
[Creates PRD spec]

Claude: Here's your spec ID: abc123. Now let me export it as a prompt.
[Exports to structured prompt]

Claude: I'll now implement the password reset feature based on this spec.
[Implements code following the spec]
```

## 🛠️ Advanced Usage

### Direct Tool Calls

You can also use SpecKit tools directly in your prompts:

```
You: Use the create_spec tool to create a PRD titled "Real-time Chat"
with the following data:
{
  "overview": {
    "problem": "Users need real-time communication",
    "solution": "WebSocket-based chat system"
  }
}
```

### Validation

```
You: Validate spec abc123 with strict mode
```

### Template Information

```
You: What specification templates are available?
You: Show me the schema for PRD template
```

## 📚 Template Reference

### PRD (Product Requirements Document)
Best for: New features, products, major initiatives

**Required Fields**:
- Overview (problem, solution, target users, success metrics)
- Requirements (functional, non-functional)

### RFC (Request for Comments)
Best for: Technical proposals, architecture changes

**Required Fields**:
- Summary (problem, proposed solution, impact)
- Proposal (detailed design, alternatives)

### ADR (Architecture Decision Record)
Best for: Documenting technical decisions

**Required Fields**:
- Context
- Decision
- Consequences (positive, negative, neutral)

### User Story
Best for: Agile development, small features

**Required Fields**:
- As a / I want / So that
- Acceptance criteria

### API Specification
Best for: API design, endpoint documentation

**Required Fields**:
- Endpoints (method, path, parameters, responses)
- Data models

## 🐛 Troubleshooting

### "SpecKit server not found"

**Solution**: Check your Claude Code config path and ensure the node path is correct.

```bash
# Test the server manually
node /path/to/spec-kit/dist/index.js
```

### "Cannot find module"

**Solution**: Make sure you ran `pnpm build` in the spec-kit directory.

```bash
cd implementations/mcp-servers/spec-kit
pnpm install
pnpm build
```

### "Permission denied"

**Solution**: Check file permissions on the .fast-kit directory.

```bash
mkdir -p ~/.fast-kit
chmod 755 ~/.fast-kit
```

## 🎯 Next Steps

1. **Try Creating Your First Spec**
   - Use a template you're familiar with (e.g., PRD)
   - Validate it
   - Export to prompt

2. **Integrate with Your Workflow**
   - Create specs before coding
   - Use exported prompts for Claude
   - Build a library of reusable specs

3. **Stay Tuned**
   - ContextKit (coming soon): Smart codebase search
   - PromptKit (coming soon): 100+ optimized prompts
   - Notion Integration (coming soon): Sync with Notion

## 💬 Get Help

- **Issues**: [GitHub Issues](https://github.com/your-username/fast-kit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/fast-kit/discussions)
- **Documentation**: [Full Docs](./docs/)

## 📝 Example Session

Here's a complete example session:

```
You: Hi, I want to build a new feature for user notifications

Claude: Let me help you create a specification for that. I'll use SpecKit.

[Creates PRD spec]

Claude: I've created a PRD spec (ID: notif_abc123) for the user
notification system. Here's what I included:
- Push notifications
- Email notifications
- In-app notifications
- User preferences

Would you like me to:
1. Export this to a detailed prompt for implementation?
2. Create tasks in your Kanban board?
3. Start implementing right away?

You: Export to prompt and then start implementing

Claude: Here's the comprehensive prompt:
[Shows structured prompt with all requirements]

Now I'll implement the notification system following this spec...
[Implements code]
```

## 🚀 Tips for Success

1. **Start with Specs**: Always create a spec before coding major features
2. **Use Validation**: Validate specs to ensure completeness
3. **Export Often**: Use exported prompts for consistent coding
4. **Organize**: Tag your specs for easy searching
5. **Iterate**: Update specs as requirements change

---

Happy coding with Fast-Kit! 🚀

**Need Help?** Open an issue or join our discussions.
