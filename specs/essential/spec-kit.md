# SpecKit - Specification Management System

## 📋 Overview

SpecKit là MCP server đầu tiên trong Essential Package, giúp quản lý specifications, requirements và documentation một cách có cấu trúc và tích hợp với Claude Code.

## 🎯 Objectives

1. **Standardize Specs**: Cung cấp templates chuẩn cho các loại specs
2. **Auto-parsing**: Tự động parse specs từ nhiều nguồn
3. **Validation**: Đảm bảo specs đầy đủ và chính xác
4. **Claude Integration**: Export specs sang format phù hợp cho Claude Code

## 📐 Spec Templates

### 1. Product Requirements Document (PRD)

```yaml
template: prd
version: 1.0

metadata:
  title: string (required)
  author: string (required)
  date: date (auto)
  status: draft | review | approved | deprecated
  priority: low | medium | high | critical

overview:
  problem: string (required)
  solution: string (required)
  target_users: string[] (required)
  success_metrics: string[] (required)

requirements:
  functional:
    - id: string (auto-generated)
      title: string
      description: string
      acceptance_criteria: string[]
      priority: must | should | could | wont

  non_functional:
    - category: performance | security | scalability | usability
      requirement: string
      target: string

technical_considerations:
  constraints: string[]
  dependencies: string[]
  risks: string[]

implementation:
  phases:
    - name: string
      tasks: string[]
      estimated_effort: string
```

### 2. Request for Comments (RFC)

```yaml
template: rfc
version: 1.0

metadata:
  title: string (required)
  author: string (required)
  date: date (auto)
  status: draft | in-review | accepted | rejected | superseded
  rfc_number: number (auto)

summary:
  problem: string (required)
  proposed_solution: string (required)
  impact: string (required)

proposal:
  background: string
  detailed_design: string
  alternatives_considered:
    - option: string
      pros: string[]
      cons: string[]

  implementation_plan:
    - phase: string
      steps: string[]

considerations:
  backwards_compatibility: boolean
  performance_impact: string
  security_implications: string
  testing_strategy: string

open_questions: string[]
discussion: string
```

### 3. Architecture Decision Record (ADR)

```yaml
template: adr
version: 1.0

metadata:
  title: string (required)
  date: date (auto)
  status: proposed | accepted | deprecated | superseded
  adr_number: number (auto)
  deciders: string[] (required)

context: string (required)

decision: string (required)

rationale:
  factors: string[]
  assumptions: string[]
  constraints: string[]

consequences:
  positive: string[]
  negative: string[]
  neutral: string[]

alternatives:
  - option: string
    rejected_because: string

related_decisions: string[]
```

### 4. User Story

```yaml
template: user_story
version: 1.0

metadata:
  id: string (auto)
  epic: string
  priority: low | medium | high | critical
  points: number
  status: backlog | ready | in_progress | review | done

story:
  as_a: string (required)
  i_want: string (required)
  so_that: string (required)

acceptance_criteria:
  - given: string
    when: string
    then: string

technical_notes: string
dependencies: string[]
attachments: string[]
```

### 5. API Specification

```yaml
template: api_spec
version: 1.0

metadata:
  api_name: string (required)
  version: string (required)
  base_url: string

endpoints:
  - method: GET | POST | PUT | DELETE | PATCH
    path: string (required)
    description: string

    parameters:
      - name: string
        in: path | query | header | body
        type: string | number | boolean | object | array
        required: boolean
        description: string

    request_body:
      content_type: application/json | application/xml | multipart/form-data
      schema: object
      example: object

    responses:
      - status: number
        description: string
        schema: object
        example: object

    authentication: none | bearer | api_key | oauth2
    rate_limit: string

data_models:
  - name: string
    properties:
      - name: string
        type: string
        required: boolean
        description: string
```

## 🔧 MCP Server Methods

### 1. Spec Management

#### `create_spec`
Tạo spec mới từ template

```typescript
interface CreateSpecRequest {
  template: 'prd' | 'rfc' | 'adr' | 'user_story' | 'api_spec';
  title: string;
  data?: Partial<SpecData>;
  source?: 'manual' | 'notion' | 'markdown';
}

interface CreateSpecResponse {
  spec_id: string;
  template: string;
  created_at: string;
  validation_status: 'valid' | 'incomplete' | 'invalid';
  validation_errors?: string[];
}
```

**Usage**:
```typescript
const result = await mcp.call('create_spec', {
  template: 'prd',
  title: 'User Authentication System',
  data: {
    overview: {
      problem: 'Users need secure login',
      solution: 'OAuth2 + JWT authentication'
    }
  }
});
```

#### `parse_spec`
Parse spec từ nguồn bên ngoài (Notion, Markdown, etc)

