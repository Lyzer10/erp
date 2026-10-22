# Operations and deployment runbook

## Local or staging preparation

1. Copy `env.example` to `.env` and replace every placeholder. Generate `JWT_SECRET` as a high-entropy secret of at least 32 characters.
2. Create an empty PostgreSQL database and set its pooled connection URL as `DATABASE_URL`.
3. Run `npm ci`, `npm run migrate`, `npm run seed`, and `npm run preflight`.
4. Run `npm test`, `npm run typecheck`, and `npm run build`.
5. Sign in with the first administrator and replace any temporary password through a controlled reset.

The seed command requires `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and `BUSINESS_NAME`. It does not create products or artificial transactions.

## Staging acceptance test

Use non-production data and exercise this exact sequence: create users and permissions; configure tax/business identity; create supplier/customer/products; receive two batches with different expiries; adjust stock with a reason; sell by cash and mobile reference; verify FEFO; make a credit sale; void it; verify batch stock, customer balance, movements, dashboard and reports; deactivate a user and confirm their old session stops working.

Do not enter real pharmacy data until this test passes and a backup has been restored successfully into a separate database.

## Backups

`npm run backup` uses `pg_dump` and writes a timestamped custom-format archive under the project `backups` directory. Copy archives to separately controlled encrypted storage. A backup retained only beside the live database is not sufficient.

Restore to a separate target first:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/restore.ps1 -BackupFile C:\absolute\backup.dump -TargetDatabaseUrl "postgresql://..." -ConfirmRestore
```

After restore, point a staging instance at the restored database and run `npm run preflight` plus the acceptance test.

## Vercel handoff

The repository is configured as TanStack Start, with Nitro producing the server runtime. Import the repository into Vercel and set `DATABASE_URL`, `JWT_SECRET`, and `DB_POOL_MAX` as encrypted environment variables. Do not set secrets with a `VITE_` prefix. Apply migrations and seed from a trusted operator machine, not on every serverless cold start.

Use a PostgreSQL pooled connection endpoint. If using Supabase free tier, database pausing cannot be made production-reliable from application code; upgrade to a non-pausing plan once the pharmacy depends on the system. Keep external backups regardless of provider plan.

Before production, configure a custom domain, uptime monitoring, server error reporting and an incident contact. Confirm Tanzanian EFD/receipt, tax, pharmacy/controlled-drug and personal-data obligations with qualified local advisers; the software does not claim regulatory certification.
