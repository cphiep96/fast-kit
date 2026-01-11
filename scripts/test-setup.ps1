# Simple Fast-Kit Setup Test
# Quick test to verify the setup script concept works

Write-Host "`n=== Fast-Kit Setup Test ===`n" -ForegroundColor Cyan

# Check Node
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVer = node --version
    Write-Host "[OK] Node.js: $nodeVer" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Node.js not found" -ForegroundColor Red
    exit 1
}

# Check npm
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVer = npm --version
    Write-Host "[OK] npm: v$npmVer" -ForegroundColor Green
} else {
    Write-Host "[FAIL] npm not found" -ForegroundColor Red
    exit 1
}

# Get paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$specKit = Join-Path $rootDir "implementations\mcp-servers\spec-kit"
$promptKit = Join-Path $rootDir "implementations\mcp-servers\prompt-kit"

Write-Host "`nRoot: $rootDir" -ForegroundColor Gray

# Check if servers exist
if (Test-Path $specKit) {
    Write-Host "[OK] SpecKit found" -ForegroundColor Green
} else {
    Write-Host "[FAIL] SpecKit not found" -ForegroundColor Red
}

if (Test-Path $promptKit) {
    Write-Host "[OK] PromptKit found" -ForegroundColor Green
} else {
    Write-Host "[FAIL] PromptKit not found" -ForegroundColor Red
}

Write-Host "`nTest completed!`n" -ForegroundColor Cyan
