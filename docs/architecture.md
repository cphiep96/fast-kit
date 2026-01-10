# Fast-Kit System Architecture

## 🏗️ Tổng Quan Kiến Trúc

Fast-Kit được thiết kế theo mô hình **Layered Architecture** với các thành phần độc lập nhưng tích hợp chặt chẽ.

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
│  (Claude Code CLI, Notion Workspace, Web Dashboard)        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                  Integration Layer                          │
│         (MCP Protocol, API Gateway, Webhooks)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼────┐  ┌──────▼─────┐  ┌────▼──────┐
│  Essential │  │Professional│  │   Core    │
│   Kits     │  │   Kits     │  │ Services  │
└────────────┘  └────────────┘  └───────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Data Layer                               │
│  (Local Files, Notion DB, PostgreSQL, Vector Store)        │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Architecture

### 1. Essential Kits (Gói Tối Thiểu)

#### SpecKit
**Mục đích**: Quản lý specifications, requirements và documentation

```
SpecKit
├── Input Sources
│   ├── Manual specs (Markdown, YAML)
│   ├── Notion pages
│   └── PRD documents
├── Processing
│   ├── Spec parser
│   ├── Template engine
│   └── Validation engine
└── Output
    ├── Structured specs (JSON/YAML)
    ├── Task breakdown
    └── Claude-ready prompts
```

**Core Features**:
- Spec templates (PRD, RFC, ADR, User Stories)
- Auto-parsing từ Notion/Markdown
- Validation và checklist
- Export to Claude Code format

**MCP Server Methods**:
```typescript
- create_spec(template, data)
- parse_spec(source)
- validate_spec(spec_id)
- get_spec(spec_id)
- list_specs(filter)
- export_to_prompt(spec_id)
```

#### ContextKit
**Mục đích**: Quản lý knowledge base và project context

```
ContextKit
├── Context Sources
│   ├── Project README
│   ├── Architecture docs
│   ├── API documentation
│   └── Decision records (ADR)
├── Knowledge Base
│   ├── Vector embeddings
│   ├── Semantic search
│   └── Context retrieval
└── Context Management
    ├── Auto-summarization
    ├── Context ranking
    └── Context injection
```

**Core Features**:
- Knowledge base tự động từ docs
- Semantic search trong codebase
- Context cho từng task
- Auto-inject context vào prompts

**MCP Server Methods**:
```typescript
- add_context(source, content)
- search_context(query)
- get_relevant_context(task_id)
- summarize_context(doc_id)
- list_contexts(category)
```

#### PromptKit
**Mục đích**: Library prompts và prompt engineering

```
PromptKit
├── Prompt Templates
│   ├── Code generation
│   ├── Refactoring
│   ├── Testing
│   ├── Documentation
│   └── Debugging
├── Prompt Composer
│   ├── Template variables
│   ├── Context injection
│   └── Chain prompts
└── Prompt Analytics
    ├── Usage tracking
    └── Effectiveness metrics
```

**Core Features**:
- 100+ prompt templates
- Custom prompt builder
- Prompt chaining
- A/B testing prompts

**MCP Server Methods**:
```typescript
- get_prompt(category, name)
- list_prompts(filter)
- create_custom_prompt(template)
- compose_prompt(template, context)
- track_prompt_usage(prompt_id)
```

### 2. Professional Kits (Gói Cao Cấp)

#### RepoContextKit
**Mục đích**: Deep analysis và understanding của codebase

```
RepoContextKit
├── Code Analysis
│   ├── AST parsing
│   ├── Dependency graph
│   └── Code metrics
├── Repository Intelligence
│   ├── Pattern detection
│   ├── Architecture mapping
│   └── Change impact analysis
└── Multi-Repo Management
    ├── Monorepo support
    ├── Cross-repo dependencies
    └── Unified context
```

**Core Features**:
- Full codebase analysis
- Architecture visualization
- Impact analysis
- Multi-repo context

**MCP Server Methods**:
```typescript
- analyze_repo(repo_path)
- get_architecture_map()
- analyze_impact(file_path)
- get_dependencies(module)
- search_code_pattern(pattern)
```

#### QualityKit
**Mục đích**: Code quality, testing và automated review

```
QualityKit
├── Code Review Automation
│   ├── Style checking
│   ├── Best practices
│   └── Security scanning
├── Testing Automation
│   ├── Test generation
│   ├── Coverage analysis
│   └── Test optimization
└── Quality Metrics
    ├── Code complexity
    ├── Maintainability index
    └── Technical debt tracking
```

**Core Features**:
- AI-powered code review
- Auto test generation
- Quality gates
- Refactoring suggestions

**MCP Server Methods**:
```typescript
- review_code(file_path, rules)
- generate_tests(file_path)
- check_quality(repo_path)
- suggest_refactoring(file_path)
- get_quality_metrics()
```

#### ExecutionKit
**Mục đích**: CI/CD workflows và deployment automation

