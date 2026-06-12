import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Leave Management", description: "Leave requests, types, and on-behalf submissions.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "requests",
    label: "Leave Requests",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 12
    }, (_, i) => ({
      id: `LV-${500 + i}`,
      employee: ["John", "Maria", "David", "Aisha", "Peter"][i % 5],
      type: ["Annual", "Sick", "Compassionate", "Maternity"][i % 4],
      from: `2026-06-${String(i + 1).padStart(2, "0")}`,
      days: 2 + i % 5,
      status: ["Pending", "Approved", "Rejected"][i % 3]
    })), columns: [{
      key: "id",
      header: "Request #"
    }, {
      key: "employee",
      header: "Employee"
    }, {
      key: "type",
      header: "Type"
    }, {
      key: "from",
      header: "From"
    }, {
      key: "days",
      header: "Days",
      align: "right"
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
    }] })
  }, {
    key: "types",
    label: "Leave Types",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      code: "AL",
      name: "Annual Leave",
      days: 21
    }, {
      code: "SL",
      name: "Sick Leave",
      days: 14
    }, {
      code: "ML",
      name: "Maternity Leave",
      days: 90
    }, {
      code: "PL",
      name: "Paternity Leave",
      days: 14
    }, {
      code: "CL",
      name: "Compassionate Leave",
      days: 7
    }], columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Type"
    }, {
      key: "days",
      header: "Days/Year",
      align: "right"
    }] })
  }, {
    key: "behalf",
    label: "On Behalf Requests",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 6
    }, (_, i) => ({
      id: `OBL-${600 + i}`,
      requester: "Aisha Otieno",
      employee: ["John", "Maria", "David"][i % 3],
      type: "Sick",
      days: 1 + i,
      status: ["Approved", "Pending"][i % 2]
    })), columns: [{
      key: "id",
      header: "Request #"
    }, {
      key: "requester",
      header: "Filed By"
    }, {
      key: "employee",
      header: "For"
    }, {
      key: "type",
      header: "Type"
    }, {
      key: "days",
      header: "Days",
      align: "right"
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
