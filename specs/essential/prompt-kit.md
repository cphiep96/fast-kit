# PromptKit - AI Prompt Library & Engineering System

## 📋 Overview

PromptKit là thư viện prompts và prompt engineering system, cung cấp 100+ templates được tối ưu cho các tác vụ phát triển phần mềm thường gặp.

## 🎯 Objectives

1. **Prompt Library**: Cung cấp templates chất lượng cao cho mọi task
2. **Prompt Composition**: Xây dựng prompts phức tạp từ các components
3. **Context Injection**: Tự động inject context phù hợp
4. **Performance Tracking**: Đo lường hiệu quả của prompts

## 📚 Prompt Categories

### 1. Code Generation
```yaml
category: code_generation
templates:
  - function_creation
  - class_implementation
  - api_endpoint
  - data_model
  - utility_function
  - algorithm_implementation
```

### 2. Refactoring
```yaml
category: refactoring
templates:
  - extract_function
  - rename_variables
  - simplify_logic
  - remove_duplication
  - optimize_performance
  - modernize_code
```

### 3. Testing
```yaml
category: testing
templates:
  - unit_tests
  - integration_tests
  - e2e_tests
  - test_fixtures
  - mock_setup
  - edge_cases
```

### 4. Documentation
```yaml
category: documentation
templates:
  - function_docstring
  - class_documentation
  - api_documentation
  - readme_section
  - inline_comments
  - changelog_entry
```

### 5. Debugging
```yaml
category: debugging
templates:
  - find_bug
  - fix_error
  - analyze_stack_trace
  - performance_issue
  - memory_leak
  - race_condition
```

### 6. Code Review
```yaml
category: code_review
templates:
  - review_pr
  - security_audit
  - performance_review
  - style_check
  - best_practices
  - suggest_improvements
```

### 7. Architecture
```yaml
category: architecture
templates:
  - system_design
  - database_schema
  - api_design
  - component_structure
  - design_patterns
  - scalability_plan
```

### 8. Migration
```yaml
category: migration
templates:
  - language_migration
  - framework_upgrade
  - api_version_migration
  - database_migration
  - dependency_update
```

## 🔧 Prompt Template Structure

### Template Schema
```typescript
interface PromptTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  version: string;

  metadata: {
    author: string;
    created_at: string;
    updated_at: string;
    tags: string[];
    model_optimized_for?: string[]; // ['claude-3.5', 'gpt-4']
    avg_success_rate?: number;
  };

  variables: VariableDefinition[];
  template: string;

  examples?: PromptExample[];
  chain?: PromptChain;

  settings?: {
    temperature?: number;
    max_tokens?: number;
    stop_sequences?: string[];
  };
}

interface VariableDefinition {
  name: string;
  type: 'string' | 'code' | 'file_path' | 'list' | 'boolean';
  description: string;
  required: boolean;
  default?: any;
  validation?: {
    pattern?: string;
    min_length?: number;
    max_length?: number;
    allowed_values?: string[];
  };
}

interface PromptExample {
  input: Record<string, any>;
  output: string;
  explanation?: string;
}

interface PromptChain {
  steps: ChainStep[];
  aggregate?: 'concat' | 'merge' | 'select_best';
}

interface ChainStep {
  prompt_id: string;
  input_mapping: Record<string, string>;
  condition?: string;
}
```

### Example Template: Function Creation

