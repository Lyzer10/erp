import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { E as EChart } from "./_ssr/EChart-VxhO2r3D.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency, p as products } from "./_ssr/mock-CXuNXaWS.mjs";
import { N as ArrowLeftRight } from "./_libs/lucide-react.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
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
const transfers = Array.from({
  length: 14
}, (_, i) => ({
  id: `IBT-${3e3 + i}`,
  from: ["Main", "Westlands", "Mombasa Rd"][i % 3],
  to: ["Westlands", "Mombasa Rd", "Main"][i % 3],
  items: 3 + i % 6,
  value: Math.round(Math.random() * 12e3 + 500),
  date: new Date(Date.now() - i * 864e5 * 2).toISOString().slice(0, 10),
  status: ["Pending", "Approved", "Completed"][i % 3]
}));
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Inter-Branch Operations", description: "Transfer stock between branches and track receipts.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-4 w-4" }),
      "New Transfer"
    ] })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "transfer",
    label: "Create Transfer",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "From Branch" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Main Branch" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Westlands" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "To Branch" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Westlands" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Mombasa Rd" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 mb-2 text-sm font-semibold", children: "Items" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, data: products.slice(0, 4).map((p) => ({
        ...p,
        qty: 10
      })), columns: [{
        key: "name",
        header: "Product"
      }, {
        key: "sku",
        header: "SKU"
      }, {
        key: "qty",
        header: "Qty",
        align: "right"
      }, {
        key: "price",
        header: "Value",
        align: "right",
        render: (r) => currency(r.price * r.qty)
      }] })
    ] })
  }, {
    key: "list",
    label: "Transfers List",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: transfers, columns: [{
      key: "id",
      header: "Transfer #"
    }, {
      key: "from",
      header: "From"
    }, {
      key: "to",
      header: "To"
    }, {
      key: "items",
      header: "Items",
      align: "right"
    }, {
      key: "value",
      header: "Value",
      align: "right",
      render: (r) => currency(r.value)
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
    }] })
  }, {
    key: "report",
    label: "Report",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 320, option: {
      legend: {
        data: ["Outgoing", "Incoming"]
      },
      xAxis: {
        type: "category",
        data: ["Main", "Westlands", "Mombasa Rd", "Kisumu"]
      },
      yAxis: {
        type: "value"
      },
      series: [{
        name: "Outgoing",
        type: "bar",
        data: [12, 8, 14, 6],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 22
      }, {
        name: "Incoming",
        type: "bar",
        data: [9, 11, 7, 10],
        itemStyle: {
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: 22
      }]
    } }) })
  }, {
    key: "receive",
    label: "Receive Stock",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: transfers.filter((t) => t.status === "Pending"), columns: [{
      key: "id",
      header: "Transfer #"
    }, {
      key: "from",
      header: "From"
    }, {
      key: "items",
      header: "Items",
      align: "right"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
    }] })
  }] })
] });
export {
  SplitComponent as component
};
