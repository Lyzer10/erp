import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { c as currency, i as invoices } from "./_ssr/mock-CXuNXaWS.mjs";
import { F as FileText, h as Plus, R as Receipt, v as CircleCheck, _ as Clock, T as TrendingUp, $ as TrendingDown } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const tintMap = {
  blue: "from-blue-500/20 to-blue-400/5 text-blue-600",
  emerald: "from-emerald-500/20 to-emerald-400/5 text-emerald-600",
  amber: "from-amber-500/20 to-amber-400/5 text-amber-600",
  violet: "from-violet-500/20 to-violet-400/5 text-violet-600",
  cyan: "from-cyan-500/20 to-cyan-400/5 text-cyan-600"
};
function KpiCard({ label, value, delta, hint, icon: Icon, tint = "blue" }) {
  const positive = (delta ?? 0) >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: label }),
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("shrink-0 rounded-xl bg-linear-to-br p-2.5", tintMap[tint]), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-bold tracking-tight text-foreground", children: value }),
    (delta !== void 0 || hint) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-xs", children: [
      delta !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
        positive ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700"
      ), children: [
        positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
        positive ? "+" : "",
        delta,
        "%"
      ] }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: hint })
    ] })
  ] });
}
function InvoicesPage() {
  const cols = [{
    key: "id",
    header: "Invoice #"
  }, {
    key: "customer",
    header: "Customer"
  }, {
    key: "date",
    header: "Date"
  }, {
    key: "due",
    header: "Due"
  }, {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: currency(r.amount) })
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
  }];
  const byType = (t) => invoices.filter((i) => i.type === t);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Invoices", description: "Create and manage invoices, proformas, credit notes, and cash sales.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/80", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
        " Merge Invoices"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sales/invoices/new", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " New Invoice"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Total Issued", value: currency(invoices.reduce((s, i) => s + i.amount, 0)), icon: Receipt, tint: "blue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Paid", value: String(invoices.filter((i) => i.status === "Paid").length), icon: CircleCheck, tint: "emerald" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Pending", value: String(invoices.filter((i) => i.status === "Pending").length), icon: Clock, tint: "amber" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Overdue", value: String(invoices.filter((i) => i.status === "Overdue").length), icon: Clock, tint: "violet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
      key: "all",
      label: "All Invoices",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: byType("Invoice"), columns: cols })
    }, {
      key: "proforma",
      label: "Proforma",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sales/invoices/proforma", className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " New Proforma"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: byType("Proforma"), columns: cols })
      ] })
    }, {
      key: "credit",
      label: "Credit Notes",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: byType("Credit Note"), columns: cols })
    }, {
      key: "cash",
      label: "Cash Sales",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: byType("Cash Sale"), columns: cols })
    }] })
  ] });
}
export {
  InvoicesPage as component
};