```yaml
id: function_creation_v1
category: code_generation
name: Create Function
description: Generate a function implementation based on requirements

version: 1.0.0

metadata:
  author: fast-kit
  created_at: 2026-01-10
  tags: [function, implementation, coding]
  model_optimized_for: [claude-3.5-sonnet]
  avg_success_rate: 0.92

variables:
  - name: function_name
    type: string
    description: Name of the function to create
    required: true
    validation:
      pattern: "^[a-zA-Z_][a-zA-Z0-9_]*$"

  - name: purpose
    type: string
    description: What the function should do
    required: true
    validation:
      min_length: 10

  - name: language
    type: string
    description: Programming language
    required: true
    allowed_values: [typescript, python, javascript, rust, go]

  - name: parameters
    type: list
    description: Function parameters
    required: false
    default: []

  - name: return_type
    type: string
    description: Expected return type
    required: false

  - name: constraints
    type: list
    description: Any constraints or requirements
    required: false

  - name: existing_code
    type: code
    description: Related existing code for context
    required: false

template: |
  # Task: Implement `{{function_name}}` function

  ## Requirements
  {{purpose}}

  ## Specifications
  - Language: {{language}}
  {{#if parameters}}
  - Parameters:
  {{#each parameters}}
    - `{{this.name}}` ({{this.type}}): {{this.description}}
  {{/each}}
  {{/if}}
  {{#if return_type}}
  - Returns: {{return_type}}
  {{/if}}

  {{#if constraints}}
  ## Constraints
  {{#each constraints}}
  - {{this}}
  {{/each}}
  {{/if}}

  {{#if existing_code}}
  ## Related Code
  ```{{language}}
  {{existing_code}}
  ```
  {{/if}}

  ## Instructions
  1. Implement the function following best practices for {{language}}
  2. Add appropriate error handling
  3. Include inline comments for complex logic
  4. Ensure the code is efficient and readable

  Please provide:
  1. The complete function implementation
  2. Brief explanation of key decisions
  3. Example usage

examples:
  - input:
      function_name: calculateTotal
      purpose: Calculate total price with tax and discount
      language: typescript
      parameters:
        - name: price
          type: number
          description: Base price
        - name: taxRate
          type: number
          description: Tax rate (0-1)
        - name: discount
          type: number
          description: Discount percentage (0-100)
      return_type: number
      constraints:
        - Price must be non-negative
        - Tax rate between 0 and 1
        - Discount between 0 and 100

    output: |
      ```typescript
      function calculateTotal(
        price: number,
        taxRate: number,
        discount: number
      ): number {
        // Validate inputs
        if (price < 0) throw new Error('Price must be non-negative');
        if (taxRate < 0 || taxRate > 1) throw new Error('Tax rate must be between 0 and 1');
        if (discount < 0 || discount > 100) throw new Error('Discount must be between 0 and 100');

        // Calculate discounted price
        const discountedPrice = price * (1 - discount / 100);

        // Apply tax
        const total = discountedPrice * (1 + taxRate);

        return Number(total.toFixed(2));
      }
      ```

      **Key Decisions:**
      - Added input validation to ensure data integrity
      - Round to 2 decimal places for currency precision
      - Use clear variable names for readability

      **Example Usage:**
      ```typescript
      const total = calculateTotal(100, 0.1, 20); // $88.00
      // Base: $100, 20% discount = $80, 10% tax = $88
      ```

settings:
  temperature: 0.3
  max_tokens: 2000
```

## 🔧 MCP Server Methods

### 1. Prompt Discovery

#### `list_prompts`
List available prompts with filtering

```typescript
interface ListPromptsRequest {
  category?: string;
  tags?: string[];
  search?: string;
  language?: string;
  sort_by?: 'name' | 'category' | 'success_rate' | 'created_at';
  limit?: number;
}

interface ListPromptsResponse {
  prompts: PromptSummary[];
  total: number;
  categories: string[];
}

interface PromptSummary {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  success_rate?: number;
}
```

#### `get_prompt`
Get full prompt template

```typescript
interface GetPromptRequest {
  prompt_id: string;
  include_examples?: boolean;
}

interface GetPromptResponse {
  template: PromptTemplate;
  usage_stats?: {
    total_uses: number;
    success_rate: number;
    avg_completion_time: number;
  };
}
```

#### `search_prompts`
Semantic search for prompts

```typescript
interface SearchPromptsRequest {
  query: string; // "how to write unit tests"
  limit?: number;
}

interface SearchPromptsResponse {
  results: PromptMatch[];
}

interface PromptMatch {
  prompt: PromptSummary;
  relevance: number;
  matching_reason: string;
}
```

### 2. Prompt Composition

#### `compose_prompt`
Render prompt với variables

```typescript
interface ComposePromptRequest {
  prompt_id: string;
  variables: Record<string, any>;
  inject_context?: boolean; // Auto-inject from ContextKit
  context_query?: string;
}

interface ComposePromptResponse {
  rendered_prompt: string;
  injected_context?: InjectedContext;
  token_count: number;
  validation_errors?: ValidationError[];
}

interface InjectedContext {
  sources: ContextSource[];
  token_count: number;
}
```

