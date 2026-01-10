# Fast-Kit - Quick Start Guide

> Hướng dẫn nhanh 5 phút để bắt đầu với Fast-Kit

## 🚀 Setup Nhanh (5 phút)

### 1. Build Servers

```bash
cd d:\project\fast-kit\implementations\mcp-servers\spec-kit
npm install && npm run build

cd ..\prompt-kit
npm install && npm run build
```

### 2. Configure Claude Code

Mở `%APPDATA%\claude\config.json` và thêm:

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

### 3. Restart & Test

Restart Claude Code, sau đó test:
```
List all prompts
```

## ✨ First Examples

### Tạo Function
```
Use the function_creation prompt to create a calculateTax function in TypeScript
```

### Tạo API Endpoint
```
Use the api_endpoint prompt to create POST /api/users endpoint with Express
```

### Write Tests
```
Use the unit_test_creation prompt to write tests for my login function
```

### Fix Bug
```
Use the fix_bug prompt to fix this error: [paste your error]
```

## 📚 Full Documentation

- **Tiếng Việt**: [getting-started-vi.md](docs/getting-started-vi.md) - Hướng dẫn chi tiết
- **English**: [getting-started.md](docs/getting-started.md) - Detailed guide
- **Quick Reference**: [prompt-quick-reference.md](docs/prompt-quick-reference.md) - All 23 prompts
- **Testing**: [testing-promptkit.md](docs/testing-promptkit.md) - Test scenarios

## 🎯 Top 5 Most Used Prompts

1. **api_endpoint** - Create REST API endpoints
2. **function_creation** - Create new functions
3. **unit_test_creation** - Write unit tests
4. **fix_bug** - Debug and fix issues
5. **refactor_code** - Improve code quality

## 💡 Pro Tips

✅ Càng chi tiết càng tốt
✅ Specify language/framework
✅ Provide examples
✅ Include constraints

❌ Tránh requests quá chung chung

## 🐛 Troubleshooting

**Servers không hiện?**
1. Check build: `dir implementations\mcp-servers\prompt-kit\dist\index.js`
2. Test direct: `node implementations\mcp-servers\prompt-kit\dist\index.js`
3. Restart Claude Code hoàn toàn

**Need Help?**
- [GitHub Issues](https://github.com/fast-kit/fast-kit/issues)
- [Full Documentation](docs/getting-started-vi.md)

---

**Ready to code faster! 🚀**
