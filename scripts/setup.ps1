# Fast-Kit Setup Script for Windows
# Run this script to automatically build and configure Fast-Kit

param(
    [switch]$SkipConfig,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "→ $msg" -ForegroundColor Cyan }
function Write-Error { param($msg) Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Section { param($msg) Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow; Write-Host "  $msg" -ForegroundColor Yellow; Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Yellow }

Write-Host "`n🚀 Fast-Kit Setup Wizard`n" -ForegroundColor Magenta

# Detect Fast-Kit root directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$FAST_KIT_ROOT = Split-Path -Parent $SCRIPT_DIR
$SPEC_KIT_DIR = Join-Path $FAST_KIT_ROOT "implementations\mcp-servers\spec-kit"
$PROMPT_KIT_DIR = Join-Path $FAST_KIT_ROOT "implementations\mcp-servers\prompt-kit"

Write-Info "Fast-Kit root: $FAST_KIT_ROOT"

# Check Node.js installation
Write-Section "Checking Prerequisites"
try {
    $nodeVersion = node --version
    Write-Success "Node.js detected: $nodeVersion"
} catch {
    Write-Error "Node.js not found. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check npm installation
try {
    $npmVersion = npm --version
    Write-Success "npm detected: v$npmVersion"
} catch {
    Write-Error "npm not found. Please install npm."
    exit 1
}

# Build SpecKit
Write-Section "Building SpecKit"
Write-Info "Installing dependencies..."
Push-Location $SPEC_KIT_DIR
try {
    if ($Verbose) {
        npm install
    } else {
        npm install --silent 2>&1 | Out-Null
    }
    Write-Success "Dependencies installed"

    Write-Info "Building SpecKit..."
    if ($Verbose) {
        npm run build
    } else {
        npm run build --silent 2>&1 | Out-Null
    }

    # Verify build
    $specKitBuild = Join-Path $SPEC_KIT_DIR "dist\index.js"
    if (Test-Path $specKitBuild) {
        Write-Success "SpecKit built successfully"
    } else {
        throw "Build file not found at $specKitBuild"
    }
} catch {
    Write-Error "Failed to build SpecKit: $_"
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# Build PromptKit
Write-Section "Building PromptKit"
Write-Info "Installing dependencies..."
Push-Location $PROMPT_KIT_DIR
try {
    if ($Verbose) {
        npm install
    } else {
        npm install --silent 2>&1 | Out-Null
    }
    Write-Success "Dependencies installed"

    Write-Info "Building PromptKit..."
    if ($Verbose) {
        npm run build
    } else {
        npm run build --silent 2>&1 | Out-Null
    }

    # Verify build
    $promptKitBuild = Join-Path $PROMPT_KIT_DIR "dist\index.js"
    if (Test-Path $promptKitBuild) {
        Write-Success "PromptKit built successfully"
    } else {
        throw "Build file not found at $promptKitBuild"
    }
} catch {
    Write-Error "Failed to build PromptKit: $_"
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# Configure Claude Code
if (-not $SkipConfig) {
    Write-Section "Configuring Claude Code"

    $claudeConfigDir = Join-Path $env:APPDATA "claude"
    $claudeConfigFile = Join-Path $claudeConfigDir "config.json"

    Write-Info "Claude config location: $claudeConfigFile"

    # Create config directory if it doesn't exist
    if (-not (Test-Path $claudeConfigDir)) {
        New-Item -ItemType Directory -Path $claudeConfigDir -Force | Out-Null
        Write-Success "Created Claude config directory"
    }

    # Prepare paths (escape backslashes for JSON)
    $specKitPath = (Join-Path $SPEC_KIT_DIR "dist\index.js") -replace '\\', '\\'
    $promptKitPath = (Join-Path $PROMPT_KIT_DIR "dist\index.js") -replace '\\', '\\'

    # Create or update config
    $newConfig = @{
        mcpServers = @{
            "spec-kit" = @{
                command = "node"
                args = @($specKitPath)
            }
            "prompt-kit" = @{
                command = "node"
                args = @($promptKitPath)
            }
        }
    }

    if (Test-Path $claudeConfigFile) {
        Write-Info "Existing config found. Merging..."
        try {
            $existingConfig = Get-Content $claudeConfigFile -Raw | ConvertFrom-Json -AsHashtable
            if (-not $existingConfig.mcpServers) {
                $existingConfig.mcpServers = @{}
            }
            $existingConfig.mcpServers["spec-kit"] = $newConfig.mcpServers["spec-kit"]
            $existingConfig.mcpServers["prompt-kit"] = $newConfig.mcpServers["prompt-kit"]
            $existingConfig | ConvertTo-Json -Depth 10 | Set-Content $claudeConfigFile
            Write-Success "Config merged successfully"
        } catch {
            Write-Error "Failed to merge config. Backing up and creating new..."
            Copy-Item $claudeConfigFile "$claudeConfigFile.backup"
            $newConfig | ConvertTo-Json -Depth 10 | Set-Content $claudeConfigFile
            Write-Success "New config created (backup saved)"
        }
    } else {
        $newConfig | ConvertTo-Json -Depth 10 | Set-Content $claudeConfigFile
        Write-Success "Config created successfully"
    }

    Write-Host "`n📝 Config Preview:" -ForegroundColor Cyan
    Write-Host (Get-Content $claudeConfigFile -Raw) -ForegroundColor Gray
}

# Final summary
Write-Section "Setup Complete!"

Write-Host "✨ Fast-Kit is ready to use!`n" -ForegroundColor Green

if (-not $SkipConfig) {
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart Claude Code completely (quit and reopen)" -ForegroundColor White
    Write-Host "  2. In Claude Code, try: 'List all prompts'" -ForegroundColor White
    Write-Host "  3. Try your first prompt: 'Use function_creation to create hello world'`n" -ForegroundColor White
} else {
    Write-Host "⚠️  Claude Code configuration was skipped." -ForegroundColor Yellow
    Write-Host "   Run without -SkipConfig to auto-configure Claude Code.`n" -ForegroundColor Yellow
}

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - Quick Start: .\QUICK_START.md" -ForegroundColor White
Write-Host "  - Full Guide (VN): .\docs\getting-started-vi.md" -ForegroundColor White
Write-Host "  - Prompt Reference: .\docs\prompt-quick-reference.md`n" -ForegroundColor White

Write-Host "🐛 Troubleshooting:" -ForegroundColor Cyan
Write-Host "  - Validate setup: .\scripts\validate.ps1" -ForegroundColor White
Write-Host "  - View logs: npm run dev (in each server directory)" -ForegroundColor White
Write-Host "  - GitHub Issues: https://github.com/fast-kit/fast-kit/issues`n" -ForegroundColor White

Write-Success "Happy coding with Fast-Kit!"
