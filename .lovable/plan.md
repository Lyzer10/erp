# ERP Frontend Plan — Frosted Light Glass UI

Frontend-only build (no DB, no auth). All data is realistic mock data inline in each page. Built on TanStack Start + Tailwind v4 + shadcn + ECharts. POS is a button only (routes to a "Coming soon" page).

## 1. Design System

**Theme: Frosted Light**
- Background: soft gradient mesh (indigo-50 → white → emerald-50) with blurred floating blobs.
- Surfaces: `bg-white/55 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.08)]` — encapsulated as `.glass-card`, `.glass-panel`, `.glass-nav` utilities in `src/styles.css` via `@utility`.
- Primary `#3b82f6`, success `#10b981`, plus warning/destructive/chart tokens. All defined as oklch in `:root` and mapped through `@theme inline`.
- Type: **Plus Jakarta Sans** (display + body, distinct from default Inter), loaded via `<link>` in `__root.tsx`.
- Radius: `--radius: 1rem` for a softer modern feel. Subtle inner highlight via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.6)`.
- No hand-written `-webkit-backdrop-filter` (per Tailwind v4 gotchas).

## 2. Layout Shell (`src/routes/__root.tsx` + components)

- **Sidebar** (shadcn `Sidebar`, `collapsible="icon"`, glass-styled): 7 groups, each a `Collapsible` with icon + label, sub-items inside.
- **Topbar**: breadcrumb (from current route), global search input, theme toggle (light only for now but token-ready), notifications bell, **`Open POS`** primary glass button, avatar menu.
- **Footer**: subtle company strip.
- Active route highlighting via `useRouterState` + `Link activeProps`.

## 3. Sidebar Structure (7 sections, regrouped per user)

```
Dashboard
👥 Stakeholders → /stakeholders/customers, /stakeholders/suppliers
🧾 Sales        → /sales/invoices, /sales/reports, /sales/receipts,
                  /sales/customer-statement, /sales/inter-branch
📦 Products     → /products/catalog, /products/purchase-orders,
                  /products/expenses, /products/self-service
💰 Finance      → /finance/reports, /finance/chart-of-accounts,
                  /finance/payment-vouchers, /finance/bank-cash,
                  /finance/reconciliation, /finance/ledgers
👨‍💼 HR & Payroll → /hr/staff, /hr/leave, /hr/salary, /hr/payroll
🏪 Store        → /store/stock, /store/transfers, /store/stores
⚙️ Admin        → /admin/users, /admin/settings
POS (topbar btn + sidebar shortcut) → /pos
```

All original ~90 items become **tabs / status filters / table filters inside these pages** (exact mapping per user's spec).

## 4. Pages (route files)

Each page = glass header card (title + actions) → KPI strip → tab bar (where applicable) → main content (filterable data table + side widgets). All tables use shadcn `Table` inside a `glass-card` with sticky header, search, status pills, row actions.

| Route | Tabs / Filters |
|---|---|
| `/` Dashboard | KPIs + ECharts: revenue grouped bar, sales line, expense pie, top products bar, cashflow area |
| `/stakeholders/customers` | List · Advance · Import |
| `/stakeholders/suppliers` | List · Import |
| `/sales/invoices` | Invoices · Proforma · Credit · Cash (+ Create button → modal) |
| `/sales/reports` | Summary · Detailed · By Customer · By Product · By Category · Collection (each with ECharts) |
| `/sales/receipts` | Receipts · Delivery Notes · Merge Invoices |
| `/sales/customer-statement` | Customer selector + statement table + aging chart |
| `/sales/inter-branch` | Transfer · List · Report · Receive |
| `/products/catalog` | Products/Services · Brands & Codes |
| `/products/purchase-orders` | All · Approved · Rejected (+ Create LPO) |
| `/products/expenses` | Categories · Register |
| `/products/self-service` | Payment Requests · Leave · Salary Slip |
| `/finance/reports` | P&L · Cash Book · Income Statement · Trial Balance · Balance Sheet · Vendor (summary/detailed/statement) · Payments · Stock |
| `/finance/chart-of-accounts` | Tree view |
| `/finance/payment-vouchers` | Table + create |
| `/finance/bank-cash` | Bank Accounts · Cash Account · Banks · Branches |
| `/finance/reconciliation` | Prepare · List |
| `/finance/ledgers` | Record DR/CR · Journal · General · Register |
| `/hr/staff` | List · Attendance · Upload |
| `/hr/leave` | Requests · Leave Types · On-Behalf |
| `/hr/salary` | Range · Slips |
| `/hr/payroll` | Prepare · Approved · Completed · Rejected |
| `/store/stock` | Report · Movement · Movement-by-Product · Adjust · Convert · Import |
| `/store/transfers` | Inter Branch · Inter Store · Received Purchases · Issued |
| `/store/stores` | Stores · Conversion Formulas |
| `/admin/users` | List · Departments · Reset Password |
| `/admin/settings` | Configurations · Company Info |
| `/pos` | Placeholder "POS coming soon" glass card |

## 5. Charts (Apache ECharts)

- Install `echarts` and `echarts-for-react`.
- Reusable wrappers in `src/components/charts/`: `BarChart`, `GroupedBarChart`, `LineChart`, `AreaChart`, `PieChart`, `DonutChart`, `GaugeChart` — themed (transparent bg, brand palette, soft grid).
- Used on Dashboard, Sales Reports, Finance Reports, Stock Report, Payroll, Customer Statement aging.

## 6. Reusable Components (`src/components/`)

`AppSidebar`, `Topbar`, `PosButton`, `PageHeader`, `KpiCard`, `GlassCard`, `DataTable` (search + pagination + status badge), `TabsBar`, `StatusPill`, `EmptyState`, mock-data helpers in `src/lib/mock/*.ts`.

## 7. Technical Notes

- Tailwind v4: tokens + `@utility .glass-card`/`.glass-panel` in `src/styles.css`; no `tailwind.config.js`.
- Plus Jakarta Sans loaded via `<link>` in `__root.tsx` head (never `@import` URL).
- All routes use `createFileRoute` matching filename exactly; layout routes render `<Outlet />`.
- No backend, no Lovable Cloud, no auth — pure UI with mock arrays.
- Per-page `head()` with unique title/description.

## 8. Out of Scope (this round)

- POS interactive screen (button + placeholder only).
- Database, auth, real CRUD.
- Dark mode (tokens will be ready, toggle deferred).

After approval I'll scaffold the design tokens + shell first, then build pages in batches.