```typescript
interface ParseSpecRequest {
  source: 'notion' | 'markdown' | 'url';
  source_id?: string; // Notion page ID
  content?: string;   // Markdown content
  url?: string;       // URL to fetch
  template_hint?: string; // Suggest template type
}

interface ParseSpecResponse {
  spec_id: string;
  detected_template: string;
  parsed_data: SpecData;
  confidence: number; // 0-1
  parsing_warnings?: string[];
}
```

#### `validate_spec`
Validate spec theo template rules

```typescript
interface ValidateSpecRequest {
  spec_id: string;
  strict?: boolean; // Default: false
}

interface ValidateSpecResponse {
  valid: boolean;
  completeness: number; // 0-100%
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}
```

#### `get_spec`
Lấy spec details

```typescript
interface GetSpecRequest {
  spec_id: string;
  format?: 'yaml' | 'json' | 'markdown';
}

interface GetSpecResponse {
  spec_id: string;
  template: string;
  data: SpecData;
  metadata: SpecMetadata;
  content?: string; // If format specified
}
```

#### `list_specs`
List tất cả specs với filtering

```typescript
interface ListSpecsRequest {
  template?: string;
  status?: string;
  tags?: string[];
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title';
  limit?: number;
  offset?: number;
}

interface ListSpecsResponse {
  specs: SpecSummary[];
  total: number;
  has_more: boolean;
}

interface SpecSummary {
  spec_id: string;
  template: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}
```

#### `update_spec`
Update spec data

```typescript
interface UpdateSpecRequest {
  spec_id: string;
  data: Partial<SpecData>;
  merge?: boolean; // Default: true
}

interface UpdateSpecResponse {
  spec_id: string;
  updated_at: string;
  validation_status: string;
}
```

#### `delete_spec`
Xóa spec

```typescript
interface DeleteSpecRequest {
  spec_id: string;
  permanent?: boolean; // Default: false (soft delete)
}

interface DeleteSpecResponse {
  success: boolean;
  spec_id: string;
}
```

### 2. Export & Integration

#### `export_to_prompt`
Export spec sang format prompt cho Claude Code

```typescript
interface ExportToPromptRequest {
  spec_id: string;
  include_context?: boolean;
  prompt_template?: string; // Custom template
}

interface ExportToPromptResponse {
  prompt: string;
  context_files?: string[];
  suggested_tasks?: string[];
}
```

**Example Output**:
```markdown
# Task: Implement User Authentication System

## Overview
Problem: Users need secure login
Solution: OAuth2 + JWT authentication

## Requirements
### Functional Requirements
1. [FR-001] User registration with email/password
   - Accept email and password
   - Validate email format
   - Hash password securely

2. [FR-002] OAuth2 login flow
   - Support Google and GitHub providers
   - Handle OAuth callbacks
   - Exchange tokens

### Non-Functional Requirements
- Performance: Login should complete in < 500ms
- Security: Use bcrypt for password hashing (min 12 rounds)

## Implementation Tasks
1. Setup authentication database schema
2. Implement OAuth2 integration
3. Create JWT token service
4. Build login/register API endpoints
5. Add security middleware
```

#### `export_to_kanban`
Export spec sang tasks cho Vibe Kanban

```typescript
interface ExportToKanbanRequest {
  spec_id: string;
  project_id: string;
  create_tasks?: boolean; // Auto-create tasks
  assign_to?: string;
}

interface ExportToKanbanResponse {
  tasks: KanbanTask[];
  created?: boolean;
}

interface KanbanTask {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: string;
  spec_reference: string;
}
```

#### `export_to_markdown`
Export spec sang Markdown file

```typescript
interface ExportToMarkdownRequest {
  spec_id: string;
  template?: 'github' | 'notion' | 'custom';
  output_path?: string;
}

interface ExportToMarkdownResponse {
  content: string;
  file_path?: string;
}
```

### 3. Template Management

#### `list_templates`
List available templates

```typescript
interface ListTemplatesResponse {
  templates: TemplateInfo[];
}

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  fields: FieldSchema[];
}
```

#### `get_template`
Get template details

```typescript
interface GetTemplateRequest {
  template_id: string;
}

interface GetTemplateResponse {
  template: TemplateInfo;
  schema: object; // JSON Schema
  example: object;
}
```

#### `create_custom_template`
Tạo custom template

```typescript
interface CreateCustomTemplateRequest {
  name: string;
  description: string;
  schema: object; // JSON Schema
  base_template?: string; // Extend from existing
}

interface CreateCustomTemplateResponse {
  template_id: string;
  created_at: string;
}
```

## 💾 Data Storage

### File Structure
```
~/.fast-kit/
├── specs/
│   ├── prd/
│   │   ├── {spec-id}.yaml
│   │   └── {spec-id}.md
│   ├── rfc/
│   ├── adr/
│   └── user_stories/
├── templates/
│   ├── builtin/
│   │   ├── prd.schema.json
│   │   ├── rfc.schema.json
│   │   └── adr.schema.json
│   └── custom/
└── config.yaml
```