**Example**:
```typescript
const result = await mcp.call('compose_prompt', {
  prompt_id: 'function_creation_v1',
  variables: {
    function_name: 'processPayment',
    purpose: 'Process credit card payment securely',
    language: 'typescript',
    parameters: [
      { name: 'amount', type: 'number', description: 'Payment amount' },
      { name: 'cardToken', type: 'string', description: 'Tokenized card' }
    ],
    return_type: 'Promise<PaymentResult>'
  },
  inject_context: true,
  context_query: 'payment processing examples'
});

// result.rendered_prompt contains full prompt ready for Claude
```

#### `create_custom_prompt`
Create custom prompt template

```typescript
interface CreateCustomPromptRequest {
  name: string;
  category: string;
  description: string;
  template: string;
  variables: VariableDefinition[];
  base_template?: string; // Extend existing
}

interface CreateCustomPromptResponse {
  prompt_id: string;
  created_at: string;
}
```

#### `chain_prompts`
Create prompt chain for multi-step tasks

```typescript
interface ChainPromptsRequest {
  name: string;
  description: string;
  steps: ChainStepDefinition[];
  aggregate?: 'concat' | 'merge' | 'select_best';
}

interface ChainStepDefinition {
  prompt_id: string;
  variables: Record<string, any>;
  output_variable: string; // Name for next step
  condition?: string; // When to execute
}

interface ChainPromptsResponse {
  chain_id: string;
  estimated_tokens: number;
}
```

**Example Chain: Code Review Flow**
```typescript
// Step 1: Analyze code
// Step 2: Find issues
// Step 3: Suggest fixes
// Step 4: Generate improved version

await mcp.call('chain_prompts', {
  name: 'comprehensive_code_review',
  steps: [
    {
      prompt_id: 'analyze_code',
      variables: { code: '...' },
      output_variable: 'analysis'
    },
    {
      prompt_id: 'find_issues',
      variables: { analysis: '{{analysis}}' },
      output_variable: 'issues'
    },
    {
      prompt_id: 'suggest_fixes',
      variables: { issues: '{{issues}}' },
      output_variable: 'suggestions'
    }
  ],
  aggregate: 'concat'
});
```

### 3. Prompt Optimization

#### `optimize_prompt`
Analyze và improve prompt

```typescript
interface OptimizePromptRequest {
  prompt_id: string;
  optimization_goals?: ('clarity' | 'conciseness' | 'specificity')[];
  test_cases?: TestCase[];
}

interface OptimizePromptResponse {
  original_prompt: string;
  optimized_prompt: string;
  improvements: Improvement[];
  estimated_improvement: number; // percentage
}

interface Improvement {
  type: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}
```

#### `test_prompt`
Test prompt với examples

```typescript
interface TestPromptRequest {
  prompt_id: string;
  test_cases: TestCase[];
  model?: string;
}

interface TestCase {
  input: Record<string, any>;
  expected_output?: string;
  validation_criteria?: string[];
}

interface TestPromptResponse {
  results: TestResult[];
  overall_score: number;
}

interface TestResult {
  test_case: TestCase;
  actual_output: string;
  passed: boolean;
  score: number;
  feedback: string;
}
```

### 4. Analytics & Tracking

#### `track_usage`
Track prompt usage và success

```typescript
interface TrackUsageRequest {
  prompt_id: string;
  variables: Record<string, any>;
  output: string;
  success: boolean;
  feedback?: string;
  metadata?: {
    completion_time_ms: number;
    token_count: number;
    model: string;
  };
}

interface TrackUsageResponse {
  tracked: boolean;
  usage_id: string;
}
```

#### `get_analytics`
Get prompt performance analytics

```typescript
interface GetAnalyticsRequest {
  prompt_id?: string;
  category?: string;
  date_range?: { from: string; to: string };
}

interface GetAnalyticsResponse {
  metrics: PromptMetrics;
  trends: Trend[];
  top_performing: PromptSummary[];
  recommendations: string[];
}

interface PromptMetrics {
  total_uses: number;
  success_rate: number;
  avg_completion_time_ms: number;
  avg_tokens: number;
  user_satisfaction: number; // 0-5 stars
}
```

## 📦 Built-in Prompt Templates

