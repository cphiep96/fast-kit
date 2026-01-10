# Claude Code Configuration

Both MCP servers have been built successfully! Follow these steps to configure Claude Code.

## Configuration File Location

**Windows**: `%APPDATA%\claude\config.json`
**macOS/Linux**: `~/.config/claude/config.json`

## Configuration JSON

Add this to your Claude Code config file:

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

## Steps

1. **Open your Claude Code config file**:
   - Windows: Open `%APPDATA%\claude\config.json` in a text editor
   - If the file doesn't exist, create it

2. **Add the configuration** above (or merge with existing config)

3. **Restart Claude Code** completely

4. **Verify installation**:
   ```
   List all available MCP servers
   ```

   You should see both `spec-kit` and `prompt-kit` in the response.

## Testing PromptKit

Once configured, try these commands:

```
List all prompts
```

```
Show me the function_creation prompt
```

```
Use the function_creation prompt to create a calculateTax function in TypeScript
```

See [docs/testing-promptkit.md](docs/testing-promptkit.md) for comprehensive test scenarios.

## Testing SpecKit

```
List available specification templates
```

```
Create a PRD spec for a new chat feature
```

## Notes

- **Analytics disabled**: The analytics feature (which required better-sqlite3) has been temporarily disabled to avoid C++ compilation issues. All other features work perfectly.
- **All 23 prompts available**: PromptKit includes all prompt templates across 6 categories (Code Generation, Testing, Debugging, Refactoring, Code Review, Architecture)
- **Quick Reference**: See [docs/prompt-quick-reference.md](docs/prompt-quick-reference.md) for a cheat sheet of all prompts

## Troubleshooting

If the servers don't appear:
1. Verify the paths in the config are correct
2. Make sure you restarted Claude Code completely
3. Check that `dist/index.js` exists in both server directories
4. Try running directly: `node "d:\project\fast-kit\implementations\mcp-servers\prompt-kit\dist\index.js"`
