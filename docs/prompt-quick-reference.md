# PromptKit Quick Reference

Quick reference for all 23 prompts in PromptKit.

## 📝 Code Generation (5)

### 1. function_creation
**Use when**: Need to create a new function
**Example**: "Create a calculateTax function in TypeScript"
**Required**: function_name, purpose, language
**Optional**: parameters, return_type, constraints

### 2. api_endpoint
**Use when**: Building REST/GraphQL API endpoints
**Example**: "Create POST /api/users endpoint with Express"
**Required**: endpoint_type, path, description
**Optional**: method, authentication, framework

### 3. react_component
**Use when**: Creating React components
**Example**: "Create a UserCard component with avatar and name"
**Required**: component_name, purpose
**Optional**: props, state_needed, use_typescript

### 4. database_schema
**Use when**: Designing database structure
**Example**: "Design schema for e-commerce with products and orders"
**Required**: database_type, schema_purpose, entities
**Optional**: use_orm

### 5. algorithm_implementation
**Use when**: Implementing specific algorithms
**Example**: "Implement binary search in Python"
**Required**: algorithm_name, algorithm_description, language
**Optional**: input_constraints, optimize_for

---

## 🧪 Testing (4)

### 6. unit_test_creation
**Use when**: Need unit tests for functions/classes
**Example**: "Write unit tests for my validateEmail function"
**Required**: code, language
**Optional**: test_framework, coverage_targets

### 7. integration_test
**Use when**: Testing component interactions
**Example**: "Write integration tests for user registration flow"
**Required**: component_to_test
**Optional**: test_framework, test_scenarios

### 8. e2e_test
**Use when**: Testing complete user workflows
**Example**: "Create E2E test for checkout process"
**Required**: user_workflow, workflow_steps
**Optional**: test_tool

### 9. test_fixtures
**Use when**: Need test data
**Example**: "Generate user test fixtures with edge cases"
**Required**: data_type
**Optional**: schema, num_examples

---

## 🐛 Debugging (3)

### 10. fix_bug
**Use when**: Need to debug and fix code
**Example**: "Fix this error: Cannot read property..."
**Required**: code, error_description
**Optional**: stack_trace, expected_behavior

### 11. analyze_performance
**Use when**: Code is slow
**Example**: "Why is this function taking 5 seconds?"
**Required**: code
**Optional**: performance_metrics, expected_performance

### 12. debug_async_issue
**Use when**: Async/promise problems
**Example**: "Fix race condition in this async code"
**Required**: code, issue_description
**Optional**: language

---

## ♻️ Refactoring (4)

### 13. refactor_code
**Use when**: Improving code quality
**Example**: "Refactor this for better readability"
**Required**: code, goal
**Optional**: keep_behavior

### 14. extract_function
**Use when**: Removing code duplication
**Example**: "Extract repeated validation logic"
**Required**: code
**Optional**: code_to_extract, new_function_name

### 15. simplify_logic
**Use when**: Code is too complex
**Example**: "Simplify these nested if statements"
**Required**: code
**Optional**: complexity_issue

### 16. modernize_code
**Use when**: Updating legacy code
**Example**: "Update this ES5 code to modern JavaScript"
**Required**: code, language
**Optional**: target_version

---

## 👀 Code Review (3)

### 17. review_pull_request
**Use when**: Reviewing PRs
**Example**: "Review this pull request"
**Required**: code_changes
**Optional**: pr_description, focus_areas

### 18. security_audit
**Use when**: Checking for vulnerabilities
**Example**: "Audit this authentication code for security issues"
**Required**: code
**Optional**: code_type

### 19. performance_review
**Use when**: Finding performance issues
**Example**: "Review this code for performance problems"
**Required**: code
**Optional**: performance_requirements

---

## 🏗️ Architecture (3)

### 20. system_design
**Use when**: Designing system architecture
**Example**: "Design architecture for a chat app"
**Required**: project_description, requirements
**Optional**: scale, constraints

### 21. api_design
**Use when**: Designing API architecture
**Example**: "Design REST API for blog platform"
**Required**: api_purpose, resources
**Optional**: api_type, authentication_type

### 22. design_patterns
**Use when**: Need design pattern recommendations
**Example**: "What pattern should I use for this notification system?"
**Required**: problem_description, language
**Optional**: current_code

---

## 📚 Documentation (1)

### 23. add_documentation
**Use when**: Need to document code
**Example**: "Add JSDoc comments to this function"
**Required**: code
**Optional**: doc_style, include_examples

---

## 💡 Usage Tips

### Quick Commands

**List prompts**:
```
Show me all code generation prompts
Show me all testing prompts
Search for prompts about "API"
```

**Use a prompt**:
```
Use the [prompt_name] prompt to [your task]
```

**Get help**:
```
Show me details for the function_creation prompt
What variables does api_endpoint need?
```

### Best Practices

1. **Be Specific**: More details = better results
2. **Include Context**: Mention language, framework, constraints
3. **Provide Examples**: Show what you want if possible
4. **Iterate**: Refine the output if needed

### Common Patterns

**Pattern 1: Full Feature**
```
1. Use system_design → Architecture
2. Use api_design → API spec
3. Use database_schema → DB design
4. Use api_endpoint → Implementation
5. Use unit_test_creation → Tests
6. Use review_pull_request → Review
```

**Pattern 2: Bug Fix**
```
1. Use fix_bug → Initial fix
2. Use refactor_code → Improve quality
3. Use unit_test_creation → Prevent regression
```

**Pattern 3: Code Quality**
```
1. Use security_audit → Find vulnerabilities
2. Use performance_review → Find bottlenecks
3. Use simplify_logic → Reduce complexity
4. Use add_documentation → Document changes
```

---

## 🎯 Cheat Sheet

| Task | Prompt to Use |
|------|---------------|
| Create function | `function_creation` |
| Create API | `api_endpoint` |
| Create component | `react_component` |
| Design database | `database_schema` |
| Write algorithm | `algorithm_implementation` |
| Write tests | `unit_test_creation` |
| Integration test | `integration_test` |
| E2E test | `e2e_test` |
| Test data | `test_fixtures` |
| Fix bug | `fix_bug` |
| Slow code | `analyze_performance` |
| Async bug | `debug_async_issue` |
| Improve quality | `refactor_code` |
| Remove duplication | `extract_function` |
| Simplify code | `simplify_logic` |
| Modernize | `modernize_code` |
| Review PR | `review_pull_request` |
| Security check | `security_audit` |
| Performance check | `performance_review` |
| System architecture | `system_design` |
| API architecture | `api_design` |
| Design pattern | `design_patterns` |
| Add docs | `add_documentation` |

---

**Print this guide** and keep it handy while coding! 📋
