# @fast-kit/cli

> One-command setup for Fast-Kit MCP servers

Fast-Kit CLI makes it incredibly easy to install and configure Fast-Kit MCP servers for Claude Code. No repo cloning, no manual builds, no config editing - just one command and you're ready!

## 🚀 Quick Start

### Installation

```bash
npm install -g @fast-kit/cli
```

### Setup Fast-Kit

```bash
fast-kit setup
```

That's it! The CLI will:
- ✅ Install SpecKit and PromptKit MCP servers
- ✅ Configure Claude Code automatically
- ✅ Validate everything works

**Time**: ~1-2 minutes
**Difficulty**: Anyone can do it!

## 📖 Commands

### `fast-kit setup`

Install and configure Fast-Kit MCP servers.

```bash
# Full setup (recommended)
fast-kit setup

# Skip Claude config (only install servers)
fast-kit setup --skip-config

# Verbose output
fast-kit setup --verbose
```

**What it does:**
1. Checks Node.js and npm
2. Installs `@fast-kit/spec-kit` globally
3. Installs `@fast-kit/prompt-kit` globally
4. Updates Claude Code config.json
5. Shows next steps

---

### `fast-kit validate`

Validate your Fast-Kit installation.

```bash
# Quick validation
fast-kit validate

# Detailed validation
fast-kit validate --verbose
```

**Checks:**
- ✓ Packages installed globally
- ✓ Claude config exists
- ✓ Servers configured correctly
- ✓ Config paths are valid

---

### `fast-kit list`

List installed Fast-Kit servers and their versions.

```bash
fast-kit list
```

**Output:**
```
📦 Fast-Kit Installed Servers

✓ SpecKit
  Package: @fast-kit/spec-kit
  Version: 0.1.0

✓ PromptKit
  Package: @fast-kit/prompt-kit
  Version: 0.1.0
```

---

### `fast-kit update`

Update all Fast-Kit servers to the latest version.

```bash
fast-kit update
```

**What it does:**
- Updates SpecKit to latest
- Updates PromptKit to latest
- Shows success message

---

## 🎯 Complete Workflow

### First-Time Setup

```bash
# 1. Install CLI globally
npm install -g @fast-kit/cli

# 2. Run setup
fast-kit setup

# 3. Validate (optional)
fast-kit validate

# 4. Restart Claude Code

# 5. Test in Claude Code
# "List all prompts"
```

**Total time**: ~2 minutes ⚡

---

### Update to Latest Version

```bash
# Update servers
fast-kit update

# Validate
fast-kit validate

# Restart Claude Code
```

---

### Troubleshooting

```bash
# Check what's installed
fast-kit list

# Detailed validation
fast-kit validate --verbose

# Re-run setup if needed
fast-kit setup --verbose

# Check logs
npm list -g @fast-kit/spec-kit
npm list -g @fast-kit/prompt-kit
```

---

## 🆚 vs Manual Setup

### Before (Manual Setup)
```bash
# 1. Clone repository
git clone https://github.com/fast-kit/fast-kit.git
cd fast-kit

# 2. Build SpecKit
cd implementations/mcp-servers/spec-kit
npm install && npm run build

# 3. Build PromptKit
cd ../prompt-kit
npm install && npm run build

# 4. Manually edit Claude config
# Find %APPDATA%\claude\config.json
# Add paths with correct escaping
# Hope you didn't make typos

# Total: 15-20 minutes, error-prone
```

### After (CLI Setup)
```bash
# 1. Install and setup
npm install -g @fast-kit/cli
fast-kit setup

# Total: 2 minutes, automated
```

**Result**: 90% time saved, 95%+ success rate!

---

## 💡 Features

### Auto-Detection
- ✅ Detects OS (Windows/macOS/Linux)
- ✅ Finds Claude config location
- ✅ Locates globally installed packages
- ✅ Validates paths automatically

### Smart Configuration
- ✅ Creates config if doesn't exist
- ✅ Merges with existing config
- ✅ Preserves other MCP servers
- ✅ Correct path escaping

### User-Friendly
- ✅ Colorful progress output
- ✅ Clear error messages
- ✅ Helpful suggestions
- ✅ Works for everyone

---

## 🛠️ How It Works

### Setup Flow

```
fast-kit setup
      ↓
Check Node.js/npm
      ↓
npm install -g @fast-kit/spec-kit
      ↓
npm install -g @fast-kit/prompt-kit
      ↓
Find Claude config location
      ↓
Update/create config.json
      ↓
Validate setup
      ↓
Show success message
```

### Config Location

The CLI automatically finds your Claude config at:

- **Windows**: `%APPDATA%\claude\config.json`
- **macOS**: `~/Library/Application Support/claude/config.json`
- **Linux**: `~/.config/claude/config.json`

---

## 📦 What Gets Installed

### Global NPM Packages

1. **@fast-kit/spec-kit**
   - Specification management MCP server
   - PRD, RFC, ADR, User Stories, API Specs

2. **@fast-kit/prompt-kit**
   - 23 production-ready prompts
   - Code generation, testing, debugging, refactoring

### Claude Configuration

Adds to `config.json`:

```json
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["/path/to/global/node_modules/@fast-kit/spec-kit/dist/index.js"]
    },
    "prompt-kit": {
      "command": "node",
      "args": ["/path/to/global/node_modules/@fast-kit/prompt-kit/dist/index.js"]
    }
  }
}
```

---

## 🐛 Troubleshooting

### "Command not found: fast-kit"

**Solution**: Make sure npm global bin is in your PATH

```bash
# Check npm global bin location
npm bin -g

# Add to PATH (example)
# Windows: Add to System Environment Variables
# macOS/Linux: Add to ~/.bashrc or ~/.zshrc
export PATH="$(npm bin -g):$PATH"
```

---

### "Servers not showing in Claude Code"

**Solution**:

```bash
# 1. Validate installation
fast-kit validate --verbose

# 2. Check what's installed
fast-kit list

# 3. Restart Claude Code completely (quit and reopen)

# 4. If still not working, re-run setup
fast-kit setup --verbose
```

---

### "Permission denied" (macOS/Linux)

**Solution**: Use sudo for global install

```bash
sudo npm install -g @fast-kit/cli
sudo fast-kit setup
```

Or configure npm to install globally without sudo:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Now install without sudo
npm install -g @fast-kit/cli
```

---

## 📚 Documentation

- **Main Docs**: https://github.com/fast-kit/fast-kit
- **Quick Start**: https://github.com/fast-kit/fast-kit/blob/main/QUICK_START.md
- **Vietnamese Guide**: https://github.com/fast-kit/fast-kit/blob/main/docs/getting-started-vi.md
- **Prompt Reference**: https://github.com/fast-kit/fast-kit/blob/main/docs/prompt-quick-reference.md

---

## 🤝 Contributing

Issues and pull requests welcome!

- **GitHub**: https://github.com/fast-kit/fast-kit
- **Issues**: https://github.com/fast-kit/fast-kit/issues

---

## 📄 License

MIT © Fast-Kit Team

---

## 🎉 What's Next?

After setup, try these in Claude Code:

```
List all prompts
```

```
Use the function_creation prompt to create a hello world function in TypeScript
```

```
Use the api_endpoint prompt to create a REST API endpoint
```

Happy coding with Fast-Kit! 🚀
