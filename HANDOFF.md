# DeveleERP engineering handoff

## Purpose of this document

This is the continuation brief for another AI or engineer. Read this file first, then `ARCHITECTURE.md`, `PATHS.md`, `OPERATIONS.md`, `PRODUCTION_READINESS.md`, and `DESIGN.md`. Do not assume that every historical route is implemented merely because a route file exists.

## Current objective

Prepare DeveleERP for a controlled staging/UAT pilot at one pharmacy in Tanzania. The core pharmacy workflows are implemented locally. The next phase is managed PostgreSQL selection, staging deployment, full workflow acceptance testing, backup/restore proof, monitoring, and regulatory review. Do not put real pharmacy data into the system until the staging checklist is completed.

## Repository and current state

- Repository: `https://github.com/Lyzer10/erp.git`
- Branch: `main`
- Stack: TypeScript, React 19, TanStack Start, Vite 8, Nitro, PostgreSQL, Drizzle ORM and Tailwind CSS.
- Deployment shape: one full-stack TanStack Start application. Do not split the frontend and server functions into unrelated projects.
- Vercel preset: `vercel.json` declares `tanstack-start`; Nitro is registered in `vite.config.ts`.
- Production database must be PostgreSQL. The browser must never connect to it directly.

The repository contains no committed `.env`. Local secrets are intentionally ignored by Git. Never commit a database URL, administrator password, JWT secret, provider service key, or production customer data.

## Work completed

### Authentication and authorization

- PostgreSQL-backed login using bcrypt password hashes.
- Signed JWT stored in an HTTP-only cookie; secure cookies are enabled in production.
- Protected application layout validates the account against the database on every session load.
- Deleted or inactive accounts lose access even if an older token still exists.
- Generic invalid-login messages reduce username enumeration.
- JWT secrets shorter than 32 characters are rejected.
- Server-side role checks exist for administrative, sales, purchase, stock, expense and settings mutations.
- User administration supports account creation, activation/deactivation and password reset.
- Audit records are visible to administrators.
- Demo users, hard-coded demo credentials and the in-memory mock repository were removed.

Important compiler boundary: Node-only PostgreSQL and authentication helpers are wrapped with TanStack `createServerOnlyFn`. This fixed a blank browser screen caused by `pg` entering the client bundle (`Buffer is not defined`). Do not remove those boundaries or import `src/db/index.ts` into browser components.

### Pharmacy inventory and purchasing

- Products contain SKU, barcode, generic/brand name, dosage form, strength, purchase unit, selling unit, unit conversion, pricing, reorder point and prescription flag.
- Purchase orders contain persistent lines.
- Goods receipt requires batch/lot and expiry information.
- Receiving stock atomically creates/updates batches, increases product stock, increases supplier payable, writes inventory movements and creates an audit event.
- Batch quantities cannot be negative.
- Stock adjustments require a reason and create immutable movement/audit records.
- Stock screens display current totals, batches, expiries and movement history.

### Sales

- POS uses real PostgreSQL products and customers.
- The server recalculates prices, discounts, tax and totals; it does not trust browser totals.
- Sale posting is transactional.
- Stock is allocated FEFO from unexpired batches.
- A sale records receipt, item allocations, payment, inventory movements and an audit event.
- Cash, mobile-reference and customer-credit methods are represented.
- Credit sales update the selected customer balance.
- Full sale void restores the exact allocated batches and reverses the credit balance.
- Dashboard, receipts, sales register, reports and customer statement read posted database records.

### Other pilot functionality

- Persistent customers and suppliers with active/inactive status.
- Persistent operating expenses.
- Persistent business identity, currency and tax-rate settings.
- Role-aware navigation.
- English/Swahili translation infrastructure remains in place.
- Prototype-only figures were removed.

### Explicitly disabled scope

The following modules intentionally show a “module not enabled” notice and no fake data: finance ledgers/reconciliation/vouchers, HR/payroll/leave/staff, multi-store management, transfers, inter-branch sales and product self-service. Do not re-enable their old UI until real schemas, transactions, permissions, tests and accounting rules are implemented.

## Database and migrations

Schema source: `src/db/schema.ts`.

Ordered SQL migrations:

1. `0000_base_schema.sql` creates a complete blank-database baseline.
2. `0001_add_is_test_user.sql` preserves the earlier compatibility change.
3. `0002_pharmacy_core.sql` adds pharmacy product fields, batches, sales, payments and inventory movements.
4. `0003_operations.sql` adds account status, operational purchase fields, audit logs and business settings.

`src/db/migrate.ts` applies each migration transactionally and records it in `schema_migrations`. Migrations must be run by a trusted operator before a deployment uses the new code; do not run them automatically on every serverless cold start.

Local development currently uses PostgreSQL 17 as a Windows service named `postgresql-x64-17`, a database named `devele_erp`, and configuration from the ignored `.env`. The blank migration chain, seed, login verification and preflight all passed on 2026-10-22.

The administrator is configured locally, but its password is not documented or committed here. Read it from the authorized local secret manager/ignored `.env`, or reset it deliberately. If an environment value contains `#`, quote the entire value because dotenv otherwise treats the remainder as a comment.

## Commands and expected results

```powershell
npm ci
npm run migrate
npm run seed
npm run verify:login
npm run preflight
npm test
npm run typecheck
npm run build
```