### Code Generation (15 templates)
1. **function_creation** - Create function from spec
2. **class_implementation** - Implement class with methods
3. **api_endpoint** - Create REST/GraphQL endpoint
4. **data_model** - Define data models/schemas
5. **utility_function** - Helper functions
6. **algorithm** - Implement specific algorithm
7. **component** - React/Vue component
8. **hook** - Custom React hook
9. **middleware** - Express/Next.js middleware
10. **service_layer** - Business logic service
11. **repository** - Data access repository
12. **factory** - Factory pattern implementation
13. **decorator** - Decorator pattern
14. **singleton** - Singleton pattern
15. **observer** - Observer pattern

### Refactoring (12 templates)
1. **extract_function** - Extract code to function
2. **extract_class** - Extract code to class
3. **rename_for_clarity** - Improve naming
4. **simplify_conditional** - Simplify if/else
5. **remove_duplication** - DRY principle
6. **split_large_function** - Break down complexity
7. **replace_magic_numbers** - Use constants
8. **modernize_syntax** - Update to latest syntax
9. **optimize_loops** - Performance improvement
10. **reduce_nesting** - Flatten nested code
11. **improve_error_handling** - Better errors
12. **add_type_safety** - Add types/interfaces

### Testing (10 templates)
1. **unit_test_function** - Test single function
2. **unit_test_class** - Test class methods
3. **integration_test** - Test component integration
4. **e2e_test** - End-to-end test
5. **test_fixtures** - Create test data
6. **mock_setup** - Mock dependencies
7. **edge_cases** - Test edge cases
8. **error_cases** - Test error handling
9. **performance_test** - Load/stress test
10. **snapshot_test** - UI snapshot test

### Documentation (8 templates)
1. **function_docstring** - Document function
2. **class_documentation** - Document class
3. **api_docs** - API endpoint docs
4. **readme_section** - README section
5. **inline_comments** - Code comments
6. **changelog_entry** - Changelog entry
7. **architecture_doc** - Architecture overview
8. **user_guide** - User documentation

### Debugging (10 templates)
1. **find_bug** - Locate bug in code
2. **fix_error** - Fix specific error
3. **analyze_stack_trace** - Debug from trace
4. **performance_issue** - Find bottleneck
5. **memory_leak** - Detect memory leak
6. **race_condition** - Find race condition
7. **logical_error** - Fix logic bug
8. **integration_bug** - Debug integration
9. **regression_bug** - Fix regression
10. **flaky_test** - Fix flaky test

### Code Review (8 templates)
1. **review_pr** - Review pull request
2. **security_audit** - Security review
3. **performance_review** - Performance check
4. **style_check** - Code style review
5. **best_practices** - Best practices check
6. **accessibility_review** - A11y review
7. **suggest_improvements** - Suggestions
8. **breaking_changes** - Check breaking changes

### Architecture (10 templates)
1. **system_design** - High-level design
2. **database_schema** - DB schema design
3. **api_design** - API architecture
4. **component_structure** - Frontend structure
5. **microservices** - Microservices design
6. **event_driven** - Event architecture
7. **caching_strategy** - Cache design
8. **scalability_plan** - Scaling strategy
9. **security_architecture** - Security design
10. **deployment_strategy** - Deployment plan

### Migration (7 templates)
1. **javascript_to_typescript** - JS → TS
2. **class_to_hooks** - Class → Hooks
3. **rest_to_graphql** - REST → GraphQL
4. **sql_to_nosql** - SQL → NoSQL
5. **framework_upgrade** - Version upgrade
6. **dependency_update** - Update deps
7. **api_version_migration** - API v1 → v2

## 💾 Data Storage

### File Structure
```
~/.fast-kit/
├── prompts/
│   ├── builtin/
│   │   ├── code_generation/
│   │   │   ├── function_creation.yaml
│   │   │   └── class_implementation.yaml
│   │   ├── refactoring/
│   │   ├── testing/
│   │   └── ...
│   ├── custom/
│   │   └── user-defined.yaml
│   └── chains/
│       └── code-review-flow.yaml
├── analytics/
│   ├── usage.db          # SQLite
│   └── feedback.json
└── config.yaml
```

