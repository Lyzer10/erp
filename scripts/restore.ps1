param([Parameter(Mandatory=$true)][string]$BackupFile, [switch]$ConfirmRestore)
$ErrorActionPreference = "Stop"
if (-not $ConfirmRestore) { throw "Restore changes the target database. Re-run with -ConfirmRestore after verifying DATABASE_URL and the backup file." }
if (-not $env:DATABASE_URL) { throw "DATABASE_URL is required." }
if (-not (Get-Command pg_restore -ErrorAction SilentlyContinue)) { throw "pg_restore is not installed or not on PATH." }
$resolvedBackup = (Resolve-Path -LiteralPath $BackupFile).Path
& pg_restore --clean --if-exists --no-owner --no-privileges --dbname=$env:DATABASE_URL $resolvedBackup
if ($LASTEXITCODE -ne 0) { throw "pg_restore failed with exit code $LASTEXITCODE." }
Write-Output "Restore completed from: $resolvedBackup"
