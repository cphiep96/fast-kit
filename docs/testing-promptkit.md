# Testing PromptKit - Comprehensive Guide

## 🎯 Overview

This guide will help you test PromptKit with real-world scenarios and verify that all 23 prompts work correctly.

## 🛠️ Setup

### 1. Build PromptKit Server

```bash
# Navigate to PromptKit directory
cd implementations/mcp-servers/prompt-kit

# Install dependencies
pnpm install

# Build the server
pnpm build

# Verify build succeeded
ls dist/
# Should see: index.js, index.d.ts, server.js, server.d.ts
```

### 2. Configure Claude Code

Add both servers to your Claude Code config:

**Location**:
- macOS/Linux: `~/.config/claude/config.json`
- Windows: `%APPDATA%\claude\config.json`

**Configuration**:
```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["D:\\project\\fast-kit\\implementations\\mcp-servers\\spec-kit\\dist\\index.js"]
    },
    "prompt-kit": {
      "command": "node",
      "args": ["D:\\project\\fast-kit\\implementations\\mcp-servers\\prompt-kit\\dist\\index.js"]
    }
  }
}
```

### 3. Restart Claude Code

```bash
# Close Claude Code if running
# Then start it again
claude-code
```

### 4. Verify Servers Are Running

In Claude Code, ask:
```
List all available MCP servers
```

You should see both `spec-kit` and `prompt-kit` listed.

## 🧪 Test Scenarios

### Test 1: List All Prompts ✅

**Test Command**:
```
Show me all available prompts in PromptKit
```

**Expected Result**:
- Should list all 23 prompts
- Organized by category
- Shows prompt IDs, names, and descriptions

**Success Criteria**:
- ✅ All 23 prompts listed
- ✅ 6 categories shown
- ✅ No errors

---

### Test 2: Function Creation (Code Generation) 🔨

**Scenario**: Create a function to validate email addresses

**Test Command**:
```
Use the function_creation prompt to create a validateEmail function in TypeScript that:
- Accepts an email string
- Returns boolean
- Uses regex validation
- Handles edge cases
```

**Expected Result**:
```typescript
function validateEmail(email: string): boolean {
  // Email validation regex (RFC 5322 simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle edge cases
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Trim whitespace
  const trimmedEmail = email.trim();

  // Check length constraints
  if (trimmedEmail.length === 0 || trimmedEmail.length > 254) {
    return false;
  }

  return emailRegex.test(trimmedEmail);
}
```

**Success Criteria**:
- ✅ Function generated with TypeScript
- ✅ Includes edge case handling
- ✅ Has regex validation
- ✅ Includes comments
- ✅ Example usage provided

---

### Test 3: Unit Test Creation (Testing) 🧪

**Scenario**: Generate tests for the validateEmail function

**Test Command**:
```
Use the unit_test_creation prompt to write comprehensive unit tests for this validateEmail function:

[paste the function code from Test 2]
```

**Expected Result**:
- Complete test suite with Jest/Vitest
- Tests for valid emails
- Tests for invalid emails
- Edge cases (null, undefined, empty, too long)
- Clear test descriptions

**Success Criteria**:
- ✅ Test suite generated
- ✅ Happy path covered
- ✅ Edge cases covered
- ✅ Error cases covered
- ✅ > 90% coverage

---

### Test 4: API Endpoint Creation (Code Generation) 🌐

**Scenario**: Create a REST API endpoint for user registration

**Test Command**:
```
Use the api_endpoint prompt to create a POST /api/users/register endpoint with:
- Request body: email, password, name
- Response: user object with id, email, name (no password)
- Validation required
- Authentication NOT required (public endpoint)
- Framework: Express
```

**Expected Result**:
```typescript
import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// POST /api/users/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await createUser({
        email,
        password: hashedPassword,
        name
      });

      // Return user (without password)
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
  }
);

export default router;
```

**Success Criteria**:
- ✅ Express endpoint created
- ✅ Input validation included
- ✅ Error handling present
- ✅ Password not in response
- ✅ Proper status codes

---

### Test 5: Bug Fixing (Debugging) 🐛

**Scenario**: Fix a bug in code

**Test Command**:
```
Use the fix_bug prompt to debug this code:

function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

Error: "Cannot read property 'price' of undefined"
Expected: Should calculate total price correctly
```

**Expected Result**:
- Root cause identified (off-by-one error)
- Fixed code provided
- Explanation of the bug
- Prevention recommendations

**Success Criteria**:
- ✅ Bug identified correctly
- ✅ Fixed code works
- ✅ Explanation clear
- ✅ Recommendations helpful

---

### Test 6: Code Refactoring (Refactoring) ♻️

**Scenario**: Refactor complex nested code

**Test Command**:
```
Use the simplify_logic prompt to refactor this code:

function processUser(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        if (user.subscription) {
          if (user.subscription.status === 'active') {
            return 'premium';
          } else {
            return 'free';
          }
        } else {
          return 'free';
        }
      } else {
        return 'unverified';
      }
    } else {
      return 'inactive';
    }
  } else {
    return 'invalid';
  }
}
```

**Expected Result**:
```typescript
function processUser(user) {
  // Guard clauses for early returns
  if (!user) return 'invalid';
  if (!user.active) return 'inactive';
  if (!user.verified) return 'unverified';

  // Check subscription status
  const hasActiveSubscription =
    user.subscription?.status === 'active';

  return hasActiveSubscription ? 'premium' : 'free';
}
```

**Success Criteria**:
- ✅ Nested if statements removed
- ✅ Guard clauses used
- ✅ More readable
- ✅ Same functionality

---

### Test 7: Pull Request Review (Code Review) 👀

**Scenario**: Review a pull request

