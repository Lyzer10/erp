# Production readiness status

This document records the evidence-based launch status of DeveleERP. A checked
item must be backed by a repeatable test; visual presence of a screen is not
evidence that its workflow is implemented.

## Current decision

**Ready for staging/UAT, not yet authorized for live pharmacy data.** Core pilot
workflows are persisted and prototype modules are disabled. Live launch still
requires a configured database, migration/preflight run, restore drill, pharmacy
acceptance test, monitoring, and Tanzanian regulatory confirmation.

## Confirmed architecture

- TanStack Start and React application with server functions in the same deployable unit.
- PostgreSQL access through Drizzle ORM.
- JWT authentication stored in an HTTP-only cookie.
- PostgreSQL is the only business-data repository; demo/mock data was removed.

## Launch blockers found

### Security and integrity

- [x] Invalid credentials no longer navigate to the dashboard.
- [x] Protected application routes now verify the server-side session.
- [x] Unauthenticated server functions no longer receive the production repository.
- [x] Tokens for deleted users no longer remain valid.
- [x] Database failures no longer return fake successful records or empty lists.
- [x] Account status, admin password reset, password policy, and audit events.
- [x] Server-side permissions for admin, pharmacist, cashier, storekeeper, and accountant roles.
- [~] SameSite cookies are set; distributed login throttling and final security-header review remain hosting tasks.

### Persistent business workflows

- [x] Customers, suppliers, products and expenses use PostgreSQL.
- [x] POS atomically posts sales, payments, FEFO allocations, movements and receipt numbers.
- [x] Purchases atomically post lines, batches, supplier payable and stock movements.
- [x] Sale voids and reasoned stock adjustments are persistent and audited.
- [x] Dashboard, sales reports, settings, users and audit history use live records.
- [x] Unimplemented finance, HR, multi-store and inter-branch areas are explicitly disabled.

### Pharmacy requirements

- [x] Product generic/brand name, dosage form, strength, pack size, barcode, and unit conversion.
- [x] Batch/lot number and expiry date per received stock batch.
- [x] FEFO allocation, expiry warnings, and prevention of expired-product sales.
- [x] Purchase and sale units with conversion ratios.
- [x] Stock adjustments, required reasons, and immutable movement history.
- [ ] Prescription/controlled-item requirements must be confirmed with the pharmacy and a qualified Tanzanian compliance adviser.

### Operations

- [x] Complete ordered migrations include a blank-database baseline; execution awaits a database URL.
- [x] First-administrator seed does not print passwords.
- [~] Pure sale/FEFO tests exist; database transaction/permission integration tests require staging PostgreSQL.
- [x] Backup/restore tools and runbook exist; the operator must perform and record the first restore drill.
- [ ] Staging environment using non-production data.
- [ ] Monitoring, error reporting, health checks, and an incident contact.
- [ ] Confirm current Tanzanian tax, receipt/EFD, pharmacy, and data-protection obligations before launch.

## Safe implementation order

1. Authentication, authorization, validation, and audit trail.
2. Pharmacy product, batch, store, and inventory-movement schema.
3. Purchasing and goods receipt, including batches and expiries.
4. POS sales, payments, receipts, returns, and atomic stock deduction.
5. Expenses, cash/bank, supplier/customer balances, and accounting postings.
6. Reports derived only from posted database transactions.
7. User acceptance testing, backup/restore drill, then staging deployment.

## Verification baseline

- `npm run typecheck`: passing on 2026-10-21.
- `npm test`: 4/4 pricing, discount and FEFO tests passing on 2026-10-21.
- Changed TypeScript/TSX files pass ESLint; the full repository lint is too slow under the current workspace limit.
- `npm run build`: passing with the Vite 8/Nitro full-stack production output on 2026-10-21.
- `npm audit --omit=dev`: zero production vulnerabilities on 2026-10-21. Four moderate development-only findings remain through Drizzle Kit's legacy esbuild loader.
- Blank-database migrations, administrator seed, credential verification, and database preflight passed against local PostgreSQL 17 on 2026-10-22.
