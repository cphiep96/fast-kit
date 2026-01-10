# ContextKit - Project Knowledge Management System

## 📋 Overview

ContextKit là hệ thống quản lý knowledge base và project context, giúp AI hiểu sâu về dự án thông qua semantic search và intelligent context retrieval.

## 🎯 Objectives

1. **Knowledge Indexing**: Tự động index tất cả docs, code, comments
2. **Semantic Search**: Tìm kiếm thông minh dựa trên ý nghĩa
3. **Context Assembly**: Tự động tập hợp context phù hợp cho từng task
4. **Auto-Learning**: Học từ codebase và interactions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│          Context Sources                    │
│  (Docs, Code, Comments, Commits, Issues)   │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │   Content Parser  │
         │  (AST, Markdown)  │
         └─────────┬─────────┘
                   │
         ┌─────────▼─────────┐
         │  Embeddings Gen   │
         │ (Vector Storage)  │
         └─────────┬─────────┘
                   │
         ┌─────────▼─────────┐
         │  Context Engine   │
         │ (Search, Rank)    │
         └─────────┬─────────┘
                   │
         ┌─────────▼─────────┐
         │  Context Assembly │
         │  (Prompt Ready)   │
         └───────────────────┘
```

## 📚 Context Sources

### 1. Documentation
```typescript
interface DocumentationSource {
  type: 'readme' | 'docs' | 'wiki' | 'changelog' | 'api_docs';
  path: string;
  format: 'markdown' | 'mdx' | 'rst' | 'asciidoc';
  metadata: {
    title: string;
    category: string;
    tags: string[];
    last_updated: string;
  };
}
```

**Supported Formats**:
- `README.md`, `CONTRIBUTING.md`
- `/docs` folder structure
- API documentation (OpenAPI, JSDoc, etc)
- Architecture Decision Records (ADRs)
- Change logs and release notes

### 2. Code Context
```typescript
interface CodeContext {
  file_path: string;
  language: string;
  symbols: Symbol[];
  imports: Import[];
  exports: Export[];
  comments: Comment[];
}

interface Symbol {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type' | 'const';
  signature: string;
  doc_comment?: string;
  line_start: number;
  line_end: number;
}
```

**Extracted Information**:
- Function signatures and docstrings
- Class definitions and methods
- Interfaces and types
- Important constants and configs
- Inline comments explaining complex logic

### 3. Git History
```typescript
interface GitContext {
  commits: Commit[];
  branch_info: BranchInfo;
  recent_changes: FileChange[];
}

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files_changed: string[];
  reasoning?: string; // Extracted from commit message
}
```

**Insights**:
- Recent changes and why they were made
- File change patterns
- Contributor expertise by file
- Evolution of specific components

### 4. Issues & Discussions
```typescript
interface IssueContext {
  source: 'github' | 'gitlab' | 'jira' | 'linear';
  issue_id: string;
  title: string;
  description: string;
  comments: Comment[];
  labels: string[];
  status: string;
  related_files?: string[];
}
```

**Context Value**:
- Known bugs and limitations
- Feature requests and discussions
- Technical decisions and trade-offs
- User feedback and pain points

### 5. External References
```typescript
interface ExternalReference {
  type: 'library_docs' | 'blog_post' | 'stack_overflow' | 'video';
  url: string;
  title: string;
  summary: string;
  relevance_score: number;
}
```

## 🔧 MCP Server Methods

### 1. Context Indexing

#### `index_project`
Index toàn bộ project lần đầu

```typescript
interface IndexProjectRequest {
  project_path: string;
  include_patterns?: string[]; // ['src/**/*.ts', 'docs/**/*.md']
  exclude_patterns?: string[]; // ['node_modules', 'dist']
  options?: {
    include_git_history?: boolean;
    max_file_size?: number; // MB
    follow_symlinks?: boolean;
  };
}

interface IndexProjectResponse {
  indexed_files: number;
  indexed_chunks: number;
  embeddings_created: number;
  duration_ms: number;
  index_id: string;
}
```

#### `update_index`
Cập nhật index khi có thay đổi

```typescript
interface UpdateIndexRequest {
  project_path: string;
  changed_files?: string[]; // If known
  incremental?: boolean; // Default: true
}

interface UpdateIndexResponse {
  files_updated: number;
  files_added: number;
  files_removed: number;
  duration_ms: number;
}
```

#### `watch_project`
Auto-update index khi file changes

```typescript
interface WatchProjectRequest {
  project_path: string;
  debounce_ms?: number; // Default: 1000
}