### Config File
```yaml
# ~/.fast-kit/config.yaml
spec_kit:
  storage:
    type: local | notion
    path: ~/.fast-kit/specs

  notion:
    api_key: ${NOTION_API_KEY}
    database_id: xxx

  defaults:
    template: prd
    auto_validate: true
    auto_export: false

  integrations:
    vibe_kanban:
      enabled: true
      auto_sync: false

    claude_code:
      enabled: true
      prompt_template: default
```

## 🔌 Notion Integration

### Database Schema
```
Specs Database
├── Title (title)
├── Template (select): PRD, RFC, ADR, User Story, API Spec
├── Status (select): Draft, Review, Approved, Deprecated
├── Priority (select): Low, Medium, High, Critical
├── Created (created_time)
├── Updated (last_edited_time)
├── Author (created_by)
├── Spec ID (text)
├── Content (rich_text)
└── Related Tasks (relation to Tasks DB)
```

### Sync Strategy
- **One-way sync**: Notion → SpecKit (read-only)
- **Two-way sync**: Full bidirectional sync (Professional)
- **Polling**: Every 5 minutes for changes
- **Webhooks**: Real-time updates (SaaS only)

## 🎨 CLI Commands

```bash
# Initialize SpecKit
fast-kit spec init

# Create new spec
fast-kit spec create --template prd --title "User Auth System"

# Parse from Notion
fast-kit spec parse --notion <page-id>

# Validate spec
fast-kit spec validate <spec-id>

# Export to prompt
fast-kit spec export <spec-id> --format prompt

# List all specs
fast-kit spec list --template prd --status approved

# Interactive editor
fast-kit spec edit <spec-id>
```

## 🧪 Testing Strategy

### Unit Tests
- Template validation
- Spec parsing accuracy
- Export format correctness

### Integration Tests
- Notion API sync
- Vibe Kanban integration
- Claude Code prompt generation

### Test Data
```yaml
test_specs/
├── valid/
│   ├── prd-complete.yaml
│   ├── rfc-accepted.yaml
│   └── adr-proposed.yaml
├── invalid/
│   ├── prd-missing-required.yaml
│   └── rfc-invalid-status.yaml
└── edge_cases/
    ├── large-spec.yaml
    └── unicode-content.yaml
```

## 📊 Success Metrics

### Phase 1 (MVP)
- 5 core templates implemented
- Parse accuracy > 90%
- Validation coverage > 95%
- Response time < 100ms

### Phase 2 (Enhancement)
- 10+ templates
- Notion sync reliability > 99%
- Custom template support
- Export to 3+ formats

## 🚀 Implementation Phases

### Phase 1: Core (Week 1-2)
- [ ] Setup MCP server boilerplate
- [ ] Implement 5 core templates
- [ ] Basic CRUD operations
- [ ] File-based storage
- [ ] Validation engine

### Phase 2: Integration (Week 3-4)
- [ ] Notion API integration
- [ ] Vibe Kanban export
- [ ] Claude Code prompt generation
- [ ] CLI commands

### Phase 3: Advanced (Week 5-6)
- [ ] Custom templates
- [ ] Advanced parsing (AI-assisted)
- [ ] Template versioning
- [ ] Migration tools

## 📚 Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "yaml": "^2.3.4",
    "zod": "^3.22.4",
    "ajv": "^8.12.0",
    "@notionhq/client": "^2.2.14",
    "markdown-it": "^14.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.0.0",
    "@types/node": "^20.10.0"
  }
}
```

## 🔐 Security Considerations

1. **Input Validation**: Validate all user inputs against schemas
2. **API Keys**: Store Notion API keys securely (env vars)
3. **File Permissions**: Restrict spec files to user-only
4. **XSS Prevention**: Sanitize markdown content
5. **Rate Limiting**: Respect Notion API limits

## 📖 Example Workflows

### Workflow 1: Create PRD from Scratch
```bash
# Step 1: Create spec
fast-kit spec create --template prd --title "Payment Integration"

# Step 2: Edit interactively
fast-kit spec edit spec-001

# Step 3: Validate
fast-kit spec validate spec-001

# Step 4: Export to prompt
fast-kit spec export spec-001 --format prompt > payment-task.md

# Step 5: Use in Claude Code
claude-code --prompt payment-task.md
```

### Workflow 2: Parse from Notion
```bash
# Parse Notion page
fast-kit spec parse --notion abc123

# Review parsed data
fast-kit spec show spec-002

# Fix any issues
fast-kit spec edit spec-002

# Export to Kanban
fast-kit spec export spec-002 --to-kanban --project my-project
```

---

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-01-10