### Analytics Database
```sql
CREATE TABLE prompt_usage (
  id INTEGER PRIMARY KEY,
  prompt_id TEXT,
  timestamp TEXT,
  variables TEXT, -- JSON
  output_preview TEXT,
  success BOOLEAN,
  completion_time_ms INTEGER,
  token_count INTEGER,
  model TEXT,
  feedback_score INTEGER, -- 1-5
  feedback_text TEXT
);

CREATE TABLE prompt_performance (
  prompt_id TEXT PRIMARY KEY,
  total_uses INTEGER,
  successful_uses INTEGER,
  avg_completion_time_ms REAL,
  avg_tokens REAL,
  avg_feedback_score REAL,
  last_used TEXT
);
```

## 🎨 CLI Commands

```bash
# List prompts
fast-kit prompt list --category code_generation

# Search prompts
fast-kit prompt search "create unit test"

# Get prompt details
fast-kit prompt show function_creation

# Compose prompt
fast-kit prompt compose function_creation \
  --var function_name=processPayment \
  --var purpose="Process payment securely" \
  --var language=typescript

# Create custom prompt
fast-kit prompt create my_prompt \
  --template prompt.yaml

# Test prompt
fast-kit prompt test function_creation \
  --test-cases tests.json

# Analytics
fast-kit prompt analytics function_creation

# Export prompt
fast-kit prompt export function_creation > prompt.md
```

## 🔌 Integrations

### With ContextKit
```typescript
// Auto-inject relevant context when composing
const prompt = await promptKit.compose('api_endpoint', {
  endpoint: '/users',
  method: 'POST'
}, {
  inject_context: true,
  context_sources: ['similar_endpoints', 'api_patterns']
});
```

### With SpecKit
```typescript
// Generate prompt from spec
const spec = await specKit.get('spec-001');
const prompt = await promptKit.fromSpec(spec);
```

### With Claude Code
```yaml
# .claude-code/config.yaml
hooks:
  before_task:
    - fast-kit prompt compose task_starter \
        --var task="${TASK_DESCRIPTION}" \
        --inject-context
```

## 🧪 Testing Strategy

### Template Validation
- Schema validation (Zod/JSON Schema)
- Variable validation
- Template syntax checking
- Example verification

### Prompt Quality Testing
- Output consistency (10 runs)
- Success rate on test cases
- Token efficiency
- Model compatibility

### Performance Testing
- Template rendering speed
- Context injection overhead
- Database query performance

## 📊 Success Metrics

### Quality
- Template success rate > 85%
- User satisfaction > 4.0/5
- Output consistency > 90%

### Coverage
- 100+ templates in library
- All major languages covered
- Common tasks covered

### Performance
- Template composition < 100ms
- Context injection < 500ms
- Analytics query < 200ms

## 🚀 Implementation Phases

### Phase 1: Core Library (Week 1-2)
- [ ] Template schema design
- [ ] Template engine (Handlebars/Mustache)
- [ ] Variable validation
- [ ] 20 essential templates

### Phase 2: Composition (Week 3-4)
- [ ] Prompt composition system
- [ ] ContextKit integration
- [ ] Prompt chaining
- [ ] Custom templates

### Phase 3: Analytics (Week 5-6)
- [ ] Usage tracking
- [ ] Performance metrics
- [ ] A/B testing framework
- [ ] Optimization suggestions

### Phase 4: Advanced (Week 7-8)
- [ ] Remaining 80+ templates
- [ ] Advanced chaining
- [ ] Template marketplace
- [ ] Community sharing

## 📚 Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "handlebars": "^4.7.8",
    "yaml": "^2.3.4",
    "zod": "^3.22.4",
    "tiktoken": "^1.0.10",
    "better-sqlite3": "^9.2.2"
  }
}
```

## 📖 Example Workflows

### Workflow 1: Quick Function Creation
```bash
# Compose prompt
fast-kit prompt compose function_creation \
  --var function_name=validateEmail \
  --var purpose="Validate email format with RFC 5322" \
  --var language=typescript \
  --inject-context

# Output saved to clipboard, paste to Claude Code
```

### Workflow 2: Custom Review Workflow
```bash
# Create custom chain
fast-kit prompt chain create code-review \
  --steps analyze_code,find_security_issues,suggest_fixes \
  --aggregate concat

# Use in Claude Code
fast-kit prompt compose code-review \
  --var code="$(cat src/auth.ts)"
```

### Workflow 3: Team Template Sharing
```bash
# Export your best prompts
fast-kit prompt export my_custom_prompt > team-prompts/api-design.yaml

# Team members import
fast-kit prompt import team-prompts/api-design.yaml
```

---

**Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2026-01-10
