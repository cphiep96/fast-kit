# Fast-Kit Setup Scripts

Các scripts tự động để setup và validate Fast-Kit.

## 📜 Available Scripts

### 🚀 `setup.ps1` / `setup.sh` - Automatic Setup

Tự động build và configure Fast-Kit MCP servers.

**Windows:**
```powershell
.\scripts\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Features:**
- ✅ Auto-detect OS and paths
- ✅ Build SpecKit and PromptKit
- ✅ Install dependencies
- ✅ Create/update Claude Code config
- ✅ Verify builds
- ✅ Colorful output with progress

**Options:**

**Windows:**
```powershell
# Skip Claude config (only build servers)
.\scripts\setup.ps1 -SkipConfig

# Verbose output (show npm logs)
.\scripts\setup.ps1 -Verbose

# Both options
.\scripts\setup.ps1 -SkipConfig -Verbose
```

**macOS/Linux:**
```bash
# Skip Claude config (only build servers)
./scripts/setup.sh --skip-config

# Verbose output (show npm logs)
./scripts/setup.sh --verbose

# Both options
./scripts/setup.sh --skip-config --verbose
```

---

### 🔍 `validate.ps1` / `validate.sh` - Validation

Kiểm tra xem Fast-Kit đã được setup đúng chưa.

**Windows:**
```powershell
.\scripts\validate.ps1
```

**macOS/Linux:**
```bash
chmod +x scripts/validate.sh
./scripts/validate.sh
```

**Checks:**
- ✅ Build files exist
- ✅ Claude config exists
- ✅ Servers are configured in Claude config
- ✅ Config paths are valid
- ✅ Servers can be executed

**Options:**

```powershell
# Windows - Verbose output
.\scripts\validate.ps1 -Verbose
```

```bash
# macOS/Linux - Verbose output
./scripts/validate.sh --verbose
```

**Exit Codes:**
- `0` - All checks passed
- `1` - Validation failed

---

## 🎯 Typical Workflows

### First Time Setup

```bash
# 1. Clone repo
git clone https://github.com/fast-kit/fast-kit.git
cd fast-kit

# 2. Run setup (Windows)
.\scripts\setup.ps1

# 2. Run setup (macOS/Linux)
./scripts/setup.sh

# 3. Validate
.\scripts\validate.ps1   # Windows
./scripts/validate.sh    # macOS/Linux

# 4. Restart Claude Code

# 5. Test
# In Claude Code: "List all prompts"
```

### Update/Rebuild

```bash
# Pull latest changes
git pull

# Rebuild servers
.\scripts\setup.ps1          # Windows
./scripts/setup.sh           # macOS/Linux

# Validate
.\scripts\validate.ps1       # Windows
./scripts/validate.sh        # macOS/Linux

# Restart Claude Code
```

### Troubleshooting

```bash
# 1. Validate to see what's wrong
.\scripts\validate.ps1 -Verbose    # Windows
./scripts/validate.sh --verbose    # macOS/Linux

# 2. Clean rebuild
cd implementations/mcp-servers/spec-kit
rm -rf node_modules dist
cd ../prompt-kit
rm -rf node_modules dist

# 3. Re-run setup
cd ../../..
.\scripts\setup.ps1 -Verbose       # Windows
./scripts/setup.sh --verbose       # macOS/Linux

# 4. Validate again
.\scripts\validate.ps1              # Windows
./scripts/validate.sh               # macOS/Linux
```

---

## 🛠️ Script Details

### Setup Script Flow

```
1. Detect OS and paths
   ↓
2. Check Node.js and npm
   ↓
3. Build SpecKit
   - npm install
   - npm run build
   - Verify dist/index.js
   ↓
4. Build PromptKit
   - npm install
   - npm run build
   - Verify dist/index.js
   ↓
5. Configure Claude Code (unless --skip-config)
   - Detect config location
   - Create/merge config.json
   - Add spec-kit and prompt-kit
   ↓
6. Show summary and next steps
```

### Validation Script Flow

```
1. Check SpecKit build exists
   ↓
2. Check PromptKit build exists
   ↓
3. Check Claude config exists
   ↓
4. Verify spec-kit in config
   ↓
5. Verify prompt-kit in config
   ↓
6. Validate configured paths exist
   ↓
7. Test server execution (basic)
   ↓