- `migrate`: applies only unapplied SQL files.
- `seed`: creates or updates the configured first administrator and base business settings; it creates no fake transactions.
- `verify:login`: proves that the configured administrator exists, is active and matches the configured password without printing the password.
- `preflight`: checks required tables, active administrator, business settings, nonnegative stock and agreement between product and batch totals.
- `test`: currently has four pure tests covering integer TZS calculations, invalid discounts, FEFO ordering and insufficient unexpired stock.

Last verified locally:

- TypeScript passed.
- Four tests passed.
- Changed-file ESLint passed.
- Nitro/Vite production build passed.
- Production dependency audit had zero vulnerabilities at the last audit.
- Local database preflight and administrator password verification passed.

## Environment variables

Use `env.example` as the names-only template. Required values are:

- `DATABASE_URL`: pooled PostgreSQL connection URL for deployed environments.
- `JWT_SECRET`: random high-entropy value of at least 32 characters.
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: used only by the controlled seed command.
- `BUSINESS_NAME`: initial settings record.
- `DB_POOL_MAX`: keep conservative for serverless PostgreSQL connections.
- `NODE_ENV`: `production` in production.

Do not prefix secrets with `VITE_`; Vite-prefixed values are browser-visible.

## Remaining work before live use

### 1. Managed database and staging

Choose a managed PostgreSQL provider and create separate staging and production databases. Neon or Supabase can support the pilot, but free-tier suspension, pausing, backup retention and usage limits must be reviewed at the time of deployment. Use a pooled connection endpoint. Do not use synthetic keep-alive requests as the reliability plan; move to a non-pausing paid database plan when the pharmacy depends on the system.

Configure staging environment variables in Vercel, run migrations from a trusted operator machine, seed a staging administrator, run `preflight`, and deploy the full TanStack/Nitro application. Do not configure Vercel as a static `dist/client` application.

### 2. End-to-end staging acceptance

With non-production data, test this sequence and record evidence:

1. Sign in, sign out, reset a password, deactivate a user, and confirm the old session stops working.
2. Configure the pharmacy identity and correct tax settings.
3. Create supplier, customer and two products.
4. Receive two batches of the same product with different expiries.
5. Verify product stock equals the sum of batch stock.
6. Complete cash and mobile-reference sales.
7. Confirm FEFO allocates the earliest unexpired batch and expired stock cannot be sold.
8. Complete a customer-credit sale and confirm the balance.
9. Void that sale and confirm exact batch and customer-balance reversal.
10. Make a reasoned stock adjustment and verify movement/audit history.
11. Check receipts, customer statement, dashboard and sales reports against hand calculations.
12. Test each supported role and confirm forbidden mutations fail at the server, not only in navigation.

### 3. Integration tests

Add disposable-PostgreSQL integration tests for sale concurrency, purchase receipt idempotency, void behavior, permissions, inactive users and transaction rollback. Pure calculation tests are not enough to authorize production use. Specifically test two cashiers attempting to sell the last units simultaneously.

### 4. Backups and recovery

`npm run backup` and `scripts/backup.ps1` use `pg_dump`. Store encrypted copies outside the database provider. Restore a backup into a separate database with `scripts/restore.ps1`, run preflight, sign in, and repeat a sample workflow. Record the recovery time and responsible person. A backup without a successful restore test is not considered proven.

### 5. Monitoring and security hardening

- Add production error reporting with secret/PII redaction.
- Add external uptime monitoring and a documented incident contact.
- Configure final security headers and review Content Security Policy.
- Add distributed login throttling appropriate to serverless hosting.
- Review CSRF assumptions when the production domain/cookie configuration is known.
- Rotate the local bootstrap password before production and use a password manager.
- Establish a dependency-update and vulnerability-review process.

### 6. Functional gaps that must not be misrepresented

- Full sale void exists; partial item returns/refunds do not yet have a dedicated return/refund ledger.
- Mobile payment currently records a reference; it does not verify payment with a mobile-money gateway.
- Receipt output is not evidence of TRA EFD/VFD fiscal compliance.
- Prescription flags exist, but controlled-drug/prescription workflows require requirements from the pharmacy and a qualified Tanzanian adviser.
- Multi-branch, inter-store transfers, full accounting/ledgers, payroll and HR are not implemented.
- Images/object storage are not part of the validated pilot path.
- Offline operation and synchronization are not implemented; internet/database outages interrupt use.

### 7. Tanzanian launch review

Before claiming compliance, obtain qualified local advice on pharmacy records, controlled medicines, TRA receipt/EFD/VFD requirements, VAT/tax configuration, customer/staff personal data, retention and breach response. Capture the pharmacy’s real operating process, units, common pack conversions, permitted discounting, approval rules and receipt requirements.

## Git and change-safety guidance

- Preserve `.env` as ignored and never force-add it.
- Inspect `git status`, staged diff and secret scan before every push.
- `src/routeTree.gen.ts` is generated by TanStack Router; regenerate through the normal build/dev tooling rather than editing route definitions there.
- Preserve immutable inventory and audit history; never “fix” stock by deleting movements.
- Use integer TZS amounts throughout unless a documented currency model replaces it.
- Any new stock-changing operation must update product stock, batch stock and inventory movements in one database transaction.

## Recommended next action

The next engineer should start with staging infrastructure, not more UI expansion: provision managed PostgreSQL, configure a Vercel staging project, migrate/seed/preflight, deploy, and execute the acceptance checklist above. Document every failure before changing production scope.