interface WatchProjectResponse {
  watching: boolean;
  watch_id: string;
}
```

### 2. Context Search

#### `search_context`
Semantic search trong knowledge base

```typescript
interface SearchContextRequest {
  query: string;
  project_path?: string;
  filters?: {
    source_types?: ('docs' | 'code' | 'git' | 'issues')[];
    file_patterns?: string[];
    date_range?: { from: string; to: string };
  };
  limit?: number; // Default: 10
  threshold?: number; // Min relevance score (0-1)
}

interface SearchContextResponse {
  results: ContextResult[];
  total_found: number;
  search_time_ms: number;
}

interface ContextResult {
  content: string;
  source: {
    type: string;
    path: string;
    line_range?: [number, number];
  };
  relevance_score: number; // 0-1
  metadata: Record<string, any>;
  preview: string; // Highlighted excerpt
}
```

**Example**:
```typescript
// Search for authentication-related context
const results = await mcp.call('search_context', {
  query: 'how is user authentication implemented?',
  filters: {
    source_types: ['docs', 'code']
  },
  limit: 5
});

// Results:
// 1. auth.ts:15-45 - AuthService class implementation
// 2. README.md:Authentication - Auth flow documentation
// 3. auth.test.ts:20-30 - Auth test cases
// 4. security.md - Security considerations
// 5. user.model.ts:10-20 - User model with auth fields
```

#### `find_related`
Tìm context liên quan đến file/symbol

```typescript
interface FindRelatedRequest {
  target: string; // File path or symbol name
  relation_types?: ('imports' | 'exports' | 'calls' | 'similar')[];
  depth?: number; // Default: 2
}

interface FindRelatedResponse {
  related_files: RelatedFile[];
  related_symbols: RelatedSymbol[];
  dependency_graph?: DependencyNode;
}

interface RelatedFile {
  path: string;
  relation: string;
  relevance: number;
}
```

### 3. Context Assembly

#### `get_relevant_context`
Lấy context phù hợp cho một task

```typescript
interface GetRelevantContextRequest {
  task_description: string;
  task_files?: string[]; // Known files to work on
  max_tokens?: number; // Limit context size
  include_examples?: boolean;
}

interface GetRelevantContextResponse {
  context: AssembledContext;
  total_tokens: number;
  confidence: number;
}

interface AssembledContext {
  overview: string;
  relevant_docs: DocumentSection[];
  relevant_code: CodeSection[];
  dependencies: string[];
  patterns: CodePattern[];
  warnings?: string[];
}

interface DocumentSection {
  title: string;
  content: string;
  source: string;
  relevance: number;
}

interface CodeSection {
  file: string;
  lines: [number, number];
  code: string;
  explanation: string;
  relevance: number;
}

interface CodePattern {
  pattern: string;
  description: string;
  examples: string[];
}
```

**Example Output**:
```markdown
# Context: Implement User Profile API

## Overview
This project uses Express.js with TypeScript and follows a service-repository pattern.

## Relevant Documentation
### API Design Patterns (docs/api-design.md)
- All endpoints use `/api/v1` prefix
- Return standardized response: { success, data, error }
- Use middleware for auth: `authenticateUser()`

### Database Schema (docs/database.md)
- User table: id, email, name, avatar_url, created_at
- Use Prisma ORM for database access

## Relevant Code Examples
### Similar Endpoint (src/api/posts.ts:15-45)
```typescript
router.get('/:id', authenticateUser, async (req, res) => {
  const post = await postService.getById(req.params.id);
  res.json({ success: true, data: post });
});
```

### Service Pattern (src/services/user.service.ts:20-40)
```typescript
class UserService {
  async getById(id: string) {
    return await userRepository.findById(id);
  }
}
```

## Dependencies
- Express Router setup: src/api/index.ts
- Auth middleware: src/middleware/auth.ts
- User service: src/services/user.service.ts
- User repository: src/repositories/user.repository.ts

## Patterns to Follow
1. Use async/await for all DB operations
2. Validate input with Zod schemas
3. Handle errors with try-catch and error middleware
4. Write unit tests in `__tests__` folder

## Warnings
⚠️ Don't expose sensitive user data (password_hash, etc)
⚠️ Always use parameterized queries to prevent SQL injection
```

#### `get_file_context`
Lấy full context cho một file

```typescript
interface GetFileContextRequest {
  file_path: string;
  include_related?: boolean;
  include_history?: boolean;
}

interface GetFileContextResponse {
  file_info: FileInfo;
  symbols: Symbol[];
  dependencies: FileDependency[];
  recent_changes?: Commit[];
  related_files?: RelatedFile[];
}
```

### 4. Knowledge Base Management

#### `add_knowledge`
Thêm knowledge mới manually

```typescript
interface AddKnowledgeRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  source?: string;
  metadata?: Record<string, any>;
}