8. Show summary (PASSED/FAILED)
```

---

## 🔧 Dependencies

### Windows (PowerShell)
- Windows PowerShell 5.1+ or PowerShell Core 7+
- Node.js 18+
- npm 8+

### macOS/Linux (Bash)
- Bash 4.0+
- Node.js 18+
- npm 8+
- Optional: `jq` for better config validation
  - macOS: `brew install jq`
  - Ubuntu/Debian: `apt-get install jq`
  - Fedora: `dnf install jq`

---

## 📊 Output Examples

### Successful Setup

```
🚀 Fast-Kit Setup Wizard

━━━━━━━━━━━━━━━━━━━━━━━━━
  Checking Prerequisites
━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Node.js detected: v20.10.0
✓ npm detected: v10.2.3

━━━━━━━━━━━━━━━━━━━━━━━━━
  Building SpecKit
━━━━━━━━━━━━━━━━━━━━━━━━━

→ Installing dependencies...
✓ Dependencies installed
→ Building SpecKit...
✓ SpecKit built successfully

━━━━━━━━━━━━━━━━━━━━━━━━━
  Building PromptKit
━━━━━━━━━━━━━━━━━━━━━━━━━

→ Installing dependencies...
✓ Dependencies installed
→ Building PromptKit...
✓ PromptKit built successfully

━━━━━━━━━━━━━━━━━━━━━━━━━
  Configuring Claude Code
━━━━━━━━━━━━━━━━━━━━━━━━━

→ Claude config location: C:\Users\...\AppData\Roaming\claude\config.json
✓ Config created successfully

━━━━━━━━━━━━━━━━━━━━━━━━━
  Setup Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Fast-Kit is ready to use!

📋 Next Steps:
  1. Restart Claude Code completely (quit and reopen)
  2. In Claude Code, try: 'List all prompts'
  3. Try your first prompt: 'Use function_creation to create hello world'
```

### Successful Validation

```
🔍 Fast-Kit Validation

━━━━━━━━━━━━━━━━━━━━━━━━━
  Checking Builds
━━━━━━━━━━━━━━━━━━━━━━━━━

✓ SpecKit build found
✓ PromptKit build found

━━━━━━━━━━━━━━━━━━━━━━━━━
  Checking Claude Code Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Claude config file found
✓ spec-kit configured
✓   spec-kit path is valid
✓ prompt-kit configured
✓   prompt-kit path is valid

━━━━━━━━━━━━━━━━━━━━━━━━━
  Validation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All checks PASSED

Fast-Kit is properly configured!

Next steps:
  1. Restart Claude Code
  2. Try: 'List all prompts'
  3. Check: ./docs/getting-started-vi.md
```

---

## 🐛 Common Issues

### Issue: "npm not found"
**Solution:** Install Node.js and npm from https://nodejs.org/

### Issue: "Build failed"
**Solution:**
```bash
# Clean and rebuild
cd implementations/mcp-servers/spec-kit
rm -rf node_modules dist
npm install
npm run build
```

### Issue: "Config path mismatch"
**Solution:** Re-run setup script, it will auto-fix paths
```bash
.\scripts\setup.ps1    # Windows
./scripts/setup.sh     # macOS/Linux
```

### Issue: "Permission denied" (macOS/Linux)
**Solution:** Make scripts executable
```bash
chmod +x scripts/*.sh
```

### Issue: "Servers not showing in Claude Code"
**Solution:**
1. Validate setup: `./scripts/validate.sh --verbose`
2. Check Claude config manually
3. Restart Claude Code completely (Quit and reopen)
4. Check Claude Code logs

---

## 🎓 Advanced Usage

### CI/CD Integration

```bash
# In CI pipeline
./scripts/setup.sh --skip-config
./scripts/validate.sh
```

### Docker/Container

```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN chmod +x scripts/*.sh
RUN ./scripts/setup.sh --skip-config
```

### Team Setup

```bash
# Team members can run
git clone <repo>
cd fast-kit
./scripts/setup.sh
./scripts/validate.sh
# Done! Ready to use
```

---

## 📝 Contributing

To add new scripts:
1. Follow naming convention: `<name>.ps1` / `<name>.sh`
2. Add colorful output
3. Include error handling
4. Update this README
5. Add usage examples

---

## 📄 License

MIT License - Same as Fast-Kit
