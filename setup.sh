#!/bin/bash

# Fast-Kit Quick Setup Script
# This script builds both MCP servers and helps you configure Claude Code

set -e

echo "🚀 Fast-Kit Setup Script"
echo "======================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}📁 Project Root: ${PROJECT_ROOT}${NC}"
echo ""

# Step 1: Build SpecKit
echo -e "${YELLOW}Step 1/2: Building SpecKit...${NC}"
cd "${PROJECT_ROOT}/implementations/mcp-servers/spec-kit"

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

echo "  Building SpecKit..."
npm run build

if [ -f "dist/index.js" ]; then
    echo -e "${GREEN}  ✅ SpecKit built successfully!${NC}"
else
    echo "  ❌ SpecKit build failed"
    exit 1
fi

echo ""

# Step 2: Build PromptKit
echo -e "${YELLOW}Step 2/2: Building PromptKit...${NC}"
cd "${PROJECT_ROOT}/implementations/mcp-servers/prompt-kit"

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

echo "  Building PromptKit..."
npm run build

if [ -f "dist/index.js" ]; then
    echo -e "${GREEN}  ✅ PromptKit built successfully!${NC}"
else
    echo "  ❌ PromptKit build failed"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All servers built successfully!${NC}"
echo ""

# Generate config
echo -e "${BLUE}📝 Claude Code Configuration${NC}"
echo "Add this to your Claude Code config file:"
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="~/.config/claude/config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CONFIG_PATH="~/.config/claude/config.json"
else
    CONFIG_PATH="%APPDATA%\\claude\\config.json"
fi

echo "Location: ${CONFIG_PATH}"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"spec-kit\": {"
echo "      \"command\": \"node\","
echo "      \"args\": [\"${PROJECT_ROOT}/implementations/mcp-servers/spec-kit/dist/index.js\"]"
echo "    },"
echo "    \"prompt-kit\": {"
echo "      \"command\": \"node\","
echo "      \"args\": [\"${PROJECT_ROOT}/implementations/mcp-servers/prompt-kit/dist/index.js\"]"
echo "    }"
echo "  }"
echo "}"
echo ""

echo -e "${YELLOW}⚠️  Remember to restart Claude Code after updating the config!${NC}"
echo ""

echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update your Claude Code config with the JSON above"
echo "  2. Restart Claude Code"
echo "  3. Test with: 'List all available MCP servers'"
echo "  4. See docs/testing-promptkit.md for test scenarios"
echo ""
