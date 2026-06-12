import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { c as currency, s as staff } from "./_ssr/mock-CXuNXaWS.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Salary", description: "Salary ranges and individual payslips.", actions: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "range",
    label: "Salary Ranges",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: [{
      grade: "A1",
      role: "Senior Manager",
      min: 5500,
      max: 8500
    }, {
      grade: "A2",
      role: "Manager",
      min: 3800,
      max: 5500
    }, {
      grade: "B1",
      role: "Senior Officer",
      min: 2500,
      max: 3800
    }, {
      grade: "B2",
      role: "Officer",
      min: 1500,
      max: 2500
    }, {
      grade: "C1",
      role: "Assistant",
      min: 900,
      max: 1500
    }], columns: [{
      key: "grade",
      header: "Grade"
    }, {
      key: "role",
      header: "Role Level"
    }, {
      key: "min",
      header: "Min",
      align: "right",
      render: (r) => currency(r.min)
    }, {
      key: "max",
      header: "Max",
      align: "right",
      render: (r) => currency(r.max)
    }] })
  }, {
    key: "slips",
    label: "Salary Slips",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: staff.slice(0, 15).map((s) => ({
      id: `SL-${900 + parseInt(s.id.slice(-2))}`,
      employee: s.name,
      period: "May 2026",
      gross: s.salary,
      deductions: s.salary * 0.18,
      net: s.salary * 0.82
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
      key: "deductions",
      header: "Deductions",
      align: "right",
      render: (r) => currency(r.deductions)
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