interface AddKnowledgeResponse {
  knowledge_id: string;
  indexed: boolean;
}
```

#### `update_knowledge`
Update knowledge entry

```typescript
interface UpdateKnowledgeRequest {
  knowledge_id: string;
  content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

#### `list_knowledge`
List knowledge entries

```typescript
interface ListKnowledgeRequest {
  category?: string;
  tags?: string[];
  search?: string;
  limit?: number;
}

interface ListKnowledgeResponse {
  entries: KnowledgeEntry[];
  total: number;
}

interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  created_at: string;
  relevance?: number;
}
```

### 5. Analytics & Insights

#### `get_project_insights`
Phân tích project patterns và insights

```typescript
interface GetProjectInsightsRequest {
  project_path: string;
  aspect?: 'architecture' | 'patterns' | 'complexity' | 'coverage';
}

interface GetProjectInsightsResponse {
  insights: ProjectInsight[];
  summary: string;
}

interface ProjectInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
}
```

**Example Insights**:
- "This project follows MVC architecture pattern"
- "Most files use dependency injection via constructor"
- "Error handling uses custom Error classes"
- "Tests are colocated with source files"

## 💾 Data Storage

### File Structure
```
~/.fast-kit/
├── context/
│   ├── projects/
│   │   └── {project-hash}/
│   │       ├── index.db          # SQLite for metadata
│   │       ├── embeddings/       # Vector embeddings
│   │       │   ├── docs.vec
│   │       │   └── code.vec
│   │       ├── chunks/           # Indexed chunks
│   │       │   ├── chunk-001.json
│   │       │   └── chunk-002.json
│   │       └── knowledge/        # Manual knowledge
│   │           └── custom.yaml
│   └── cache/
│       └── embeddings.cache      # LRU cache
└── config.yaml
```

### Index Database Schema (SQLite)
```sql
-- Files table
CREATE TABLE files (
  id INTEGER PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  type TEXT, -- 'code' | 'docs' | 'config'
  language TEXT,
  size INTEGER,
  last_modified TEXT,
  hash TEXT,
  indexed_at TEXT
);

-- Chunks table (for semantic search)
CREATE TABLE chunks (
  id INTEGER PRIMARY KEY,
  file_id INTEGER,
  content TEXT,
  start_line INTEGER,
  end_line INTEGER,
  chunk_type TEXT, -- 'function' | 'class' | 'paragraph'
  embedding_id TEXT,
  FOREIGN KEY (file_id) REFERENCES files(id)
);

-- Symbols table
CREATE TABLE symbols (
  id INTEGER PRIMARY KEY,
  file_id INTEGER,
  name TEXT,
  type TEXT,
  signature TEXT,
  doc_comment TEXT,
  line_start INTEGER,
  line_end INTEGER,
  FOREIGN KEY (file_id) REFERENCES files(id)
);

-- Knowledge entries
CREATE TABLE knowledge (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  category TEXT,
  tags TEXT, -- JSON array
  source TEXT,
  created_at TEXT,
  metadata TEXT -- JSON
);
```

### Vector Storage
```typescript
interface VectorStore {
  // Chroma DB for local, Pinecone for cloud
  add_embeddings(chunks: Chunk[], embeddings: number[][]): Promise<void>;
  search(query_embedding: number[], k: number): Promise<SearchResult[]>;
  delete_by_file(file_id: string): Promise<void>;
}
```

## 🧠 Embedding Strategy

### Chunking Strategy
```typescript
interface ChunkingConfig {
  max_chunk_size: number; // 512 tokens
  overlap: number; // 50 tokens
  respect_boundaries: boolean; // Don't split functions/classes
}
```

**Code Chunking**:
- Function/method as single chunk
- Class as multiple chunks (one per method)
- Imports/exports in separate chunk

**Docs Chunking**:
- Paragraph-level chunking
- Keep headers with content
- Preserve code blocks

### Embedding Generation
```typescript
interface EmbeddingProvider {
  type: 'openai' | 'claude' | 'local';
  model: string; // 'text-embedding-3-small'
  dimensions: number; // 1536
  batch_size: number; // 100
}
```

**Default**: OpenAI `text-embedding-3-small` (1536 dim)

**Cost Optimization**:
- Cache embeddings by content hash
- Batch API calls
- Only re-embed changed content

## 🔌 Integrations

### 1. Claude Code Integration
```typescript
// Auto-inject context into Claude sessions
interface ClaudeIntegration {
  on_task_start: (task: Task) => Promise<Context>;
  on_file_edit: (file: string) => Promise<RelatedContext>;
}
```

### 2. Vibe Kanban Integration
```typescript
// Link context to tasks
interface KanbanIntegration {
  attach_context_to_task: (task_id: string, context: Context) => Promise<void>;
  get_task_context: (task_id: string) => Promise<Context>;
}
```

### 3. Git Hooks
```bash
# .git/hooks/post-commit
#!/bin/bash
fast-kit context update --incremental
```

## 🎨 CLI Commands

```bash
# Index project
fast-kit context index ./my-project

# Search context
fast-kit context search "how to add new API endpoint"

# Get file context
fast-kit context file src/api/users.ts --related

# Watch for changes
fast-kit context watch ./my-project

# Add manual knowledge
fast-kit context add --title "Coding Standards" --category guidelines

# Project insights
fast-kit context insights --aspect architecture

# Clear cache
fast-kit context clear-cache

# Export context
fast-kit context export --format markdown > project-context.md
```

## 🧪 Testing Strategy

### Test Data
```
test-projects/
├── simple-express/
│   ├── src/
│   ├── docs/
│   └── README.md
├── react-app/
└── monorepo/
```

### Test Cases
1. **Indexing**
   - Small project (< 100 files)
   - Large project (> 1000 files)
   - Incremental updates
   - File deletions

2. **Search Quality**
   - Exact matches
   - Semantic matches
   - Multi-language search
   - Ranking accuracy

3. **Context Assembly**
   - Relevance of results
   - Token budget management
   - Context freshness

### Performance Benchmarks
- Index 1000 files: < 30s
- Search query: < 500ms
- Context assembly: < 2s
- Memory usage: < 500MB for 10k files

## 📊 Success Metrics

### Quality Metrics
- Search relevance: > 80% (user feedback)
- Context usefulness: > 75% (task completion rate)
- Index freshness: < 5min lag

### Performance Metrics
- Indexing speed: > 50 files/sec
- Search latency: < 500ms (p95)
- Memory efficiency: < 1MB per file indexed

## 🚀 Implementation Phases

### Phase 1: Core Indexing (Week 1-2)
- [ ] File system crawler
- [ ] Content parsers (Markdown, TypeScript, etc)
- [ ] SQLite database setup
- [ ] Basic chunking strategy

### Phase 2: Embeddings (Week 3-4)
- [ ] OpenAI embeddings integration
- [ ] Vector storage (Chroma)
- [ ] Semantic search
- [ ] Caching layer

### Phase 3: Context Assembly (Week 5-6)
- [ ] Relevance ranking algorithm
- [ ] Context templating
- [ ] Token budget management
- [ ] Multi-source aggregation

### Phase 4: Advanced Features (Week 7-8)
- [ ] Git history analysis
- [ ] Project insights
- [ ] Watch mode
- [ ] Performance optimization

## 📚 Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "chromadb": "^1.7.0",
    "openai": "^4.20.0",
    "@typescript-eslint/parser": "^6.14.0",
    "markdown-it": "^14.0.0",
    "chokidar": "^3.5.3",
    "sqlite3": "^5.1.6",
    "better-sqlite3": "^9.2.2",
    "tiktoken": "^1.0.10"
  }
}
```

## 🔐 Security

1. **Local-first**: All data stored locally by default
2. **No data transmission**: Embeddings generated locally (optional)
3. **File permissions**: Respect OS permissions
4. **Sanitization**: Clean all user inputs
5. **API key security**: Use env vars for OpenAI key

## 📖 Example Workflows

### Workflow 1: Index New Project
```bash
# Initial index
fast-kit context index ~/projects/my-app

# Output:
# ✓ Indexed 347 files
# ✓ Created 1,842 chunks
# ✓ Generated 1,842 embeddings
# ✓ Duration: 23.4s
```

### Workflow 2: Search Before Coding
```bash
# Search for relevant context
fast-kit context search "how to add API authentication"

# Output:
# 📄 docs/api-guide.md:45-67 (relevance: 0.92)
#   Authentication uses JWT tokens. Add the authenticateUser
#   middleware to protected routes...
#
# 💻 src/middleware/auth.ts:15-40 (relevance: 0.88)
#   export const authenticateUser = async (req, res, next) => {
#     const token = req.headers.authorization?.split(' ')[1];
#     ...
#
# 📝 src/api/posts.ts:10 (relevance: 0.75)
#   router.post('/', authenticateUser, createPost);
```

### Workflow 3: Auto-Context in Claude
```bash
# Start Claude with auto-context
claude-code

# User: "Add a new endpoint for user profile"
# ContextKit automatically injects:
# - Similar API endpoint examples
# - Auth middleware docs
# - Database schema for User
# - API design patterns
```

---

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-01-10
