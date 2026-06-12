import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as EChart } from "./_ssr/EChart-VxhO2r3D.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { a as customers, i as invoices, c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
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
function CustomerStatementPage() {
  const [selected, setSelected] = reactExports.useState(customers[0].id);
  const customer = customers.find((c) => c.id === selected);
  const lines = invoices.slice(0, 8).map((i, k) => ({
    ...i,
    balance: 1200 + k * 400
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Customer Statement", description: "Account activity, aging, and balance by customer.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selected, onChange: (e) => setSelected(e.target.value), className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur", children: customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur", defaultValue: "2026-01-01" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur", defaultValue: "2026-06-11" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 text-lg font-semibold", children: [
          customer.name,
          " — Statement"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, pageSize: 20, data: lines, columns: [{
          key: "date",
          header: "Date"
        }, {
          key: "id",
          header: "Reference"
        }, {
          key: "type",
          header: "Type"
        }, {
          key: "amount",
          header: "Debit",
          align: "right",
          render: (r) => currency(r.amount)
        }, {
          key: "balance",
          header: "Balance",
          align: "right",
          render: (r) => currency(r.balance)
        }] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 text-lg font-semibold", children: "Aging Analysis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(EChart, { height: 260, option: {
          tooltip: {
            trigger: "item"
          },
          series: [{
            type: "pie",
            radius: ["50%", "78%"],
            padAngle: 3,
            itemStyle: {
              borderRadius: 8
            },
            data: [{
              value: 4200,
              name: "Current"
            }, {
              value: 1800,
              name: "1-30 days"
            }, {
              value: 900,
              name: "31-60 days"
            }, {
              value: 350,
              name: "60+ days"
            }]
          }]
        } })
      ] })
    ] })
  ] });
}
export {
  CustomerStatementPage as component
};
