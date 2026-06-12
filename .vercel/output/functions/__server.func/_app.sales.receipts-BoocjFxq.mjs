import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency, i as invoices, a as customers } from "./_ssr/mock-CXuNXaWS.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Receipts & Delivery", description: "Customer receipts, delivery notes, and invoice merging.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "receipts",
    label: "Receipts",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: invoices.slice(0, 12).map((i, k) => ({
      id: `RCP-${4e3 + k}`,
      customer: i.customer,
      date: i.date,
      ref: i.id,
      amount: i.amount
    })), columns: [{
      key: "id",
      header: "Receipt #"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "ref",
      header: "Invoice Ref"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => currency(r.amount)
    }] })
  }, {
    key: "delivery",
    label: "Delivery Notes",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: customers.slice(0, 10).map((c, k) => ({
      id: `DN-${5e3 + k}`,
      customer: c.name,
      date: c.createdAt,
      items: 3 + k,
      status: "Delivered"
    })), columns: [{
      key: "id",
      header: "DN #"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "items",
      header: "Items",
      align: "right"
    }, {
      key: "status",
      header: "Status"
    }] })
  }, {
    key: "merge",
    label: "Merge Invoices",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: invoices.slice(0, 10), columns: [{
      key: "id",
      header: "Invoice #"
    }, {
      key: "customer",
      header: "Customer"
    }, {
      key: "date",
      header: "Date"
    }, {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => currency(r.amount)
    }] })
  }] })
] });
export {
  SplitComponent as component
};
