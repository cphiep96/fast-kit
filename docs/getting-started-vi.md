# Hướng Dẫn Sử Dụng Fast-Kit Cho Project Mới

> Hướng dẫn từng bước để sử dụng Fast-Kit trong dự án mới. Tài liệu này bằng tiếng Việt để dễ hiểu và áp dụng.

## 📖 Mục lục

1. [Giới thiệu Fast-Kit](#1-giới-thiệu-fast-kit)
2. [Cài đặt và Cấu hình](#2-cài-đặt-và-cấu-hình)
3. [Workflow Phát triển](#3-workflow-phát-triển)
4. [Ví dụ Thực tế](#4-ví-dụ-thực-tế)
5. [Các Prompts Thường Dùng](#5-các-prompts-thường-dùng)
6. [Best Practices](#6-best-practices)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Giới thiệu Fast-Kit

Fast-Kit là bộ công cụ AI giúp tăng tốc phát triển phần mềm, gồm 2 MCP servers chính:

### 🎯 SpecKit - Quản lý Specifications
- Tạo và quản lý tài liệu kỹ thuật (PRD, RFC, ADR, TechSpec, UserStory)
- Validate specs theo chuẩn
- Export specs thành prompts để code

### 🚀 PromptKit - Thư viện 23 Prompts
- **5 prompts Code Generation**: function, API, React component, database, algorithm
- **4 prompts Testing**: unit test, integration test, E2E test, test fixtures
- **3 prompts Debugging**: fix bug, analyze performance, debug async
- **4 prompts Refactoring**: refactor, extract function, simplify, modernize
- **3 prompts Code Review**: PR review, security audit, performance review
- **3 prompts Architecture**: system design, API design, design patterns
- **1 prompt Documentation**: add documentation

---

## 2. Cài đặt và Cấu hình

### Bước 1: Build các MCP Servers

```bash
# Clone hoặc vào thư mục fast-kit
cd d:\project\fast-kit

# Build SpecKit
cd implementations\mcp-servers\spec-kit
npm install
npm run build

# Build PromptKit
cd ..\prompt-kit
npm install
npm run build

# Kiểm tra build thành công
dir dist\index.js
```

### Bước 2: Cấu hình Claude Code

**Windows**: Mở file `%APPDATA%\claude\config.json`

Thêm cấu hình sau (thay đổi đường dẫn nếu cần):

```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["d:\\project\\fast-kit\\implementations\\mcp-servers\\spec-kit\\dist\\index.js"]
    },
    "prompt-kit": {
      "command": "node",
      "args": ["d:\\project\\fast-kit\\implementations\\mcp-servers\\prompt-kit\\dist\\index.js"]
    }
  }
}
```

**macOS/Linux**: File tại `~/.config/claude/config.json`

```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["/Users/yourname/project/fast-kit/implementations/mcp-servers/spec-kit/dist/index.js"]
    },
    "prompt-kit": {
      "command": "node",
      "args": ["/Users/yourname/project/fast-kit/implementations/mcp-servers/prompt-kit/dist/index.js"]
    }
  }
}
```

### Bước 3: Restart Claude Code và Kiểm tra

Đóng hoàn toàn Claude Code, sau đó mở lại và test:

```
List all available MCP servers
```

Bạn sẽ thấy `spec-kit` và `prompt-kit` trong danh sách.

```
List all prompts
```

Bạn sẽ thấy tất cả 23 prompts.

---

## 3. Workflow Phát triển

### 📋 Quy trình chuẩn

```
1. Tạo Spec (nếu là feature lớn)
   ↓
2. Chọn Prompt phù hợp
   ↓
3. Generate code
   ↓
4. Write tests
   ↓
5. Review code
   ↓
6. Commit & Deploy
```

### 🎯 Khi nào cần tạo Spec?

**✅ NÊN tạo Spec khi:**
- Feature mới phức tạp (> 3 ngày dev)
- Cần align với team/stakeholder
- Architecture decision quan trọng
- API design mới
- Thay đổi lớn về hệ thống

**❌ KHÔNG cần Spec khi:**
- Fix bug nhỏ
- Refactor nhỏ
- Update dependencies
- Prototype/POC nhanh

---

## 4. Ví dụ Thực tế

### 📝 Ví dụ 1: Làm Feature User Profile API từ đầu

#### Bước 1: Tạo PRD Specification

```
Create a PRD for user profile API with:
- Get user profile endpoint
- Update user profile endpoint
- Upload avatar endpoint
- Privacy settings
- Using Express.js and PostgreSQL
```

**Kết quả**: Nhận được `spec_id`, ví dụ `prd_abc123`

#### Bước 2: Design Database Schema

```
Use the database_schema prompt to create PostgreSQL schema for:
- users table: id, email, name, avatar_url, created_at
- user_profiles table: user_id, bio, location, website
- privacy_settings table: user_id, profile_public, show_email
```

**Output**: SQL schema với indexes và constraints

#### Bước 3: Create API Endpoints

**3.1 Get Profile Endpoint**
```
Use the api_endpoint prompt to create GET /api/users/:id/profile with:
- Express.js framework
- JWT authentication middleware
- Return user data + profile + privacy settings
- Handle 404 for not found
- Handle 403 for private profiles
```

**3.2 Update Profile Endpoint**
```
Use the api_endpoint prompt to create PUT /api/users/:id/profile with:
- Express.js
- JWT auth - only allow users to update their own profile
- Validate input data (bio max 500 chars, valid URL for website)
- Return updated profile
```

**3.3 Upload Avatar Endpoint**
```
Use the api_endpoint prompt to create POST /api/users/:id/avatar with:
- Express.js + multer for file upload
- JWT authentication
- Validate image file (jpg/png, max 5MB)
- Upload to S3 or local storage
- Update avatar_url in database
```

#### Bước 4: Write Tests

**4.1 Unit Tests**
```
Use the unit_test_creation prompt for getUserProfile function:
- Framework: Jest
- Test cases:
  * Successful fetch with all data
  * User not found returns 404
  * Private profile returns limited data
  * Unauthorized request returns 403
- Mock database calls
```

**4.2 Integration Tests**
```
Use the integration_test prompt for user profile flow:
- Test full workflow: create user → get profile → update profile → upload avatar
- Use Supertest for HTTP requests
- Use test database
```

#### Bước 5: Review Code

```
Use the review_pull_request prompt to review all code we created
```

```
Use the security_audit prompt to check authentication and authorization logic
```

```
Use the performance_review prompt to identify any performance issues
```

---

### 🐛 Ví dụ 2: Fix Bug trong Authentication

#### Bước 1: Analyze Bug

```
Use the fix_bug prompt with:

Code:
```javascript
function validateToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId;
}
```

Error: "jwt malformed" when token is undefined
Stack trace: [paste stack trace]
Expected: Should handle invalid/missing tokens gracefully
```

**Output**: Fixed code với proper error handling

#### Bước 2: Add Tests để prevent regression

```
Use the unit_test_creation prompt for validateToken function:
- Test with valid token
- Test with expired token
- Test with malformed token
- Test with undefined token
- Test with null token
```

---

### ♻️ Ví dụ 3: Refactor Legacy Code

#### Bước 1: Analyze Performance

```
Use the analyze_performance prompt for this function:

```javascript
function getUserOrders(userId) {
  const user = db.query('SELECT * FROM users WHERE id = ?', userId);
  const orders = db.query('SELECT * FROM orders WHERE user_id = ?', userId);

  orders.forEach(order => {
    order.items = db.query('SELECT * FROM order_items WHERE order_id = ?', order.id);
    order.items.forEach(item => {
      item.product = db.query('SELECT * FROM products WHERE id = ?', item.product_id);
    });
  });

  return { user, orders };
}
```

Performance issue: Takes 3-5 seconds for users with many orders
```

**Output**: Phân tích N+1 query problem và solution với JOIN queries

#### Bước 2: Refactor

```
Use the refactor_code prompt to:
- Eliminate N+1 queries
- Use JOIN statements
- Add caching if appropriate
- Maintain same functionality
```

#### Bước 3: Modernize Syntax

```
Use the modernize_code prompt to update this ES5 code to ES6+:
- Use async/await instead of callbacks
- Use const/let instead of var
- Use template literals
- Use arrow functions
```

#### Bước 4: Add Documentation

```
Use the add_documentation prompt to add JSDoc comments:
- Function description
- Parameter types and descriptions
- Return type
- Example usage
```

---

### 🏗️ Ví dụ 4: Design New System

#### Bước 1: System Architecture

```
Use the system_design prompt for a real-time chat application:
- Support 10,000 concurrent users
- Features: 1-on-1 chat, group chat, file sharing
- Technologies: Node.js backend
- Requirements: Low latency (< 100ms), high availability
```

**Output**: Complete system design với WebSocket, message queue, database schema, scaling strategy

#### Bước 2: API Design

```
Use the api_design prompt for chat system REST API:
- Resources: users, conversations, messages
- Authentication: JWT
- Real-time: WebSocket for messages
```

**Output**: API specification với all endpoints, request/response formats

#### Bước 3: Choose Design Patterns

```
Use the design_patterns prompt for:
Problem: Need to handle multiple message types (text, image, file, emoji)
Language: TypeScript
Current: Using if/else for each message type
```

**Output**: Recommendation to use Strategy pattern hoặc Command pattern

---

## 5. Các Prompts Thường Dùng

### 🔥 Top 10 Prompts cho Daily Development

| # | Prompt | Khi nào dùng | Ví dụ |
|---|--------|--------------|-------|
| 1 | `api_endpoint` | Tạo REST API endpoint | "Create POST /api/login endpoint" |
| 2 | `function_creation` | Tạo function mới | "Create validateEmail function" |
| 3 | `unit_test_creation` | Viết unit tests | "Write tests for login function" |
| 4 | `fix_bug` | Fix bug | "Fix null pointer error in getUserData" |
| 5 | `refactor_code` | Improve code quality | "Refactor this for readability" |
| 6 | `react_component` | Tạo React component | "Create UserCard component" |
| 7 | `review_pull_request` | Review code trước khi merge | "Review this PR" |
| 8 | `security_audit` | Check security issues | "Audit authentication code" |
| 9 | `add_documentation` | Add comments/docs | "Add JSDoc to these functions" |
| 10 | `database_schema` | Design database | "Design schema for blog system" |

### 📚 Full Prompt Reference

Xem chi tiết tất cả 23 prompts tại: [prompt-quick-reference.md](prompt-quick-reference.md)

---

## 6. Best Practices

### ✅ Viết Request tốt

**❌ BAD - Quá chung chung:**
```
Create a login function
```

**✅ GOOD - Chi tiết và rõ ràng:**
```
Use the function_creation prompt to create a login function:
- Language: TypeScript
- Parameters: email (string), password (string)
- Validate email format
- Hash password with bcrypt
- Check credentials against database
- Return JWT token on success
- Throw error for invalid credentials
- Include error handling and logging
```

### 🔄 Kết hợp nhiều Prompts

**Workflow hoàn chỉnh cho một feature:**

1. **Design Phase**
```
system_design → architecture overview
api_design → API endpoints specification
database_schema → data model
```

2. **Implementation Phase**
```
function_creation → core business logic
api_endpoint → REST endpoints
react_component → UI components
```

3. **Testing Phase**
```
unit_test_creation → unit tests
integration_test → integration tests
e2e_test → end-to-end tests
```

4. **Review Phase**
```
review_pull_request → code review
security_audit → security check
performance_review → performance check
```

### 💡 Tips cho kết quả tốt hơn

1. **Specify Language/Framework rõ ràng**
```
✅ "Create with TypeScript and Express.js"
❌ "Create an API"
```

2. **Provide Context**
```
✅ "This function will be called by the auth middleware"
❌ "Create a validation function"
```

3. **Include Constraints**
```
✅ "Must handle 1000 requests/second, response < 100ms"
❌ "Make it fast"
```

4. **Show Examples nếu có**
```
✅ "Input: {email: 'test@example.com', password: '123456'}"
    "Output: {token: 'jwt.token.here', userId: 123}"
```

---

## 7. Troubleshooting

### ❓ Servers không hiện trong Claude Code

**Kiểm tra:**

1. Verify build thành công:
```bash
cd implementations\mcp-servers\prompt-kit
dir dist\index.js
```

2. Test chạy trực tiếp:
```bash
node dist\index.js
```

3. Check config path đúng chưa:
```
%APPDATA%\claude\config.json  (Windows)
~/.config/claude/config.json  (Mac/Linux)
```

4. Restart Claude Code hoàn toàn (quit và mở lại)

### ❓ Prompt không cho kết quả như mong muốn

**Solutions:**

1. **Thêm chi tiết hơn** vào request
2. **Chia nhỏ** thành nhiều prompts
3. **Cung cấp examples** về input/output mong muốn
4. **Specify constraints** rõ ràng (performance, security, etc.)

### ❓ Quá nhiều prompts, không biết chọn

**Solutions:**

1. Xem [Quick Reference](prompt-quick-reference.md) để có table tham khảo
2. Search prompts:
```
Search for prompts about "testing"
Search for prompts about "API"
```

3. Xem details của prompt:
```
Show me the api_endpoint prompt with examples
```

---

## 📊 Workflow Templates cho Team

### 🎯 Feature Development Workflow

```
DAY 1: Planning & Design
├─ Tạo PRD spec (SpecKit)
├─ system_design prompt → Architecture
├─ api_design prompt → API spec
└─ database_schema prompt → DB design

DAY 2-3: Implementation
├─ api_endpoint prompt → Implement endpoints
├─ function_creation prompt → Business logic
├─ react_component prompt → UI (if needed)
└─ Continuous commit & push

DAY 4: Testing
├─ unit_test_creation → Unit tests
├─ integration_test → Integration tests
└─ Fix failing tests

DAY 5: Review & Deploy
├─ review_pull_request → Code review
├─ security_audit → Security check
├─ performance_review → Performance check
└─ Merge & Deploy
```

### 🐛 Bug Fix Workflow

```
1. Reproduce bug
   ↓
2. Use fix_bug prompt
   ↓
3. Use unit_test_creation (prevent regression)
   ↓
4. Test fix locally
   ↓
5. Create PR
   ↓
6. Use review_pull_request
   ↓
7. Merge & Deploy hotfix
```

### ♻️ Refactoring Workflow

```
1. analyze_performance → Identify issues
   ↓
2. refactor_code → Improve structure
   ↓
3. simplify_logic → Reduce complexity
   ↓
4. modernize_code → Update syntax
   ↓
5. unit_test_creation → Ensure no regression
   ↓
6. performance_review → Verify improvements
```

---

## 🎓 Learning Path

### Week 1: Làm quen với Prompts cơ bản
- [ ] `function_creation`
- [ ] `api_endpoint`
- [ ] `unit_test_creation`
- [ ] `fix_bug`

### Week 2: Testing & Quality
- [ ] `integration_test`
- [ ] `review_pull_request`
- [ ] `security_audit`
- [ ] `add_documentation`

### Week 3: Architecture & Design
- [ ] `database_schema`
- [ ] `system_design`
- [ ] `api_design`
- [ ] `design_patterns`

### Week 4: Advanced Workflows
- [ ] Combine multiple prompts
- [ ] Create custom prompts
- [ ] Build team templates
- [ ] Optimize workflow

---

## 📚 Resources

- **Quick Reference**: [prompt-quick-reference.md](prompt-quick-reference.md) - Cheat sheet cho tất cả prompts
- **Testing Guide**: [testing-promptkit.md](testing-promptkit.md) - 10 test scenarios
- **Config Guide**: [CLAUDE_CONFIG.md](../CLAUDE_CONFIG.md) - Setup instructions
- **Build Success**: [BUILD_SUCCESS.md](../BUILD_SUCCESS.md) - Build summary

---

## 💬 Support

- **GitHub Issues**: [fast-kit/issues](https://github.com/fast-kit/fast-kit/issues)
- **Email**: support@fast-kit.dev

---

## ⚡ Quick Start Checklist

- [ ] Build SpecKit và PromptKit
- [ ] Configure Claude Code config.json
- [ ] Restart Claude Code
- [ ] Test: `List all prompts`
- [ ] Try first prompt: `Use function_creation to create a hello world function`
- [ ] Read [prompt-quick-reference.md](prompt-quick-reference.md)
- [ ] Pick a real task và try workflow
- [ ] Share feedback với team

---

**🚀 Chúc bạn code hiệu quả với Fast-Kit!**

*Có câu hỏi? Mở issue trên GitHub hoặc liên hệ team.*
