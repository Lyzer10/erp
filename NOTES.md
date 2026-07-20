# Session Handoff Notes & System Architecture

## Summary of Accomplished Work

### 1. Version Pinning Fix & Clean Install Verification
- **`package.json` Dependencies**: Replaced invalid static version pins (`@tanstack/react-router@1.167.50`, `@tanstack/react-start@1.167.50`, `@tanstack/router-plugin@1.167.28`) with valid, registry-resolvable caret ranges (`^1.168.25` for `react-router` and `react-start`, `^1.167.28` for `router-plugin`).
- **Clean Installation**: Wiped `node_modules` and `package-lock.json` entirely and ran `npm install` from scratch. Installed 524 packages with 0 dependency resolution errors.
- **Build & Integration Verification**: Confirmed production build (`npm run build`) and full integration test suite (`npm run test:demo`) pass with 0 errors on clean installation.

### 2. Authentication & Demo/Real System Architecture
- **Demo/Test User System**: In-memory `SessionMockDataStore` with TTL eviction and secure self-scoped reset.
- **Real Auth Flow**: Bcrypt password hash verification (`loginUserFn`), JWT stored in server-side `httpOnly` `Secure` auth cookie, and zero unauthenticated/hardcoded password bypasses (`123456` and `x-test-user` header removed).
- **`resolveDataSource()` Utility**: Server-side request inspection via `getRequest()` from `@tanstack/react-start/server`. Routes requests with `isTestUser: true` to the in-memory mock store and requests with `isTestUser: false` to the Postgres database via Drizzle ORM.
- **Wired Routes**: All 18 application routes (`customers`, `suppliers`, `catalog`, `expenses`, `purchase-orders`, `invoices`, `stock`, `stores`, `transfers`, `staff`, `payroll`, `leave`, `users`, etc.) have been updated to extract loader data via domain API server functions (`src/lib/api/domain.ts`).

---

## Next Steps for Future Session

1. **Backend Domain Functions**: Expand domain functions in `src/lib/api/domain.ts` for modules lacking explicit backend mutations (`reconciliation`, `bank/cash`, `ledgers`, `reports`, `receipts`, `purchase-orders`, `POS`, `admin users/settings`, `HR salary`).
2. **Component Mutators**: Wire UI form dialogs (create/update) in all remaining modules to trigger domain API mutations.
