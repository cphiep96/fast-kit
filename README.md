# Fast-Kit: Hệ Thống Tăng Tốc Code với AI

> Bộ công cụ toàn diện giúp tăng tốc phát triển phần mềm với Claude Code, MCP Servers và AI-powered workflows

## 📦 Giới Thiệu

Fast-Kit là một hệ sinh thái công cụ được thiết kế để tối ưu hóa quy trình phát triển phần mềm thông qua việc tích hợp Claude Code, Vibe Kanban và các MCP servers chuyên biệt.

## 🎯 Phân Cấp Sản Phẩm

### 🟢 Gói Tối Thiểu (Essential)
Phù hợp cho cá nhân và team nhỏ mới bắt đầu

1. **SpecKit** - Quản lý specifications và requirements
2. **ContextKit** - Quản lý context và kiến thức dự án
3. **PromptKit** - Thư viện prompts và templates
4. **Claude Code** - Core AI coding assistant
5. **Vibe Kanban** - Task và project management

### 🔵 Gói Cao Cấp (Professional)
Cho teams và organizations cần scale

6. **RepoContextKit** - Deep repository analysis và context
7. **QualityKit** - Code quality, testing và review automation
8. **ExecutionKit** - CI/CD integration và deployment workflows

## 📁 Cấu Trúc Dự Án

```
fast-kit/
├── specs/                      # Specifications cho từng kit
│   ├── essential/             # Specs cho gói tối thiểu
│   │   ├── spec-kit.md
│   │   ├── context-kit.md
│   │   └── prompt-kit.md
│   └── professional/          # Specs cho gói cao cấp
│       ├── repo-context-kit.md
│       ├── quality-kit.md
│       └── execution-kit.md
├── implementations/           # Code implementations
│   ├── mcp-servers/          # MCP server implementations
│   └── integrations/         # Integration code
├── templates/                 # Templates và boilerplates
│   ├── notion/               # Notion templates
│   ├── prompts/              # Prompt templates
│   └── workflows/            # Workflow templates
├── docs/                      # Documentation
│   ├── architecture.md       # System architecture
│   ├── getting-started.md    # Quick start guide
│   └── use-cases.md          # Use cases và examples
└── packages/                  # Package distribution
    ├── essential/            # Essential package
    └── professional/         # Professional package
```

## 🚀 Roadmap Sản Phẩm

### Phase 1: Foundation ✅ COMPLETED
- ✅ Thiết kế kiến trúc tổng thể
- ✅ Tạo specifications chi tiết (3 specs, ~3500 dòng)
- ✅ Setup cấu trúc dự án (monorepo with Turborepo)
- ✅ Implement SpecKit MCP server (fully working!)

### Phase 2: Essential Package ⚡ 80% DONE
- ✅ ~~Implement SpecKit MCP server~~ **DONE**
- ✅ ~~Implement PromptKit MCP server (23 prompts)~~ **DONE**
- ✅ ~~Documentation và examples~~ **DONE**
- 🔄 Implement ContextKit MCP server (Next)
- ⏳ Tạo Notion templates

### Phase 3: Professional Package
- Implement RepoContextKit
- Implement QualityKit
- Implement ExecutionKit
- Advanced workflows và automation

### Phase 4: SaaS Platform
- Web dashboard
- Cloud hosting cho MCP servers
- Team collaboration features
- Analytics và insights

## 💰 Mô Hình Kinh Doanh

### 1. **Notion Templates + Repo** (Giai đoạn 1)
- Bán templates qua Gumroad/Lemon Squeezy
- GitHub repo với docs và examples
- One-time purchase: $29-$49 (Essential), $99-$149 (Professional)

### 2. **Self-Hosted MCP Servers** (Giai đoạn 2)
- Open-source với premium features
- Freemium model với paid tiers
- Monthly: $15-$25 (Essential), $49-$79 (Professional)

### 3. **SaaS Platform** (Giai đoạn 3)
- Cloud-hosted solution
- Team plans và enterprise
- Monthly: $29-$49/user (Essential), $99-$149/user (Professional)

## 🎨 Tính Năng Chính

### Essential Package
- Spec templates và management
- Context tracking và knowledge base
- Prompt library với 100+ templates
- Task management với Vibe Kanban
- Claude Code integration guides

### Professional Package
- Advanced repository analysis
- Automated code review
- Quality metrics và reports
- CI/CD workflow templates
- Multi-repo management
- Team collaboration tools

## 🛠️ Tech Stack

- **MCP Servers**: TypeScript/Node.js
- **Frontend** (SaaS): Next.js + React
- **Backend** (SaaS): Node.js + PostgreSQL
- **Integration**: Claude Code + Vibe Kanban
- **Docs**: Notion + MDX

## 🎉 What's Working Now

**SpecKit MCP Server** ✅ **PromptKit MCP Server** ✅ are fully functional and ready to use!

### SpecKit Features:
- ✅ Create specifications (PRD, RFC, ADR, User Story, API Spec)
- ✅ Validate specs against schemas
- ✅ List and search specifications
- ✅ Export specs to Claude-ready prompts

### PromptKit Features:
- ✅ **23 production-ready prompts** across 6 categories:
  - 5 Code Generation prompts (function, API, React, database, algorithm)
  - 4 Testing prompts (unit, integration, E2E, fixtures)
  - 3 Debugging prompts (fix bug, performance, async)
  - 4 Refactoring prompts (refactor, extract, simplify, modernize)
  - 3 Code Review prompts (PR review, security, performance)
  - 3 Architecture prompts (system design, API design, patterns)
  - 1 Documentation prompt
- ✅ Search and filter prompts by category/tags
- ✅ Compose prompts with variable substitution
- ✅ Create custom prompts
- ✅ Token counting

[**→ Get Started in 5 Minutes**](./QUICK_START.md) | [**→ Full Vietnamese Guide**](./docs/getting-started-vi.md)

## 📚 Documentation

- [⚡ Quick Start (5 min)](./QUICK_START.md) - **Fastest way to start!**
- [🇻🇳 Hướng Dẫn Tiếng Việt](./docs/getting-started-vi.md) - **Chi tiết với ví dụ thực tế**
- [🚀 Getting Started Guide (EN)](./docs/getting-started.md)
- [📋 Prompt Quick Reference](./docs/prompt-quick-reference.md) - **Cheat sheet for all 23 prompts**
- [🧪 Testing Guide](./docs/testing-promptkit.md) - **10 test scenarios**
- [⚙️ Configuration Guide](./CLAUDE_CONFIG.md)
- [✅ Build Success Summary](./BUILD_SUCCESS.md)
- [📖 Architecture Overview](./docs/architecture.md)
- [📋 Specification Details](./specs/README.md)
- [SpecKit Documentation](./implementations/mcp-servers/spec-kit/README.md)
- [PromptKit Documentation](./implementations/mcp-servers/prompt-kit/README.md)

## 🤝 Contributing

Đang trong giai đoạn phát triển. Stay tuned!

## 📄 License

MIT License (to be updated)

---

**Built with ❤️ for developers who want to code faster with AI**
