param([string]$OutputDirectory = "backups")
$ErrorActionPreference = "Stop"
if (-not $env:DATABASE_URL) { throw "DATABASE_URL is required." }
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) { throw "pg_dump is not installed or not on PATH." }
$resolvedRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$targetDirectory = [System.IO.Path]::GetFullPath((Join-Path $resolvedRoot $OutputDirectory))
if (-not $targetDirectory.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) { throw "Backup path must remain inside the project directory." }
New-Item -ItemType Directory -Force -Path $targetDirectory | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$target = Join-Path $targetDirectory "develeerp-$stamp.dump"
& pg_dump --format=custom --no-owner --no-privileges --file=$target $env:DATABASE_URL
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed with exit code $LASTEXITCODE." }
Write-Output "Backup created: $target"
