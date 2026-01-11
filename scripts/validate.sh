#!/bin/bash
# Fast-Kit Validation Script for Linux/macOS
# Validates that Fast-Kit is properly installed and configured

set +e  # Don't exit on error for validation

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

success() { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; HAS_ERRORS=true; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }
section() { echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${YELLOW}  $1${NC}"; echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

VERBOSE=false
HAS_ERRORS=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --verbose)
      VERBOSE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--verbose]"
      exit 1
      ;;
  esac
done

echo -e "\n${MAGENTA}🔍 Fast-Kit Validation${NC}\n"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAST_KIT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check builds
section "Checking Builds"

SPEC_KIT_BUILD="$FAST_KIT_ROOT/implementations/mcp-servers/spec-kit/dist/index.js"
if [ -f "$SPEC_KIT_BUILD" ]; then
    success "SpecKit build found"
    [ "$VERBOSE" = true ] && info "  Location: $SPEC_KIT_BUILD"
else
    error "SpecKit build NOT found"
    info "  Expected: $SPEC_KIT_BUILD"
    info "  Run: ./scripts/setup.sh"
fi

PROMPT_KIT_BUILD="$FAST_KIT_ROOT/implementations/mcp-servers/prompt-kit/dist/index.js"
if [ -f "$PROMPT_KIT_BUILD" ]; then
    success "PromptKit build found"
    [ "$VERBOSE" = true ] && info "  Location: $PROMPT_KIT_BUILD"
else
    error "PromptKit build NOT found"
    info "  Expected: $PROMPT_KIT_BUILD"
    info "  Run: ./scripts/setup.sh"
fi

# Check Claude Code config
section "Checking Claude Code Configuration"

if [[ "$OSTYPE" == "darwin"* ]]; then
    CLAUDE_CONFIG_FILE="$HOME/Library/Application Support/claude/config.json"
else
    CLAUDE_CONFIG_FILE="$HOME/.config/claude/config.json"
fi

if [ -f "$CLAUDE_CONFIG_FILE" ]; then
    success "Claude config file found"
    [ "$VERBOSE" = true ] && info "  Location: $CLAUDE_CONFIG_FILE"

    # Check if jq is available for JSON parsing
    if command -v jq &> /dev/null; then
        # Check spec-kit
        if jq -e '.mcpServers["spec-kit"]' "$CLAUDE_CONFIG_FILE" > /dev/null 2>&1; then
            success "spec-kit configured"

            CONFIGURED_PATH=$(jq -r '.mcpServers["spec-kit"].args[0]' "$CLAUDE_CONFIG_FILE")
            [ "$VERBOSE" = true ] && info "  Path: $CONFIGURED_PATH"

            if [ -f "$CONFIGURED_PATH" ]; then
                success "  spec-kit path is valid"
            else
                warning "  spec-kit path in config does not exist"
                info "    Configured: $CONFIGURED_PATH"
                info "    Expected: $SPEC_KIT_BUILD"
            fi
        else
            error "spec-kit NOT configured"
        fi

        # Check prompt-kit
        if jq -e '.mcpServers["prompt-kit"]' "$CLAUDE_CONFIG_FILE" > /dev/null 2>&1; then
            success "prompt-kit configured"

            CONFIGURED_PATH=$(jq -r '.mcpServers["prompt-kit"].args[0]' "$CLAUDE_CONFIG_FILE")
            [ "$VERBOSE" = true ] && info "  Path: $CONFIGURED_PATH"

            if [ -f "$CONFIGURED_PATH" ]; then
                success "  prompt-kit path is valid"
            else
                warning "  prompt-kit path in config does not exist"
                info "    Configured: $CONFIGURED_PATH"
                info "    Expected: $PROMPT_KIT_BUILD"
            fi
        else
            error "prompt-kit NOT configured"
        fi
    else
        warning "jq not installed, skipping detailed config validation"
        info "  Install jq for better validation: brew install jq (macOS) or apt-get install jq (Linux)"

        # Basic check
        if grep -q "spec-kit" "$CLAUDE_CONFIG_FILE"; then
            success "spec-kit found in config (basic check)"
        else
            error "spec-kit NOT found in config"
        fi

        if grep -q "prompt-kit" "$CLAUDE_CONFIG_FILE"; then
            success "prompt-kit found in config (basic check)"
        else
            error "prompt-kit NOT found in config"
        fi
    fi
else
    error "Claude config file NOT found"
    info "  Expected: $CLAUDE_CONFIG_FILE"
    info "  Run: ./scripts/setup.sh"
fi

# Test Node.js execution
section "Testing MCP Servers"

info "Testing SpecKit server..."
if node "$SPEC_KIT_BUILD" --test > /dev/null 2>&1; then
    success "SpecKit server can be executed"
else
    warning "Could not test SpecKit server execution (this may be normal if --test flag is not supported)"
fi

info "Testing PromptKit server..."
if node "$PROMPT_KIT_BUILD" --test > /dev/null 2>&1; then
    success "PromptKit server can be executed"
else
    warning "Could not test PromptKit server execution (this may be normal if --test flag is not supported)"
fi

# Summary
section "Validation Summary"

if [ "$HAS_ERRORS" = true ]; then
    echo -e "${RED}❌ Validation FAILED${NC}\n"
    echo -e "${YELLOW}Please fix the errors above and run setup again:${NC}"
    echo -e "${CYAN}  ./scripts/setup.sh${NC}\n"
    exit 1
else
    echo -e "${GREEN}✅ All checks PASSED${NC}\n"
    echo -e "${GREEN}Fast-Kit is properly configured!${NC}\n"
    echo -e "${CYAN}Next steps:${NC}"
    echo -e "  1. Restart Claude Code"
    echo -e "  2. Try: 'List all prompts'"
    echo -e "  3. Check: ./docs/getting-started-vi.md\n"
    exit 0
fi
