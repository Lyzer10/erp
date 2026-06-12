import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as EChart } from "./_ssr/EChart-VxhO2r3D.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/lucide-react.mjs";
import "./_ssr/dropdown-menu-C3foCxkR.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
const pnl = [{
  item: "Revenue",
  amount: 284350
}, {
  item: "Cost of Goods Sold",
  amount: -142180
}, {
  item: "Gross Profit",
  amount: 142170
}, {
  item: "Operating Expenses",
  amount: -68420
}, {
  item: "Operating Profit",
  amount: 73750
}, {
  item: "Tax",
  amount: -22125
}, {
  item: "Net Profit",
  amount: 51625
}];
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Financial Reports", description: "P&L, Cash Book, Trial Balance, Balance Sheet, and more.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "pnl",
    label: "Gross P&L",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, pageSize: 20, data: pnl, columns: [{
        key: "item",
        header: "Line"
      }, {
        key: "amount",
        header: "Amount",
        align: "right",
        render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: r.amount < 0 ? "text-rose-600" : "font-semibold", children: currency(r.amount) })
      }] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 300, option: {
        xAxis: {
          type: "category",
          data: ["Revenue", "COGS", "Gross", "OpEx", "Operating", "Tax", "Net"]
        },
        yAxis: {
          type: "value"
        },
        series: [{
          type: "bar",
          data: pnl.map((p) => Math.abs(p.amount)),
          itemStyle: {
            borderRadius: [6, 6, 0, 0]
          },
          barWidth: 24
        }]
      } }) })
    ] })
  }, {
    key: "cash",
    label: "Cash Book",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 12
    }, (_, i) => ({
      date: `2026-06-${String(i + 1).padStart(2, "0")}`,
      desc: ["Sale", "Purchase", "Payroll", "Transfer", "Expense"][i % 5],
      dr: i % 2 ? 0 : 1200 + i * 80,
      cr: i % 2 ? 900 + i * 70 : 0,
      bal: 5e3 + i * 120
    })), columns: [{
      key: "date",
      header: "Date"
    }, {
      key: "desc",
      header: "Description"
    }, {
      key: "dr",
      header: "DR",
      align: "right",
      render: (r) => r.dr ? currency(r.dr) : "—"
    }, {
      key: "cr",
      header: "CR",
      align: "right",
      render: (r) => r.cr ? currency(r.cr) : "—"
    }, {
      key: "bal",
      header: "Balance",
      align: "right",
      render: (r) => currency(r.bal)
    }] })
  }, {
    key: "income",
    label: "Income Statement",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, data: pnl, columns: [{
      key: "item",
      header: "Item"
    }, {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => currency(r.amount)
    }] })
  }, {
    key: "trial",
    label: "Trial Balance",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: ["Cash", "Bank", "Sales", "Receivables", "Payables", "Expenses", "Salaries", "Inventory"].map((a, i) => ({
      account: a,
      dr: i % 2 ? 0 : 5e3 + i * 800,
      cr: i % 2 ? 4e3 + i * 700 : 0
    })), columns: [{
      key: "account",
      header: "Account"
    }, {
      key: "dr",
      header: "Debit",
      align: "right",
      render: (r) => r.dr ? currency(r.dr) : "—"
    }, {
      key: "cr",
      header: "Credit",
      align: "right",
      render: (r) => r.cr ? currency(r.cr) : "—"
    }] })
  }, {
    key: "bs",
    label: "Balance Sheet",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 font-semibold", children: "Assets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, pageSize: 20, data: [{
          a: "Cash",
          v: 24500
        }, {
          a: "Bank",
          v: 86300
        }, {
          a: "Receivables",
          v: 42100
        }, {
          a: "Inventory",
          v: 96400
        }, {
          a: "Equipment",
          v: 38200
        }], columns: [{
          key: "a",
          header: "Item"
        }, {
          key: "v",
          header: "Amount",
          align: "right",
          render: (r) => currency(r.v)
        }] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 font-semibold", children: "Liabilities & Equity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, pageSize: 20, data: [{
          a: "Payables",
          v: 32600
        }, {
          a: "Loans",
          v: 48e3
        }, {
          a: "Equity",
          v: 124700
        }, {
          a: "Retained Earnings",
          v: 82200
        }], columns: [{
          key: "a",
          header: "Item"
        }, {
          key: "v",
          header: "Amount",
          align: "right",
          render: (r) => currency(r.v)
        }] })
      ] })
    ] })
  }, {
    key: "vendor",
    label: "Vendor Reports",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 10
    }, (_, i) => ({
      id: `V-${i + 1}`,
      name: `Vendor ${i + 1}`,
      bills: 4 + i,
      paid: 1200 + i * 400,
      due: 600 + i * 150
    })), columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "name",
      header: "Vendor"
    }, {
      key: "bills",
      header: "Bills",
      align: "right"
    }, {
      key: "paid",
      header: "Paid",
      align: "right",
      render: (r) => currency(r.paid)
    }, {
      key: "due",
      header: "Due",
      align: "right",
      render: (r) => currency(r.due)
    }] })
  }, {
    key: "payments",
    label: "Payments",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 12
    }, (_, i) => ({
      id: `PMT-${500 + i}`,
      ref: `INV-${5e3 + i}`,
      date: `2026-06-${String(i + 1).padStart(2, "0")}`,
      method: ["Cash", "Bank", "Mobile"][i % 3],
      amount: 800 + i * 120
    })), columns: [{
      key: "id",
      header: "Payment #"
    }, {
      key: "ref",
      header: "Ref"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "method",
      header: "Method"
    }, {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => currency(r.amount)
    }] })
  }, {
    key: "stock",
    label: "Stock Valuation",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 320, option: {
      xAxis: {
        type: "category",
        data: ["Beverages", "Groceries", "Electronics", "Stationery", "Household"]
      },
      yAxis: {
        type: "value"
      },
      series: [{
        type: "bar",
        data: [42e3, 28e3, 51e3, 12e3, 19e3],
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: "#10b981"
        },
        barWidth: 32
      }]
    } }) })
  }] })
] });
export {
  SplitComponent as component
};
