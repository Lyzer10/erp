import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
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
const make = (prefix, n = 10) => Array.from({
  length: n
}, (_, i) => ({
  id: `${prefix}-${1e3 + i}`,
  from: ["Main", "Westlands", "Mombasa"][i % 3],
  to: ["Westlands", "Mombasa", "Main"][i % 3],
  items: 3 + i % 6,
  value: 500 + i * 420,
  date: `2026-06-${String(i % 28 + 1).padStart(2, "0")}`,
  status: ["Pending", "Completed", "Approved"][i % 3]
}));
const SplitComponent = () => {
  const cols = [{
    key: "id",
    header: "Ref"
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
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Store Transfers", description: "Transfers between branches, stores, and receipts.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
      key: "ib",
      label: "Inter Branch",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: make("IBT"), columns: cols })
    }, {
      key: "is",
      label: "Inter Store",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: make("IST"), columns: cols })
    }, {
      key: "received",
      label: "Received Purchases",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: make("RCV").map((r) => ({
        ...r,
        from: "Supplier"
      })), columns: cols })
    }, {
      key: "issued",
      label: "Issued",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: make("ISS"), columns: cols })
    }] })
  ] });
};
export {
  SplitComponent as component
};
