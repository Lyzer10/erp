import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
import { Q as Check } from "./_libs/lucide-react.mjs";
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
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Bank Reconciliation", description: "Match bank statements with ledger transactions.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "prepare",
    label: "Prepare Reconciliation",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Bank Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "KCB - 1234567890" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Equity - 0998877665" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Statement Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Closing Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", className: "mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm", placeholder: "0.00" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { searchable: false, pageSize: 20, data: Array.from({
        length: 8
      }, (_, i) => ({
        date: `2026-06-${String(i + 1).padStart(2, "0")}`,
        ref: `TXN-${100 + i}`,
        desc: ["Deposit", "Withdrawal", "Cheque", "Transfer"][i % 4],
        amount: 500 + i * 220,
        matched: i % 2 === 0
      })), columns: [{
        key: "date",
        header: "Date"
      }, {
        key: "ref",
        header: "Reference"
      }, {
        key: "desc",
        header: "Description"
      }, {
        key: "amount",
        header: "Amount",
        align: "right",
        render: (r) => currency(r.amount)
      }, {
        key: "matched",
        header: "Match",
        render: (r) => r.matched ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-emerald-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
          " Matched"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-blue-600 hover:underline", children: "Match" })
      }] })
    ] })
  }, {
    key: "list",
    label: "Reconciliation List",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 8
    }, (_, i) => ({
      id: `REC-${800 + i}`,
      account: ["KCB", "Equity"][i % 2],
      period: `May 2026`,
      prepared: "Aisha Otieno",
      diff: i * 40,
      status: ["Completed", "Pending", "Approved"][i % 3]
    })), columns: [{
      key: "id",
      header: "Recon #"
    }, {
      key: "account",
      header: "Account"
    }, {
      key: "period",
      header: "Period"
    }, {
      key: "prepared",
      header: "Prepared By"
    }, {
      key: "diff",
      header: "Difference",
      align: "right",
      render: (r) => currency(r.diff)
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
