import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { E as EChart } from "./_ssr/EChart-VxhO2r3D.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import { W as Wallet, R as Receipt, T as TrendingUp, H as HandCoins, k as ShoppingCart, b as Users, l as Clock4, m as TriangleAlert, n as Coins, o as Banknote, F as FileText, p as FileCheckCorner, q as Calendar, r as Landmark, s as PackageX, t as PackageCheck, u as FileExclamationPoint, v as CircleCheck, A as ArrowUpRight, w as ArrowDownRight } from "./_libs/lucide-react.mjs";
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
const tzs = (n) => "TZS " + new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
}).format(n);
const PERIODS = ["Today", "Yesterday", "This Week", "This Month", "This Year", "Last Year"];
const kpiSets = {
  "Today": {
    revenue: 284350,
    revenueDelta: 12.4,
    expenditures: 48200,
    expendituresDelta: 3.1,
    grossProfit: 236150,
    grossProfitDelta: 18.2,
    collection: 19e4,
    collectionInvoices: 42,
    purchases: 32e3,
    purchaseOrders: 8
  },
  "Yesterday": {
    revenue: 251200,
    revenueDelta: 4.8,
    expenditures: 51400,
    expendituresDelta: 6.2,
    grossProfit: 199800,
    grossProfitDelta: 9.1,
    collection: 174e3,
    collectionInvoices: 37,
    purchases: 41e3,
    purchaseOrders: 11
  },
  "This Week": {
    revenue: 1480500,
    revenueDelta: 7.6,
    expenditures: 312400,
    expendituresDelta: 2.4,
    grossProfit: 1168100,
    grossProfitDelta: 10.3,
    collection: 1102e3,
    collectionInvoices: 218,
    purchases: 184e3,
    purchaseOrders: 46
  },
  "This Month": {
    revenue: 6240800,
    revenueDelta: 14.2,
    expenditures: 1280400,
    expendituresDelta: 5.1,
    grossProfit: 4960400,
    grossProfitDelta: 16.7,
    collection: 482e4,
    collectionInvoices: 812,
    purchases: 74e4,
    purchaseOrders: 132
  },
  "This Year": {
    revenue: 72340500,
    revenueDelta: 22.8,
    expenditures: 15820400,
    expendituresDelta: 8.4,
    grossProfit: 56520100,
    grossProfitDelta: 28.1,
    collection: 582e5,
    collectionInvoices: 9420,
    purchases: 892e4,
    purchaseOrders: 1480
  },
  "Last Year": {
    revenue: 58920400,
    revenueDelta: -3.4,
    expenditures: 14210800,
    expendituresDelta: -1.2,
    grossProfit: 44709600,
    grossProfitDelta: -4.8,
    collection: 471e5,
    collectionInvoices: 8120,
    purchases: 761e4,
    purchaseOrders: 1320
  }
};
function Dashboard() {
  const [period, setPeriod] = reactExports.useState("Today");
  const k = kpiSets[period];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Good morning, Aisha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Here's what's happening across your business today." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex flex-wrap items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm backdrop-blur", children: PERIODS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPeriod(p), className: cn("rounded-full px-3 py-1.5 text-xs font-medium transition", period === p ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"), children: p }, p)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Revenue", value: tzs(k.revenue), delta: k.revenueDelta, icon: Wallet, positiveIsGood: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Expenditures", value: tzs(k.expenditures), delta: k.expendituresDelta, icon: Receipt, positiveIsGood: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Gross Profit", value: tzs(k.grossProfit), delta: k.grossProfitDelta, icon: TrendingUp, positiveIsGood: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Collection", value: tzs(k.collection), subtitle: `${k.collectionInvoices} invoices`, icon: HandCoins }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { label: "Purchases", value: tzs(k.purchases), subtitle: `${k.purchaseOrders} orders`, icon: ShoppingCart })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Sales Trend", subtitle: "Revenue across the last 6 months" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 280, option: {
          legend: {
            show: false
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            left: 52,
            right: 16,
            top: 8,
            bottom: 28
          },
          xAxis: {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            axisLine: {
              lineStyle: {
                color: "#cbd5e1"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              fontSize: 12,
              color: "#64748b"
            }
          },
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                color: "#f1f5f9",
                type: "dashed"
              }
            },
            axisLabel: {
              formatter: (v) => (v / 1e6).toFixed(1) + "M",
              fontSize: 11,
              color: "#94a3b8"
            }
          },
          series: [{
            name: "Revenue",
            type: "bar",
            data: [{
              value: 42e5,
              itemStyle: {
                color: "#bfdbfe"
              }
            }, {
              value: 485e4,
              itemStyle: {
                color: "#bfdbfe"
              }
            }, {
              value: 512e4,
              itemStyle: {
                color: "#bfdbfe"
              }
            }, {
              value: 49e5,
              itemStyle: {
                color: "#bfdbfe"
              }
            }, {
              value: 587e4,
              itemStyle: {
                color: "#bfdbfe"
              }
            }, {
              value: 624e4,
              itemStyle: {
                color: "#2563eb"
              }
            }],
            barWidth: 28,
            itemStyle: {
              borderRadius: [6, 6, 0, 0]
            }
          }]
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-center gap-5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "#bfdbfe", label: "Previous months" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "#2563eb", label: "Current month" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 lg:col-span-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Debtors & Creditors" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/stakeholders/customers", icon: Users, label: "Debtors (12)", right: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: tzs(42e5) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/stakeholders/suppliers", icon: Users, label: "Creditors (5)", right: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: tzs(18e5) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/sales/invoices", icon: Clock4, label: "Due Invoices", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "7" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/sales/invoices", icon: TriangleAlert, label: "Overdue Invoices", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "red", children: "3" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Approvals Needed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/finance/payment-vouchers", icon: Coins, label: "Payments", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/finance/payment-vouchers", icon: Banknote, label: "Issue Cash / Cheque", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "red", children: "2" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/products/purchase-orders", icon: FileText, label: "Purchase Orders", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "blue", children: "3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/hr/payroll", icon: FileCheckCorner, label: "Payroll", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "green", children: "1" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/hr/leave", icon: Calendar, label: "Leave Requests", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "5" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Bank & Cash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/finance/bank-cash", icon: Coins, label: "Cash Account", right: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: tzs(32e4) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/finance/bank-cash", icon: Landmark, label: "NMB Mbezi Luis", sublabel: "Acct 4012 9981 23", right: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: tzs(12e5) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-4 h-px bg-slate-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Stock Alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/store/stock", icon: PackageX, label: "Low Stock (under 5)", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "12" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/store/stock", icon: PackageCheck, label: "Stock To Be Received", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "blue", children: "4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/store/stock", icon: FileExclamationPoint, label: "Near Expiry", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "red", children: "2" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Top 5 Products Today" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-4", children: [{
          name: "Product A",
          value: 48e3
        }, {
          name: "Product B",
          value: 36e3
        }, {
          name: "Product C",
          value: 24e3
        }, {
          name: "Product D",
          value: 18e3
        }, {
          name: "Product E",
          value: 12e3
        }].map((p, i, arr) => {
          const max = arr[0].value;
          const pct = Math.round(p.value / max * 100);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: tzs(p.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full overflow-hidden rounded-full bg-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-linear-to-r from-blue-500 to-emerald-500", style: {
              width: `${pct}%`
            } }) })
          ] }, p.name);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "Recent Invoices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-100", children: [{
          name: "Acme Trading Ltd",
          status: "Paid"
        }, {
          name: "Skyline Holdings",
          status: "Pending"
        }, {
          name: "Bluepeak Industries",
          status: "Overdue"
        }, {
          name: "Greenfield Co.",
          status: "Partial"
        }, {
          name: "Harbor Logistics",
          status: "Draft"
        }].map((inv) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/sales/invoices", className: "flex cursor-pointer items-center justify-between px-1 py-2.5 transition hover:bg-slate-50/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm text-foreground", children: inv.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceStatusPill, { status: inv.status })
        ] }, inv.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-4 h-px bg-slate-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { title: "HR Snapshot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/hr/leave", icon: Calendar, label: "Leave For Approval", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "amber", children: "3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { to: "/products/expenses", icon: CircleCheck, label: "Imprest To Be Returned", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "red", children: "2" }) })
        ] })
      ] })
    ] })
  ] });
}
function Card({
  className,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("glass-card px-4 py-4", className), children });
}
function CardHeader({
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: title }),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: subtitle })
  ] });
}
function Legend({
  color,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-sm", style: {
      background: color
    } }),
    label
  ] });
}
const toneMap = {
  red: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-100 text-slate-600"
};
function Badge({
  tone = "slate",
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold", toneMap[tone]), children });
}
const invoicePillTone = {
  Paid: "green",
  Pending: "amber",
  Overdue: "red",
  Partial: "amber",
  Draft: "slate"
};
function InvoiceStatusPill({
  status
}) {
  const tone = invoicePillTone[status] ?? "slate";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", toneMap[tone]), children: status });
}
function Row({
  to,
  icon: Icon,
  label,
  sublabel,
  right
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex cursor-pointer items-center justify-between gap-3 px-1 py-2.5 transition hover:bg-slate-50/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex min-w-0 items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-slate-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-sm text-foreground", children: label }),
        sublabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-[11px] text-muted-foreground", children: sublabel })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0", children: right })
  ] });
}
function KpiCard({
  label,
  value,
  delta,
  subtitle,
  icon: Icon,
  positiveIsGood = true
}) {
  const up = (delta ?? 0) >= 0;
  const good = positiveIsGood ? up : !up;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card px-5 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0 text-slate-400" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2.5 text-xl font-bold tracking-tight text-foreground", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs", children: delta !== void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-0.5 font-medium", good ? "text-emerald-600" : "text-rose-600"), children: [
      up ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3 w-3" }),
      up ? "+" : "",
      delta,
      "%",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 font-normal text-muted-foreground", children: "vs last period" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: subtitle }) })
  ] });
}
export {
  Dashboard as component
};
