import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency, t as transactions } from "./_ssr/mock-CXuNXaWS.mjs";
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
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Ledgers", description: "Journal entries, general ledger, and ledger registration.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "record",
    label: "Record DR/CR",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: transactions.slice(0, 12), columns: [{
      key: "date",
      header: "Date"
    }, {
      key: "id",
      header: "Ref"
    }, {
      key: "account",
      header: "Account"
    }, {
      key: "description",
      header: "Description"
    }, {
      key: "debit",
      header: "Debit",
      align: "right",
      render: (r) => r.debit ? currency(r.debit) : "—"
    }, {
      key: "credit",
      header: "Credit",
      align: "right",
      render: (r) => r.credit ? currency(r.credit) : "—"
    }] })
  }, {
    key: "journal",
    label: "Journal Entries",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: transactions.slice(0, 15), columns: [{
      key: "id",
      header: "Journal #"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "account",
      header: "Account"
    }, {
      key: "description",
      header: "Memo"
    }, {
      key: "debit",
      header: "DR",
      align: "right",
      render: (r) => r.debit ? currency(r.debit) : "—"
    }, {
      key: "credit",
      header: "CR",
      align: "right",
      render: (r) => r.credit ? currency(r.credit) : "—"
    }] })
  }, {
    key: "general",
    label: "General Ledger",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: transactions, columns: [{
      key: "date",
      header: "Date"
    }, {
      key: "account",
      header: "Account"
    }, {
      key: "description",
      header: "Description"
    }, {
      key: "debit",
      header: "DR",
      align: "right",
      render: (r) => r.debit ? currency(r.debit) : "—"
    }, {
      key: "credit",
      header: "CR",
      align: "right",
      render: (r) => r.credit ? currency(r.credit) : "—"
    }] })
  }, {
    key: "register",
    label: "Register Ledger",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: ["Sales", "Purchases", "Salaries", "Rent", "Utilities"].map((l, i) => ({
      code: `L-${100 + i}`,
      name: l,
      type: i < 2 ? "Income/Expense" : "Expense",
      active: true
    })), columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Ledger"
    }, {
      key: "type",
      header: "Type"
    }, {
      key: "active",
      header: "Status",
      render: (r) => r.active ? "Active" : "Inactive"
    }] })
  }] })
] });
export {
  SplitComponent as component
};
