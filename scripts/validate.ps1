# Fast-Kit Validation Script for Windows
# Validates that Fast-Kit is properly installed and configured

param([switch]$Verbose)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "→ $msg" -ForegroundColor Cyan }
function Write-Error { param($msg) Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Warning { param($msg) Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Write-Section { param($msg) Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow; Write-Host "  $msg" -ForegroundColor Yellow; Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Yellow }

Write-Host "`n🔍 Fast-Kit Validation`n" -ForegroundColor Magenta

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$FAST_KIT_ROOT = Split-Path -Parent $SCRIPT_DIR

$hasErrors = $false

# Check builds
Write-Section "Checking Builds"

$specKitBuild = Join-Path $FAST_KIT_ROOT "implementations\mcp-servers\spec-kit\dist\index.js"
if (Test-Path $specKitBuild) {
    Write-Success "SpecKit build found"
    if ($Verbose) {
        Write-Info "  Location: $specKitBuild"
    }
} else {
    Write-Error "SpecKit build NOT found"
    Write-Info "  Expected: $specKitBuild"
    Write-Info "  Run: .\scripts\setup.ps1"
    $hasErrors = $true
}

$promptKitBuild = Join-Path $FAST_KIT_ROOT "implementations\mcp-servers\prompt-kit\dist\index.js"
if (Test-Path $promptKitBuild) {
    Write-Success "PromptKit build found"
    if ($Verbose) {
        Write-Info "  Location: $promptKitBuild"
    }
} else {
    Write-Error "PromptKit build NOT found"
    Write-Info "  Expected: $promptKitBuild"
    Write-Info "  Run: .\scripts\setup.ps1"
    $hasErrors = $true
}

# Check Claude Code config
Write-Section "Checking Claude Code Configuration"

$claudeConfigFile = Join-Path $env:APPDATA "claude\config.json"

if (Test-Path $claudeConfigFile) {
    Write-Success "Claude config file found"
    if ($Verbose) {
        Write-Info "  Location: $claudeConfigFile"
    }

    try {
        $config = Get-Content $claudeConfigFile -Raw | ConvertFrom-Json

        if ($config.mcpServers) {
            if ($config.mcpServers.'spec-kit') {
                Write-Success "spec-kit configured"
                $configuredPath = $config.mcpServers.'spec-kit'.args[0]

                if ($Verbose) {
                    Write-Info "  Path: $configuredPath"
                }

                # Check if path is valid
                $normalizedPath = $configuredPath -replace '\\\\', '\'
                if (Test-Path $normalizedPath) {
                    Write-Success "  spec-kit path is valid"
                } else {
                    Write-Warning "  spec-kit path in config does not exist"
                    Write-Info "    Configured: $configuredPath"
                    Write-Info "    Expected: $specKitBuild"
                    $hasErrors = $true
                }
            } else {
                Write-Error "spec-kit NOT configured"
                $hasErrors = $true
            }

            if ($config.mcpServers.'prompt-kit') {
                Write-Success "prompt-kit configured"
                $configuredPath = $config.mcpServers.'prompt-kit'.args[0]

                if ($Verbose) {
                    Write-Info "  Path: $configuredPath"
                }

                # Check if path is valid
                $normalizedPath = $configuredPath -replace '\\\\', '\'
                if (Test-Path $normalizedPath) {
                    Write-Success "  prompt-kit path is valid"
                } else {
                    Write-Warning "  prompt-kit path in config does not exist"
                    Write-Info "    Configured: $configuredPath"
                    Write-Info "    Expected: $promptKitBuild"
                    $hasErrors = $true
                }
            } else {
                Write-Error "prompt-kit NOT configured"
                $hasErrors = $true
            }
        } else {
            Write-Error "No mcpServers section in config"
            $hasErrors = $true
        }
    } catch {
        Write-Error "Failed to parse config.json: $_"
        $hasErrors = $true
    }
} else {
    Write-Error "Claude config file NOT found"
    Write-Info "  Expected: $claudeConfigFile"
    Write-Info "  Run: .\scripts\setup.ps1"
    $hasErrors = $true
}

# Test Node.js execution
Write-Section "Testing MCP Servers"

Write-Info "Testing SpecKit server..."
try {
    $testOutput = node $specKitBuild --test 2>&1
    # Just check if it runs without crashing
    Write-Success "SpecKit server can be executed"
} catch {
    Write-Warning "Could not test SpecKit server execution"
    if ($Verbose) {
        Write-Info "  Error: $_"
    }
}

Write-Info "Testing PromptKit server..."
try {
    $testOutput = node $promptKitBuild --test 2>&1
    Write-Success "PromptKit server can be executed"
} catch {
    Write-Warning "Could not test PromptKit server execution"
    if ($Verbose) {
        Write-Info "  Error: $_"
    }
}

# Summary
Write-Section "Validation Summary"

if ($hasErrors) {
    Write-Host "❌ Validation " -NoNewline -ForegroundColor Red
    Write-Host "FAILED" -ForegroundColor Red
    Write-Host "`nPlease fix the errors above and run setup again:" -ForegroundColor Yellow
    Write-Host "  .\scripts\setup.ps1`n" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "✅ All checks " -NoNewline -ForegroundColor Green
    Write-Host "PASSED" -ForegroundColor Green
    Write-Host "`nFast-Kit is properly configured!`n" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart Claude Code" -ForegroundColor White
    Write-Host "  2. Try: 'List all prompts'" -ForegroundColor White
    Write-Host "  3. Check: .\docs\getting-started-vi.md`n" -ForegroundColor White
    exit 0
}
