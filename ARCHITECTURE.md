# DeveleERP architecture

## Runtime

DeveleERP is one full-stack TypeScript application. React and TanStack Start render the user interface, TanStack server functions implement the trusted server boundary, Drizzle maps application records, and PostgreSQL is the system of record. The browser never connects directly to PostgreSQL.

```text
Browser
  -> TanStack Start routes and React UI
  -> authenticated server functions
  -> transaction/permission layer
  -> Drizzle + node-postgres pool
  -> managed PostgreSQL
```

Vercel should deploy the entire application, not only `dist/client`. Nitro packages server rendering and server functions for Vercel. PostgreSQL may be hosted by Supabase or Neon; use its pooled connection URL for `DATABASE_URL`.

## Security boundary

- Login checks a bcrypt password hash in PostgreSQL.
- A signed JWT is stored in an HTTP-only, secure-in-production, SameSite=Lax cookie.
- Every protected route verifies that the referenced account still exists and is active.
- Mutations enforce roles on the server; hiding a menu item is not treated as authorization.
- Test/demo accounts and the in-memory mock repository have been removed.
- Prices, taxes, totals, stock and balances are recalculated in server transactions.
- Sensitive configuration is server-only and must not use a `VITE_` prefix.

Roles currently recognized are `SuperAdmin`, `Admin`, `Pharmacist`, `Cashier`, `Storekeeper`, `Accountant`, and `User`. Server functions define the exact permitted subset for each mutation.

## Data model and transaction flows

Products hold sellable-unit stock and pharmacy metadata. Each received lot is a `product_batches` row with a batch number, expiry date, cost and remaining quantity. `inventory_movements` is the immutable explanation for stock changes.

Purchase receipt is atomic:

```text
purchase order + lines
  -> batches created/updated
  -> product stock increased
  -> supplier payable increased
  -> inventory movements + audit event
```

Sale posting is atomic:

```text
validated cart
  -> server pricing/tax calculation
  -> FEFO allocation from unexpired batches
  -> sale + item allocations + payment
  -> product/batch stock decreased
  -> optional customer credit balance
  -> inventory movements + audit event
```

A sale void restores the exact batch allocations and reverses its credit balance inside one transaction. Manual adjustments require a reason and are recorded in both inventory movements and the audit log.

Money is stored as integer Tanzanian shillings, avoiding floating-point rounding. Tax is stored in basis points (for example, 18% is `1800`).

## Source layout

- `src/routes`: pages and route loaders.
- `src/lib/api`: authenticated server functions and transactional use cases.
- `src/lib/data-source.ts`: PostgreSQL-backed repository used by CRUD screens.
- `src/db/schema.ts`: Drizzle schema.
- `src/db/migrations`: ordered, transactional SQL migrations, including a blank-database baseline.
- `src/components/erp`: application shell and shared ERP components.
- `scripts`: operator-run backup and restore tools.

## Deliberate scope

The production pilot includes authentication, products, batches, purchase receipt, POS sales, receipts/voids, customers, suppliers, expenses, stock adjustments, sales reports, users, audit history and business settings. Finance ledgers, HR/payroll, multiple stores/transfers, inter-branch sales and product self-service are explicitly disabled. They show no fabricated business data and should only be enabled after their accounting and transaction models are implemented.

## Reliability model

- Run `npm run migrate` before a release and `npm run preflight` afterward.
- Run `npm run backup` on an independent schedule and keep copies outside the database provider.
- A free database is acceptable for a controlled pilot, not a promise of continuous availability. Provider pausing is avoided by upgrading to a non-pausing plan; synthetic keep-alive queries are not a dependable production fix and may violate free-tier expectations.
- A pilot launch still requires an actual restore drill, staging/UAT, error monitoring and confirmation of Tanzanian pharmacy, receipt/EFD, tax and data-protection requirements.
