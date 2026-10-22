# Application paths

All `/app` paths require an active database user. Navigation is intentionally limited to implemented modules.

| Path                                | Purpose                                      | Persistence                 |
| ----------------------------------- | -------------------------------------------- | --------------------------- |
| `/login`                            | Account sign-in                              | PostgreSQL users            |
| `/app`                              | Sales, stock and expense overview            | Live aggregates             |
| `/app/pos`                          | Checkout, payments and receipt posting       | Atomic sale transaction     |
| `/app/products/catalog`             | Pharmacy product catalogue                   | PostgreSQL products         |
| `/app/products/purchase-orders`     | Purchase history and goods receipt           | Orders, lines, batches      |
| `/app/products/purchase-orders/new` | Create or immediately receive a purchase     | Atomic purchase transaction |
| `/app/products/expenses`            | Record operating expenses                    | PostgreSQL expenses         |
| `/app/store/stock`                  | Batch/expiry view, movements and adjustments | Inventory ledger            |
| `/app/sales/receipts`               | Posted receipts and controlled void          | Sales ledger                |
| `/app/sales/invoices`               | Posted sales register                        | Sales ledger                |
| `/app/sales/reports`                | Sales totals derived from posted sales       | Live aggregates             |
| `/app/sales/customer-statement`     | Customer credit activity                     | Sales/customer records      |
| `/app/stakeholders/customers`       | Customer records and status                  | PostgreSQL customers        |
| `/app/stakeholders/suppliers`       | Supplier records and status                  | PostgreSQL suppliers        |
| `/app/admin/users`                  | Accounts, password reset and audit history   | Admin only                  |
| `/app/admin/settings`               | Business identity, currency and tax          | Admin only                  |

Disabled paths remain routable only so old bookmarks fail honestly. They render a “module not enabled” notice and no dummy totals: `/app/finance/*`, `/app/hr/*`, `/app/store/stores`, `/app/store/transfers`, `/app/sales/inter-branch`, and `/app/products/self-service`.

`/pos-display` redirects to the authenticated POS. Invoice/proforma creation paths redirect to POS because a posted sale is the current supported sales document.

## Important file paths

| Concern                                   | File                                        |
| ----------------------------------------- | ------------------------------------------- |
| Database schema                           | `src/db/schema.ts`                          |
| SQL migrations                            | `src/db/migrations/`                        |
| Migration runner                          | `src/db/migrate.ts`                         |
| Seed/first administrator                  | `src/db/seed.ts`                            |
| Authentication                            | `src/lib/auth.ts`, `src/lib/api/auth.ts`    |
| Sales transaction                         | `src/lib/api/sales.ts`                      |
| Purchase transaction                      | `src/lib/api/purchases.ts`                  |
| Stock, voids, expenses, reports, settings | `src/lib/api/operations.ts`                 |
| User administration                       | `src/lib/api/admin.ts`                      |
| Environment template                      | `env.example`                               |
| Backup and restore                        | `scripts/backup.ps1`, `scripts/restore.ps1` |
| Hosting preset                            | `vercel.json`, `vite.config.ts`             |
