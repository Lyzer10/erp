import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { s as staff, c as currency } from "./_ssr/mock-CXuNXaWS.mjs";
import { h as Plus, U as Upload } from "./_libs/lucide-react.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Staff", description: "Employee directory, attendance, and bulk uploads.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      "Add Staff"
    ] })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "list",
    label: "Staff List",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: staff, columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "name",
      header: "Name"
    }, {
      key: "department",
      header: "Department"
    }, {
      key: "role",
      header: "Role"
    }, {
      key: "salary",
      header: "Salary",
      align: "right",
      render: (r) => currency(r.salary)
    }, {
      key: "joined",
      header: "Joined"
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
    }] })
  }, {
    key: "attendance",
    label: "Attendance",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: staff.slice(0, 12).map((s) => ({
      id: s.id,
      name: s.name,
      checkin: "08:12",
      checkout: "17:05",
      hours: 8.9,
      status: "Present"
    })), columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "name",
      header: "Employee"
    }, {
      key: "checkin",
      header: "Check-in"
    }, {
      key: "checkout",
      header: "Check-out"
    }, {
      key: "hours",
      header: "Hours",
      align: "right"
    }, {
      key: "status",
      header: "Status"
    }] })
  }, {
    key: "upload",
    label: "Upload Staff",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-dashed border-white/60 bg-white/30 p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mx-auto h-10 w-10 text-blue-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-base font-semibold", children: "Bulk upload staff records" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Drag a CSV or Excel file here, or click to browse." })
    ] }) })
  }] })
] });
export {
  SplitComponent as component
};
