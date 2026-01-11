# NPM Publishing Guide for Fast-Kit

> Guide for publishing Fast-Kit packages to npm registry

## 📦 Packages to Publish

1. **@fast-kit/cli** - CLI tool for easy installation
2. **@fast-kit/spec-kit** - SpecKit MCP server
3. **@fast-kit/prompt-kit** - PromptKit MCP server

## 🚀 Prerequisites

### 1. NPM Account

```bash
# Create account at https://www.npmjs.com/signup
# Or login
npm login
```

### 2. Organization (Optional but Recommended)

Create `@fast-kit` organization on npm:
- Go to https://www.npmjs.com/org/create
- Create organization named `fast-kit`
- Invite team members

### 3. Check Access

```bash
# Verify you're logged in
npm whoami

# Check organization access
npm org ls fast-kit
```

---

## 📋 Pre-Publishing Checklist

### For Each Package

- [ ] Version number updated in package.json
- [ ] CHANGELOG.md updated with changes
- [ ] README.md is comprehensive
- [ ] LICENSE file included (MIT)
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] No sensitive data (API keys, credentials)
- [ ] `.npmignore` configured correctly

---

## 🏗️ Publishing Steps

### 1. Publish SpecKit

```bash
cd implementations/mcp-servers/spec-kit

# Clean and build
npm run clean
npm install
npm run build

# Verify build
ls dist/index.js

# Test locally (optional)
npm pack
# Inspect the .tgz file

# Publish
npm publish --access public

# Verify published
npm view @fast-kit/spec-kit
```

### 2. Publish PromptKit

```bash
cd implementations/mcp-servers/prompt-kit

# Clean and build
npm run clean
npm install
npm run build

# Verify build
ls dist/index.js

# Publish
npm publish --access public

# Verify published
npm view @fast-kit/prompt-kit
```

### 3. Publish CLI

```bash
cd packages/cli

# Install dependencies
npm install

# Build
npm run build

# Verify build
ls dist/cli.js

# Test CLI locally
npm link
fast-kit --version

# Publish
npm publish --access public

# Verify published
npm view @fast-kit/cli

# Unlink local test
npm unlink -g @fast-kit/cli
```

---

## ✅ Post-Publishing Verification

### Test Installation

```bash
# Install globally in a test environment
npm install -g @fast-kit/cli

# Run commands
fast-kit --version
fast-kit list

# Test setup (in a test directory)
fast-kit setup --skip-config

# Validate
fast-kit validate
```

### Test on Different OS

- [ ] Windows
- [ ] macOS
- [ ] Linux (Ubuntu/Debian)

---

## 🔄 Update Workflow

### For Bug Fixes (Patch Version)

```bash
# 1. Fix the bug
# 2. Update version
npm version patch
# This updates package.json and creates git tag

# 3. Build and publish
npm run build
npm publish

# 4. Push to git
git push && git push --tags
```

### For New Features (Minor Version)

```bash
npm version minor
npm run build
npm publish
git push && git push --tags
```

### For Breaking Changes (Major Version)

```bash
npm version major
npm run build
npm publish
git push && git push --tags
```

---

## 📊 Version Strategy

Follow Semantic Versioning (semver):

- **Patch** (0.1.x): Bug fixes, no API changes
- **Minor** (0.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

### Example Timeline

```
v0.1.0 - Initial release
v0.1.1 - Bug fix: Path escaping on Windows
v0.1.2 - Bug fix: Config merge issue
v0.2.0 - New feature: Auto-update command
v0.2.1 - Bug fix: Validation error handling
v0.3.0 - New feature: Uninstall command
v1.0.0 - Stable release, production ready
```

---

## 🔒 Security Best Practices

### 1. Use `.npmignore`

Create `.npmignore` in each package:

```
# Source files
src/
*.ts
!*.d.ts

# Config files
tsconfig.json
.eslintrc
.prettierrc

# Development
node_modules/
*.log
.env
.env.*

# Tests
test/
*.test.js
*.spec.js

# Build artifacts
*.tgz

# IDE
.vscode/
.idea/
```

### 2. Review Package Contents

```bash
# See what will be published
npm pack --dry-run

# Or pack and inspect
npm pack
tar -tzf fast-kit-cli-0.1.0.tgz
```

### 3. Enable 2FA

```bash
npm profile enable-2fa auth-and-writes
```

---

## 📈 NPM Package Optimization

### 1. Reduce Package Size

```bash
# Check package size
npm pack
du -h fast-kit-cli-0.1.0.tgz

# Only include necessary files in package.json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 2. Optimize Dependencies

```json
{
  "dependencies": {
    // Only runtime deps
  },
  "devDependencies": {
    // Build tools, type definitions
  },
  "peerDependencies": {
    // Optional, for plugins
  }
}
```

---

## 🎯 Post-Launch Tasks

### 1. Update Documentation

- [ ] Update README.md with npm install instructions
- [ ] Update QUICK_START.md
- [ ] Update getting-started guides
- [ ] Create migration guide from scripts to npm

### 2. Announce Release

- [ ] GitHub Release with changelog
- [ ] Social media (Twitter, LinkedIn)
- [ ] Blog post (if applicable)
- [ ] Update project website

### 3. Monitor

- [ ] npm download stats
- [ ] GitHub issues
- [ ] User feedback
- [ ] Bug reports

---

## 📊 NPM Package Stats

### View Stats

```bash
# Package info
npm view @fast-kit/cli

# Download stats
npm info @fast-kit/cli downloads

# All versions
npm view @fast-kit/cli versions
```

### Online Tools

- npm stats: https://npm-stat.com/
- npmtrends: https://npmtrends.com/@fast-kit/cli

---

## 🐛 Troubleshooting

### "You do not have permission to publish"

**Solution**: Check organization access

```bash
npm org ls fast-kit
# Ask admin to add you
```

### "Package name already exists"

**Solution**: Choose different name or use scoped package

```bash
# Use organization scope
@fast-kit/cli
```

### "Version already published"

**Solution**: Bump version

```bash
npm version patch
```

### "Package.json validation failed"

**Solution**: Check required fields

```json
{
  "name": "@fast-kit/cli",
  "version": "0.1.0",
  "description": "...",
  "main": "dist/index.js",
  "license": "MIT"
}
```

---

## 🚀 Automated Publishing (CI/CD)

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📚 Resources

- NPM Docs: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- npm-publish Guide: https://docs.npmjs.com/cli/v8/commands/npm-publish

---

## ✅ Quick Publish Checklist

```bash
# Pre-publish
□ Update version
□ Update CHANGELOG
□ Build succeeds
□ Tests pass
□ Review package contents

# Publish
□ npm publish --access public
□ Verify on npmjs.com
□ Test installation

# Post-publish
□ Create GitHub release
□ Update documentation
□ Announce to users
□ Monitor for issues
```

---

**Ready to publish? Let's make Fast-Kit available to everyone! 🚀**
