@echo off
REM Fast-Kit Quick Setup Script for Windows
REM This script builds both MCP servers and helps you configure Claude Code

echo.
echo 🚀 Fast-Kit Setup Script
echo =======================
echo.

REM Get the project root directory
set "PROJECT_ROOT=%~dp0"
set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"

echo 📁 Project Root: %PROJECT_ROOT%
echo.

REM Step 1: Build SpecKit
echo Step 1/2: Building SpecKit...
cd "%PROJECT_ROOT%\implementations\mcp-servers\spec-kit"

if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
)

echo   Building SpecKit...
call npm run build

if exist "dist\index.js" (
    echo   ✅ SpecKit built successfully!
) else (
    echo   ❌ SpecKit build failed
    exit /b 1
)

echo.

REM Step 2: Build PromptKit
echo Step 2/2: Building PromptKit...
cd "%PROJECT_ROOT%\implementations\mcp-servers\prompt-kit"

if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
)

echo   Building PromptKit...
call npm run build

if exist "dist\index.js" (
    echo   ✅ PromptKit built successfully!
) else (
    echo   ❌ PromptKit build failed
    exit /b 1
)

echo.
echo ✅ All servers built successfully!
echo.

REM Generate config
echo 📝 Claude Code Configuration
echo Add this to your Claude Code config file:
echo.
echo Location: %%APPDATA%%\claude\config.json
echo.
echo {
echo   "mcpServers": {
echo     "spec-kit": {
echo       "command": "node",
echo       "args": ["%PROJECT_ROOT%\\implementations\\mcp-servers\\spec-kit\\dist\\index.js"]
echo     },
echo     "prompt-kit": {
echo       "command": "node",
echo       "args": ["%PROJECT_ROOT%\\implementations\\mcp-servers\\prompt-kit\\dist\\index.js"]
echo     }
echo   }
echo }
echo.

echo ⚠️  Remember to restart Claude Code after updating the config!
echo.

echo 🎉 Setup Complete!
echo.
echo Next steps:
echo   1. Update your Claude Code config with the JSON above
echo   2. Restart Claude Code
echo   3. Test with: 'List all available MCP servers'
echo   4. See docs\testing-promptkit.md for test scenarios
echo.

pause