```
ExecutionKit
├── Workflow Management
│   ├── CI/CD templates
│   ├── Pipeline generation
│   └── Deployment scripts
├── Execution Tracking
│   ├── Build monitoring
│   ├── Deployment status
│   └── Rollback automation
└── Integration
    ├── GitHub Actions
    ├── GitLab CI
    └── Jenkins
```

**Core Features**:
- CI/CD template generation
- Deployment automation
- Monitoring và alerts
- Rollback strategies

**MCP Server Methods**:
```typescript
- generate_pipeline(config)
- execute_workflow(workflow_id)
- monitor_build(build_id)
- trigger_deployment(env)
- rollback_deployment(version)
```

### 3. Core Services

#### Vibe Kanban Integration
```
Vibe Kanban
├── Project Management
│   ├── Task tracking
│   ├── Sprint planning
│   └── Progress monitoring
└── Integration Points
    ├── Auto task creation from specs
    ├── Context linking
    └── Status sync
```

#### Claude Code Integration
```
Claude Code
├── Command Extensions
│   ├── Custom slash commands
│   └── Hooks integration
├── MCP Server Registry
│   ├── Auto-discovery
│   └── Configuration management
└── Workflow Automation
    ├── Task-driven coding
    └── Context-aware assistance
```

## 🔄 Data Flow

### 1. Spec-to-Code Flow
```
User writes spec in Notion
    ↓
SpecKit parses và validates
    ↓
Auto-creates tasks in Vibe Kanban
    ↓
ContextKit prepares relevant context
    ↓
PromptKit generates optimal prompt
    ↓
Claude Code executes with full context
    ↓
QualityKit reviews output
    ↓
ExecutionKit deploys if approved
```

### 2. Context Flow
```
Repository + Docs
    ↓
RepoContextKit analyzes
    ↓
ContextKit indexes
    ↓
User starts task
    ↓
Auto-retrieve relevant context
    ↓
Inject into Claude Code session
```

## 🛠️ Technology Stack

### MCP Servers
- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Protocol**: MCP (Model Context Protocol)
- **IPC**: stdio/SSE

### Data Storage
- **Local Mode**: File-based (JSON/YAML)
- **Notion Mode**: Notion API
- **SaaS Mode**: PostgreSQL + Vector DB (Pinecone/Weaviate)

### Vector Search
- **Embeddings**: OpenAI/Claude embeddings
- **Storage**: Chroma (local) / Pinecone (cloud)

### Frontend (SaaS)
- **Framework**: Next.js 14+
- **UI**: shadcn/ui + Tailwind
- **State**: Zustand/Jotai

### Backend (SaaS)
- **API**: tRPC/Next.js API routes
- **Database**: PostgreSQL + Prisma
- **Queue**: BullMQ + Redis

## 🔐 Security & Privacy

### Essential Package
- **Data Storage**: 100% local
- **Privacy**: No data leaves machine
- **Access**: File system permissions

### Professional Package
- **Data Storage**: Local or Notion
- **Privacy**: Optional cloud sync
- **Access**: Token-based auth

### SaaS Platform
- **Data Storage**: Encrypted cloud
- **Privacy**: SOC 2 compliant
- **Access**: RBAC + SSO

## 📊 Scalability Considerations

### Phase 1 (Essential)
- **Users**: 1-10 devs per team
- **Storage**: Local files
- **Performance**: In-process

### Phase 2 (Professional)
- **Users**: 10-50 devs
- **Storage**: Notion + local cache
- **Performance**: Optimized indexing

### Phase 3 (SaaS)
- **Users**: 50-1000+ devs
- **Storage**: Distributed database
- **Performance**: CDN + caching + load balancing

## 🚀 Deployment Models

### 1. Local Installation
```bash
npm install -g fast-kit
fast-kit init --package essential
```

### 2. Docker Compose
```yaml
services:
  fast-kit-servers:
    image: fast-kit/essential:latest
    volumes:
      - ./projects:/workspace
```

### 3. Cloud Hosted (SaaS)
```
https://app.fast-kit.dev
```

## 🔌 Integration Points

### With Claude Code
```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "npx",
      "args": ["fast-kit-spec-server"]
    },
    "context-kit": {
      "command": "npx",
      "args": ["fast-kit-context-server"]
    }
  }
}
```

### With Vibe Kanban
- Webhook integration
- API sync
- Real-time updates

### With Notion
- Database sync
- Page templates
- Two-way sync

## 📈 Performance Targets

### Response Times
- MCP method calls: < 100ms
- Context search: < 500ms
- Code analysis: < 5s for medium repos

### Throughput
- Essential: 10 concurrent operations
- Professional: 100 concurrent operations
- SaaS: 1000+ concurrent users

## 🧪 Testing Strategy

### Unit Tests
- Each MCP method
- Core utilities
- Template rendering

### Integration Tests
- MCP server communication
- Notion API sync
- Vibe Kanban integration

### E2E Tests
- Full workflows
- Multi-kit scenarios
- Real-world use cases

## 📝 Next Steps

1. Implement Essential kits MVP
2. Create Notion templates
3. Build Professional kits
4. Develop SaaS platform
5. Launch beta program

---

**Version**: 0.1.0
**Last Updated**: 2026-01-10
