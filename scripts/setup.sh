#!/bin/bash
# Fast-Kit Setup Script for Linux/macOS
# Run this script to automatically build and configure Fast-Kit

set -e  # Exit on error

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Helper functions
success() { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; exit 1; }
section() { echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${YELLOW}  $1${NC}"; echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

# Parse arguments
SKIP_CONFIG=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-config)
      SKIP_CONFIG=true
      shift
      ;;
    --verbose)
      VERBOSE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--skip-config] [--verbose]"
      exit 1
      ;;
  esac
done

echo -e "\n${MAGENTA}🚀 Fast-Kit Setup Wizard${NC}\n"

# Detect Fast-Kit root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAST_KIT_ROOT="$(dirname "$SCRIPT_DIR")"
SPEC_KIT_DIR="$FAST_KIT_ROOT/implementations/mcp-servers/spec-kit"
PROMPT_KIT_DIR="$FAST_KIT_ROOT/implementations/mcp-servers/prompt-kit"

info "Fast-Kit root: $FAST_KIT_ROOT"

# Check prerequisites
section "Checking Prerequisites"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js detected: $NODE_VERSION"
else
    error "Node.js not found. Please install Node.js from https://nodejs.org/"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "npm detected: v$NPM_VERSION"
else
    error "npm not found. Please install npm."
fi

# Build SpecKit
section "Building SpecKit"
info "Installing dependencies..."
cd "$SPEC_KIT_DIR"

if [ "$VERBOSE" = true ]; then
    npm install
else
    npm install --silent > /dev/null 2>&1
fi
success "Dependencies installed"

info "Building SpecKit..."
if [ "$VERBOSE" = true ]; then
    npm run build
else
    npm run build --silent > /dev/null 2>&1
fi

# Verify build
if [ -f "$SPEC_KIT_DIR/dist/index.js" ]; then
    success "SpecKit built successfully"
else
    error "Build failed: $SPEC_KIT_DIR/dist/index.js not found"
fi

# Build PromptKit
section "Building PromptKit"
info "Installing dependencies..."
cd "$PROMPT_KIT_DIR"

if [ "$VERBOSE" = true ]; then
    npm install
else
    npm install --silent > /dev/null 2>&1
fi
success "Dependencies installed"

info "Building PromptKit..."
if [ "$VERBOSE" = true ]; then
    npm run build
else
    npm run build --silent > /dev/null 2>&1
fi

# Verify build
if [ -f "$PROMPT_KIT_DIR/dist/index.js" ]; then
    success "PromptKit built successfully"
else
    error "Build failed: $PROMPT_KIT_DIR/dist/index.js not found"
fi

# Configure Claude Code
if [ "$SKIP_CONFIG" = false ]; then
    section "Configuring Claude Code"

    # Detect config location
    if [[ "$OSTYPE" == "darwin"* ]]; then
        CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/claude"
    else
        CLAUDE_CONFIG_DIR="$HOME/.config/claude"
    fi

    CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/config.json"
    info "Claude config location: $CLAUDE_CONFIG_FILE"

    # Create config directory if it doesn't exist
    if [ ! -d "$CLAUDE_CONFIG_DIR" ]; then
        mkdir -p "$CLAUDE_CONFIG_DIR"
        success "Created Claude config directory"
    fi

    # Prepare paths
    SPEC_KIT_PATH="$SPEC_KIT_DIR/dist/index.js"
    PROMPT_KIT_PATH="$PROMPT_KIT_DIR/dist/index.js"

    # Create config JSON
    NEW_CONFIG=$(cat <<EOF
{
  "mcpServers": {
    "spec-kit": {
      "command": "node",
      "args": ["$SPEC_KIT_PATH"]
    },
    "prompt-kit": {
      "command": "node",
      "args": ["$PROMPT_KIT_PATH"]
    }
  }
}
EOF
)

    if [ -f "$CLAUDE_CONFIG_FILE" ]; then
        info "Existing config found. Merging..."

        # Backup existing config
        cp "$CLAUDE_CONFIG_FILE" "$CLAUDE_CONFIG_FILE.backup"

        # Merge configs using jq if available, otherwise replace
        if command -v jq &> /dev/null; then
            MERGED_CONFIG=$(echo "$NEW_CONFIG" | jq -s '.[0] * .[1]' "$CLAUDE_CONFIG_FILE" -)
            echo "$MERGED_CONFIG" > "$CLAUDE_CONFIG_FILE"
            success "Config merged successfully (backup saved)"
        else
            info "jq not found, replacing config (backup saved)"
            echo "$NEW_CONFIG" > "$CLAUDE_CONFIG_FILE"
            success "Config replaced (backup at $CLAUDE_CONFIG_FILE.backup)"
        fi
    else
        echo "$NEW_CONFIG" > "$CLAUDE_CONFIG_FILE"
        success "Config created successfully"
    fi

    echo -e "\n${CYAN}📝 Config Preview:${NC}"
    echo -e "${GRAY}$(cat "$CLAUDE_CONFIG_FILE")${NC}"
fi

# Final summary
section "Setup Complete!"

echo -e "${GREEN}✨ Fast-Kit is ready to use!${NC}\n"

if [ "$SKIP_CONFIG" = false ]; then
    echo -e "${CYAN}📋 Next Steps:${NC}"
    echo -e "  1. Restart Claude Code completely (quit and reopen)"
    echo -e "  2. In Claude Code, try: 'List all prompts'"
    echo -e "  3. Try your first prompt: 'Use function_creation to create hello world'\n"
else
    echo -e "${YELLOW}⚠️  Claude Code configuration was skipped.${NC}"
    echo -e "   Run without --skip-config to auto-configure Claude Code.\n"
fi

echo -e "${CYAN}📚 Documentation:${NC}"
echo -e "  - Quick Start: ./QUICK_START.md"
echo -e "  - Full Guide (VN): ./docs/getting-started-vi.md"
echo -e "  - Prompt Reference: ./docs/prompt-quick-reference.md\n"

echo -e "${CYAN}🐛 Troubleshooting:${NC}"
echo -e "  - Validate setup: ./scripts/validate.sh"
echo -e "  - View logs: npm run dev (in each server directory)"
echo -e "  - GitHub Issues: https://github.com/fast-kit/fast-kit/issues\n"

success "Happy coding with Fast-Kit! 🚀"
