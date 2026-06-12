import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { U as Upload, D as Download } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-B6Vu-Opo.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card max-w-md p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Go to Dashboard" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card max-w-md p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong. Try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        router2.invalidate();
        reset();
      }, className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90", children: "Try again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent", children: "Go home" })
    ] })
  ] }) });
}
const Route$z = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DeveleERP — Enterprise Suite" },
      { name: "description", content: "Modern ERP for sales, inventory, finance, HR & payroll." },
      { name: "author", content: "DeveleICT" },
      { property: "og:title", content: "DeveleERP — Enterprise Suite" },
      { property: "og:description", content: "Modern ERP for sales, inventory, finance, HR & payroll." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://develeerp.vercel.app/" },
      { property: "og:image", content: "https://develeerp.vercel.app/devele-logo.png" },
      { property: "og:image:alt", content: "DeveleERP — Enterprise Suite" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "DeveleERP — Enterprise Suite" },
      { name: "twitter:description", content: "Modern ERP for sales, inventory, finance, HR & payroll." },
      { name: "twitter:image", content: "https://develeerp.vercel.app/devele-logo.png" }
    ],
    links: [
      { rel: "icon", href: "/devele-logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/devele-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$z.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$y = () => import("./login-CnxfpuWS.mjs");
const Route$y = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign In — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("../_app-Cu2wvMfs.mjs");
const Route$x = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("../_app.index-BG-OmlXZ.mjs");
const Route$w = createFileRoute("/_app/")({
  head: () => ({
    meta: [{
      title: "Dashboard — Lumen ERP"
    }, {
      name: "description",
      content: "Business performance overview."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("../_app.pos-D5wcvHHa.mjs");
const Route$v = createFileRoute("/_app/pos")({
  head: () => ({
    meta: [{
      title: "Point of Sale — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("../_app.store.transfers-BXf7kjwT.mjs");
const Route$u = createFileRoute("/_app/store/transfers")({
  head: () => ({
    meta: [{
      title: "Store Transfers — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("../_app.store.stores-CIDAw1kz.mjs");
const Route$t = createFileRoute("/_app/store/stores")({
  head: () => ({
    meta: [{
      title: "Stores — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("../_app.store.stock-B4fkfbC4.mjs");
const Route$s = createFileRoute("/_app/store/stock")({
  head: () => ({
    meta: [{
      title: "Stock — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("../_app.stakeholders.suppliers-r2_vPCGP.mjs");
const Route$r = createFileRoute("/_app/stakeholders/suppliers")({
  head: () => ({
    meta: [{
      title: "Suppliers — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("../_app.stakeholders.customers-DKptjsAA.mjs");
const Route$q = createFileRoute("/_app/stakeholders/customers")({
  head: () => ({
    meta: [{
      title: "Customers — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
function ImportCard({
  title,
  templateName
}) {
  const [fileName, setFileName] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card space-y-5 p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5 text-teal-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700", children: "Select File:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 hover:bg-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700", children: "Choose File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: fileName || "No file chosen" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", className: "hidden", accept: ".csv,.xlsx", onChange: (e) => setFileName(e.target.files?.[0]?.name ?? "") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#download-template", className: "inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
      " Download: ",
      templateName
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700", children: "Submit" }) })
  ] }) });
}
const $$splitComponentImporter$p = () => import("../_app.sales.reports-D8BeufPk.mjs");
const Route$p = createFileRoute("/_app/sales/reports")({
  head: () => ({
    meta: [{
      title: "Sales Reports — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("../_app.sales.receipts-BoocjFxq.mjs");
const Route$o = createFileRoute("/_app/sales/receipts")({
  head: () => ({
    meta: [{
      title: "Receipts & Delivery — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("../_app.sales.invoices-BFsOu0JM.mjs");
const Route$n = createFileRoute("/_app/sales/invoices")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("../_app.sales.inter-branch-5iUosWtA.mjs");
const Route$m = createFileRoute("/_app/sales/inter-branch")({
  head: () => ({
    meta: [{
      title: "Inter-Branch — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("../_app.sales.customer-statement-CBmdUA5b.mjs");
const Route$l = createFileRoute("/_app/sales/customer-statement")({
  head: () => ({
    meta: [{
      title: "Customer Statement — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("../_app.products.self-service-0OZnFNqp.mjs");
const Route$k = createFileRoute("/_app/products/self-service")({
  head: () => ({
    meta: [{
      title: "Employee Self Service — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("../_app.products.purchase-orders-BFsOu0JM.mjs");
const Route$j = createFileRoute("/_app/products/purchase-orders")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("../_app.products.expenses-DOAznc31.mjs");
const Route$i = createFileRoute("/_app/products/expenses")({
  head: () => ({
    meta: [{
      title: "Expenses — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("../_app.products.catalog-DkMpanIF.mjs");
const Route$h = createFileRoute("/_app/products/catalog")({
  head: () => ({
    meta: [{
      title: "Products & Services — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("../_app.hr.staff-BakDDZp9.mjs");
const Route$g = createFileRoute("/_app/hr/staff")({
  head: () => ({
    meta: [{
      title: "Staff — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("../_app.hr.salary-CC-MAPWx.mjs");
const Route$f = createFileRoute("/_app/hr/salary")({
  head: () => ({
    meta: [{
      title: "Salary — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("../_app.hr.payroll-afAOPQMS.mjs");
const Route$e = createFileRoute("/_app/hr/payroll")({
  head: () => ({
    meta: [{
      title: "Payroll — Lumen ERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("../_app.hr.leave-C_r36mWP.mjs");
const Route$d = createFileRoute("/_app/hr/leave")({
  head: () => ({
    meta: [{
      title: "Leave — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("../_app.finance.reports-BepMS5gp.mjs");
const Route$c = createFileRoute("/_app/finance/reports")({
  head: () => ({
    meta: [{
      title: "Financial Reports — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("../_app.finance.reconciliation-CigSlAMR.mjs");
const Route$b = createFileRoute("/_app/finance/reconciliation")({
  head: () => ({
    meta: [{
      title: "Bank Reconciliation — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("../_app.finance.payment-vouchers-DFuPw3jq.mjs");
const Route$a = createFileRoute("/_app/finance/payment-vouchers")({
  head: () => ({
    meta: [{
      title: "Payment Vouchers — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("../_app.finance.ledgers-FniQndAw.mjs");
const Route$9 = createFileRoute("/_app/finance/ledgers")({
  head: () => ({
    meta: [{
      title: "Ledgers — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("../_app.finance.chart-of-accounts-BgE4BWzK.mjs");
const Route$8 = createFileRoute("/_app/finance/chart-of-accounts")({
  head: () => ({
    meta: [{
      title: "Chart of Accounts — Lumen ERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("../_app.finance.bank-cash--PpaWzqQ.mjs");
const Route$7 = createFileRoute("/_app/finance/bank-cash")({
  head: () => ({
    meta: [{
      title: "Bank & Cash — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_app.admin.users-BG6JE_dY.mjs");
const Route$6 = createFileRoute("/_app/admin/users")({
  head: () => ({
    meta: [{
      title: "Users — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_app.admin.settings-ClUq_LjK.mjs");
const Route$5 = createFileRoute("/_app/admin/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Lumen ERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_app.sales.invoices.index-BNq99m6W.mjs");
const Route$4 = createFileRoute("/_app/sales/invoices/")({
  head: () => ({
    meta: [{
      title: "Invoices — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_app.products.purchase-orders.index-C3laEtHD.mjs");
const Route$3 = createFileRoute("/_app/products/purchase-orders/")({
  head: () => ({
    meta: [{
      title: "Purchase Orders — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_app.sales.invoices.proforma-e2E46glE.mjs");
const Route$2 = createFileRoute("/_app/sales/invoices/proforma")({
  head: () => ({
    meta: [{
      title: "Create Proforma — Lumen ERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_app.sales.invoices.new-CtfbSL7m.mjs");
const Route$1 = createFileRoute("/_app/sales/invoices/new")({
  head: () => ({
    meta: [{
      title: "Create Invoice — Lumen ERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("../_app.products.purchase-orders.new-DTGpA9fq.mjs");
const Route = createFileRoute("/_app/products/purchase-orders/new")({
  head: () => ({
    meta: [{
      title: "Create LPO — DeveleERP"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$y.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$z
});
const AppRoute = Route$x.update({
  id: "/_app",
  getParentRoute: () => Route$z
});
const AppIndexRoute = Route$w.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AppPosRoute = Route$v.update({
  id: "/pos",
  path: "/pos",
  getParentRoute: () => AppRoute
});
const AppStoreTransfersRoute = Route$u.update({
  id: "/store/transfers",
  path: "/store/transfers",
  getParentRoute: () => AppRoute
});
const AppStoreStoresRoute = Route$t.update({
  id: "/store/stores",
  path: "/store/stores",
  getParentRoute: () => AppRoute
});
const AppStoreStockRoute = Route$s.update({
  id: "/store/stock",
  path: "/store/stock",
  getParentRoute: () => AppRoute
});
const AppStakeholdersSuppliersRoute = Route$r.update({
  id: "/stakeholders/suppliers",
  path: "/stakeholders/suppliers",
  getParentRoute: () => AppRoute
});
const AppStakeholdersCustomersRoute = Route$q.update({
  id: "/stakeholders/customers",
  path: "/stakeholders/customers",
  getParentRoute: () => AppRoute
});
const AppSalesReportsRoute = Route$p.update({
  id: "/sales/reports",
  path: "/sales/reports",
  getParentRoute: () => AppRoute
});
const AppSalesReceiptsRoute = Route$o.update({
  id: "/sales/receipts",
  path: "/sales/receipts",
  getParentRoute: () => AppRoute
});
const AppSalesInvoicesRoute = Route$n.update({
  id: "/sales/invoices",
  path: "/sales/invoices",
  getParentRoute: () => AppRoute
});
const AppSalesInterBranchRoute = Route$m.update({
  id: "/sales/inter-branch",
  path: "/sales/inter-branch",
  getParentRoute: () => AppRoute
});
const AppSalesCustomerStatementRoute = Route$l.update({
  id: "/sales/customer-statement",
  path: "/sales/customer-statement",
  getParentRoute: () => AppRoute
});
const AppProductsSelfServiceRoute = Route$k.update({
  id: "/products/self-service",
  path: "/products/self-service",
  getParentRoute: () => AppRoute
});
const AppProductsPurchaseOrdersRoute = Route$j.update({
  id: "/products/purchase-orders",
  path: "/products/purchase-orders",
  getParentRoute: () => AppRoute
});
const AppProductsExpensesRoute = Route$i.update({
  id: "/products/expenses",
  path: "/products/expenses",
  getParentRoute: () => AppRoute
});
const AppProductsCatalogRoute = Route$h.update({
  id: "/products/catalog",
  path: "/products/catalog",
  getParentRoute: () => AppRoute
});
const AppHrStaffRoute = Route$g.update({
  id: "/hr/staff",
  path: "/hr/staff",
  getParentRoute: () => AppRoute
});
const AppHrSalaryRoute = Route$f.update({
  id: "/hr/salary",
  path: "/hr/salary",
  getParentRoute: () => AppRoute
});
const AppHrPayrollRoute = Route$e.update({
  id: "/hr/payroll",
  path: "/hr/payroll",
  getParentRoute: () => AppRoute
});
const AppHrLeaveRoute = Route$d.update({
  id: "/hr/leave",
  path: "/hr/leave",
  getParentRoute: () => AppRoute
});
const AppFinanceReportsRoute = Route$c.update({
  id: "/finance/reports",
  path: "/finance/reports",
  getParentRoute: () => AppRoute
});
const AppFinanceReconciliationRoute = Route$b.update({
  id: "/finance/reconciliation",
  path: "/finance/reconciliation",
  getParentRoute: () => AppRoute
});
const AppFinancePaymentVouchersRoute = Route$a.update({
  id: "/finance/payment-vouchers",
  path: "/finance/payment-vouchers",
  getParentRoute: () => AppRoute
});
const AppFinanceLedgersRoute = Route$9.update({
  id: "/finance/ledgers",
  path: "/finance/ledgers",
  getParentRoute: () => AppRoute
});
const AppFinanceChartOfAccountsRoute = Route$8.update({
  id: "/finance/chart-of-accounts",
  path: "/finance/chart-of-accounts",
  getParentRoute: () => AppRoute
});
const AppFinanceBankCashRoute = Route$7.update({
  id: "/finance/bank-cash",
  path: "/finance/bank-cash",
  getParentRoute: () => AppRoute
});
const AppAdminUsersRoute = Route$6.update({
  id: "/admin/users",
  path: "/admin/users",
  getParentRoute: () => AppRoute
});
const AppAdminSettingsRoute = Route$5.update({
  id: "/admin/settings",
  path: "/admin/settings",
  getParentRoute: () => AppRoute
});
const AppSalesInvoicesIndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppSalesInvoicesRoute
});
const AppProductsPurchaseOrdersIndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppProductsPurchaseOrdersRoute
});
const AppSalesInvoicesProformaRoute = Route$2.update({
  id: "/proforma",
  path: "/proforma",
  getParentRoute: () => AppSalesInvoicesRoute
});
const AppSalesInvoicesNewRoute = Route$1.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => AppSalesInvoicesRoute
});
const AppProductsPurchaseOrdersNewRoute = Route.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => AppProductsPurchaseOrdersRoute
});
const AppProductsPurchaseOrdersRouteChildren = {
  AppProductsPurchaseOrdersNewRoute,
  AppProductsPurchaseOrdersIndexRoute
};
const AppProductsPurchaseOrdersRouteWithChildren = AppProductsPurchaseOrdersRoute._addFileChildren(
  AppProductsPurchaseOrdersRouteChildren
);
const AppSalesInvoicesRouteChildren = {
  AppSalesInvoicesNewRoute,
  AppSalesInvoicesProformaRoute,
  AppSalesInvoicesIndexRoute
};
const AppSalesInvoicesRouteWithChildren = AppSalesInvoicesRoute._addFileChildren(AppSalesInvoicesRouteChildren);
const AppRouteChildren = {
  AppPosRoute,
  AppIndexRoute,
  AppAdminSettingsRoute,
  AppAdminUsersRoute,
  AppFinanceBankCashRoute,
  AppFinanceChartOfAccountsRoute,
  AppFinanceLedgersRoute,
  AppFinancePaymentVouchersRoute,
  AppFinanceReconciliationRoute,
  AppFinanceReportsRoute,
  AppHrLeaveRoute,
  AppHrPayrollRoute,
  AppHrSalaryRoute,
  AppHrStaffRoute,
  AppProductsCatalogRoute,
  AppProductsExpensesRoute,
  AppProductsPurchaseOrdersRoute: AppProductsPurchaseOrdersRouteWithChildren,
  AppProductsSelfServiceRoute,
  AppSalesCustomerStatementRoute,
  AppSalesInterBranchRoute,
  AppSalesInvoicesRoute: AppSalesInvoicesRouteWithChildren,
  AppSalesReceiptsRoute,
  AppSalesReportsRoute,
  AppStakeholdersCustomersRoute,
  AppStakeholdersSuppliersRoute,
  AppStoreStockRoute,
  AppStoreStoresRoute,
  AppStoreTransfersRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  AppRoute: AppRouteWithChildren,
  LoginRoute
};
const routeTree = Route$z._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ImportCard as I,
  router as r
};
