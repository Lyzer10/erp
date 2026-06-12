import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { D as DataTable } from "./_ssr/DataTable-DDCglJ7Y.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { G as GlassCard } from "./_ssr/GlassCard-BC9QkRR6.mjs";
import { E as ExportMenu } from "./_ssr/ExportMenu-CSr9UXhP.mjs";
import { h as Plus, Z as KeyRound } from "./_libs/lucide-react.mjs";
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
  /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Users & Access", description: "Manage users, departments, and password resets.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      "Add User"
    ] })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
    key: "users",
    label: "Users List",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: Array.from({
      length: 12
    }, (_, i) => ({
      id: `U-${1e3 + i}`,
      name: ["Aisha Otieno", "John Mwangi", "Maria Banda", "David Kumar"][i % 4],
      email: `user${i}@devele.co`,
      role: ["Admin", "Manager", "Cashier", "Accountant"][i % 4],
      department: ["IT", "Sales", "Finance", "HR"][i % 4],
      status: ["Active", "Active", "Inactive"][i % 3]
    })), columns: [{
      key: "id",
      header: "ID"
    }, {
      key: "name",
      header: "Name"
    }, {
      key: "email",
      header: "Email"
    }, {
      key: "role",
      header: "Role"
    }, {
      key: "department",
      header: "Department"
    }, {
      key: "status",
      header: "Status",
      render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: r.status })
    }] })
  }, {
    key: "departments",
    label: "Departments",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { data: ["Sales", "Finance", "HR", "Operations", "IT", "Warehouse"].map((d, i) => ({
      code: `DPT-${10 + i}`,
      name: d,
      head: ["Aisha", "John", "Maria", "David", "Peter", "Grace"][i],
      members: 4 + i * 2
    })), columns: [{
      key: "code",
      header: "Code"
    }, {
      key: "name",
      header: "Department"
    }, {
      key: "head",
      header: "Head"
    }, {
      key: "members",
      header: "Members",
      align: "right"
    }] })
  }, {
    key: "reset",
    label: "Reset Password",
    render: () => /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-blue-500/20 to-emerald-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-6 w-6 text-blue-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-lg font-semibold", children: "Reset User Password" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Select a user and send them a temporary password." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Select user..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "John Mwangi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Maria Banda" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full rounded-lg bg-linear-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md", children: "Send Reset Link" })
      ] })
    ] })
  }] })
] });
export {
  SplitComponent as component
};