**Test Command**:
```
Use the review_pull_request prompt to review this code change:

+ function fetchUserData(userId) {
+   const response = fetch('https://api.example.com/users/' + userId);
+   const data = response.json();
+   return data;
+ }

PR Description: Add function to fetch user data from API
```

**Expected Result**:
- Issues identified:
  1. Missing async/await
  2. No error handling
  3. String concatenation (use template literals)
  4. No input validation
- Suggestions for fixes
- Security concerns noted
- Performance considerations

**Success Criteria**:
- ✅ All issues found
- ✅ Specific suggestions
- ✅ Security noted
- ✅ Priority levels

---

### Test 8: Security Audit (Code Review) 🔒

**Scenario**: Audit code for security issues

**Test Command**:
```
Use the security_audit prompt to review this authentication code:

function login(username, password) {
  const query = "SELECT * FROM users WHERE username = '" + username +
                "' AND password = '" + password + "'";
  const user = db.execute(query);

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
}
```

**Expected Result**:
- **Critical Issues**:
  1. SQL Injection vulnerability
  2. Storing plain text passwords
  3. Storing sensitive data in localStorage
- Severity ratings
- Specific fixes
- Best practices

**Success Criteria**:
- ✅ SQL injection found
- ✅ Password issues found
- ✅ Storage issues found
- ✅ Fixes provided

---

### Test 9: System Design (Architecture) 🏗️

**Scenario**: Design a system architecture

**Test Command**:
```
Use the system_design prompt to design a real-time chat application with:
- 10,000 concurrent users
- Message persistence
- User presence
- Private and group chats
- File sharing
- Mobile and web clients
```

**Expected Result**:
- Architecture diagram (text)
- Component descriptions
- Technology recommendations
- Scalability strategy
- Data flow
- Trade-offs explained

**Success Criteria**:
- ✅ Complete architecture
- ✅ Scalability addressed
- ✅ Tech stack recommended
- ✅ Trade-offs discussed

---

### Test 10: React Component (Code Generation) ⚛️

**Scenario**: Create a React component

**Test Command**:
```
Use the react_component prompt to create a UserCard component with:
- Props: user (name, avatar, bio, verified)
- Shows user avatar (or placeholder)
- Shows verified badge if user is verified
- Click to navigate to user profile
- TypeScript
- Responsive design
```

**Expected Result**:
```typescript
interface UserCardProps {
  user: {
    name: string;
    avatar?: string;
    bio: string;
    verified: boolean;
  };
  onClick?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div
      className="user-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="avatar">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <div className="avatar-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="content">
        <div className="name">
          {user.name}
          {user.verified && (
            <span className="verified-badge" aria-label="Verified">
              ✓
            </span>
          )}
        </div>
        <p className="bio">{user.bio}</p>
      </div>
    </div>
  );
};
```

**Success Criteria**:
- ✅ TypeScript types
- ✅ Props handled correctly
- ✅ Conditional rendering
- ✅ Accessibility (a11y)
- ✅ Clean structure

---

## 📊 Testing Checklist

Use this checklist to track your testing progress:

### Category: Code Generation
- [ ] Test 2: function_creation ✅
- [ ] Test 4: api_endpoint ✅
- [ ] Test 10: react_component ✅
- [ ] database_schema (create your own test)
- [ ] algorithm_implementation (create your own test)

### Category: Testing
- [ ] Test 3: unit_test_creation ✅
- [ ] integration_test (create your own test)
- [ ] e2e_test (create your own test)
- [ ] test_fixtures (create your own test)

### Category: Debugging
- [ ] Test 5: fix_bug ✅
- [ ] analyze_performance (you're viewing this now!)
- [ ] debug_async_issue (create your own test)

### Category: Refactoring
- [ ] Test 6: simplify_logic ✅
- [ ] refactor_code (create your own test)
- [ ] extract_function (create your own test)
- [ ] modernize_code (create your own test)

### Category: Code Review
- [ ] Test 7: review_pull_request ✅
- [ ] Test 8: security_audit ✅
- [ ] performance_review (create your own test)

### Category: Architecture
- [ ] Test 9: system_design ✅
- [ ] api_design (create your own test)
- [ ] design_patterns (create your own test)

### Category: Documentation
- [ ] add_documentation (create your own test)

## 🎯 Success Criteria

Your PromptKit is working correctly if:

1. ✅ All prompts can be listed
2. ✅ Prompts can be searched by category
3. ✅ Variables are validated correctly
4. ✅ Generated prompts are well-formatted
5. ✅ Token counting works
6. ✅ Analytics tracking works (after usage)
7. ✅ Custom prompts can be created
8. ✅ Generated code is high-quality and practical

## 🐛 Troubleshooting

### Issue: "Prompt not found"
**Solution**:
```bash
# Rebuild the server
cd implementations/mcp-servers/prompt-kit
pnpm build

# Restart Claude Code
```

### Issue: "Variable validation failed"
**Solution**: Check that you're providing all required variables with correct types.

### Issue: "Server not responding"
**Solution**:
```bash
# Check if server is running
# Look at Claude Code logs
# Verify config.json path is correct
```

## 📝 Report Template

After testing, document your results:

```markdown
# PromptKit Test Report

Date: [DATE]
Tester: [YOUR NAME]

## Tests Completed: X/23 prompts

### Working Perfectly ✅
- prompt_name: Description of test and result

### Issues Found 🐛
- prompt_name: Issue description

### Improvements Suggested 💡
- prompt_name: Suggestion

## Overall Assessment
[Your assessment here]

## Next Steps
[What to do next]
```

---

**Ready to start testing!** 🚀

Begin with Test 1 (List All Prompts) and work your way through the scenarios.
