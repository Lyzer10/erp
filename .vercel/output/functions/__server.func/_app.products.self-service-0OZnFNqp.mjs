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
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Employee Self Service", description: "Request payments, leave, and view payslips.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "payments",
    label: "Request Payments",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 8
    }, (_, i) => ({
      id: `PR-${200 + i}`,
      requester: ["John", "Maria", "David", "Aisha"][i % 4],
      purpose: ["Travel", "Equipment", "Reimbursement", "Training"][i % 4],
      amount: 250 + i * 120,
      status: ["Pending", "Approved", "Rejected"][i % 3]
    })), columns: [{
      key: "id",
      header: "Request #"
    }, {
      key: "requester",
      header: "Requester"
    }, {
      key: "purpose",
      header: "Purpose"
    }, {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (r) => currency(r.amount)
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
    }] })
  }, {
    key: "leave",
    label: "Request Leave",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 8
    }, (_, i) => ({
      id: `LV-${300 + i}`,
      employee: ["John", "Maria", "David", "Aisha"][i % 4],
      type: ["Annual", "Sick", "Compassionate"][i % 3],
      days: 2 + i,
      status: ["Pending", "Approved", "Rejected"][i % 3]
    })), columns: [{
      key: "id",
      header: "Leave #"
    }, {
      key: "employee",
      header: "Employee"
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
  }, {
    key: "slip",
    label: "Salary Slips",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 8
    }, (_, i) => ({
      id: `SL-${400 + i}`,
      period: "May 2026",
      employee: ["John", "Maria", "David", "Aisha"][i % 4],
      gross: 1800 + i * 120,
      net: 1500 + i * 100
    })), columns: [{
      key: "id",
      header: "Slip #"
    }, {
      key: "employee",
      header: "Employee"
    }, {
      key: "period",
      header: "Period"
    }, {
      key: "gross",
      header: "Gross",
      align: "right",
      render: (r) => currency(r.gross)
    }, {
      key: "net",
      header: "Net",
      align: "right",
      render: (r) => currency(r.net)
    }] })
  }] })
] });
export {
  SplitComponent as component
};
