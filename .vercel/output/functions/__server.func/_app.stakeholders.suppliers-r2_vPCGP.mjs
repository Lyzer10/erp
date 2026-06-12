import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { P as PageHeader } from "./_ssr/PageHeader-X3FAIgGk.mjs";
import { T as TabbedPage } from "./_ssr/TabbedPage-DtxV7PSk.mjs";
import { S as StatusPill } from "./_ssr/StatusPill-czaQIIwM.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./_ssr/alert-dialog-DsuHXNs6.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./_ssr/dialog-B5irAUYM.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./_ssr/dropdown-menu-C3foCxkR.mjs";
import { I as ImportCard } from "./_ssr/router-pjJte3PV.mjs";
import { h as Plus, g as ChevronDown, z as FileSpreadsheet, F as FileText, G as Search, I as Inbox, a as Eye, J as Pencil, K as Trash2 } from "./_libs/lucide-react.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/isbot.mjs";
const tzs = (n) => "TZS " + new Intl.NumberFormat("en-US").format(n);
const suppliersMock = [{
  id: 1,
  name: "Supplier A Co.",
  phone: "+255 712 100 001",
  tin: "200-300-401",
  vrn: "40-223456-S",
  email: "a@supplier.com",
  region: "Dar es Salaam",
  address: "Kariakoo",
  branch: "Head Office",
  balance: 35e5,
  status: "Active"
}, {
  id: 2,
  name: "Supplier B Holdings",
  phone: "+255 754 100 002",
  tin: "200-300-402",
  vrn: "40-223457-S",
  email: "b@supplier.com",
  region: "Arusha",
  address: "Sakina",
  branch: "Branch A",
  balance: 124e4,
  status: "Active"
}, {
  id: 3,
  name: "Supplier C Industries",
  phone: "+255 765 100 003",
  tin: "200-300-403",
  vrn: "—",
  email: "c@supplier.com",
  region: "Mwanza",
  address: "Ilemela",
  branch: "Branch B",
  balance: 78e4,
  status: "Inactive"
}, {
  id: 4,
  name: "Supplier D Co.",
  phone: "+255 713 100 004",
  tin: "200-300-404",
  vrn: "40-223458-S",
  email: "d@supplier.com",
  region: "Dodoma",
  address: "Area C",
  branch: "Head Office",
  balance: 21e4,
  status: "Active"
}, {
  id: 5,
  name: "Supplier E Logistics",
  phone: "+255 744 100 005",
  tin: "200-300-405",
  vrn: "—",
  email: "e@supplier.com",
  region: "Mbeya",
  address: "Industrial",
  branch: "Branch C",
  balance: 0,
  status: "Active"
}];
function SuppliersPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Suppliers", description: "Vendors, payables, and supplier directory.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExportMenu, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " New Supplier"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabbedPage, { tabs: [{
      key: "list",
      label: "Suppliers List",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(SuppliersList, {})
    }, {
      key: "import",
      label: "Import Suppliers",
      render: () => /* @__PURE__ */ jsxRuntimeExports.jsx(ImportCard, { title: "Import Suppliers", templateName: "SUPPLIERS TEMPLATE" })
    }] })
  ] });
}
function ExportMenu() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50", children: [
      "Export ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-slate-400" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-36", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }),
        " Excel"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-rose-600" }),
        " PDF"
      ] })
    ] })
  ] });
}
function SuppliersList() {
  const [q, setQ] = reactExports.useState("");
  const [perPage, setPerPage] = reactExports.useState(10);
  const [page, setPage] = reactExports.useState(1);
  const [toDelete, setToDelete] = reactExports.useState(null);
  const [viewing, setViewing] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    const lc = q.toLowerCase();
    if (!lc) return suppliersMock;
    return suppliersMock.filter((s) => Object.values(s).some((v) => String(v).toLowerCase().includes(lc)));
  }, [q]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const rows = filtered.slice(start, start + perPage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card overflow-hidden p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-end gap-3 border-b border-white/40 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        "Show",
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: perPage, onChange: (e) => {
          setPerPage(Number(e.target.value));
          setPage(1);
        }, className: "rounded-md border border-slate-200 bg-white px-2 py-1 text-xs", children: [10, 25, 50, 100].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n, children: n }, n)) }),
        "entries"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => {
          setQ(e.target.value);
          setPage(1);
        }, placeholder: "Search...", className: "w-56 rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-xs uppercase tracking-wide text-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["#", "Supplier Name", "Phone", "Email", "Region", "Balance", "Status", "Action"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `whitespace-nowrap px-3 py-3 font-medium ${h === "Balance" ? "text-right" : h === "Action" || h === "Status" ? "text-center" : "text-left"}`, children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 8, className: "px-3 py-12 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "mx-auto mb-2 h-8 w-8 opacity-40" }),
        " No data available"
      ] }) }) : rows.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-100 hover:bg-slate-50/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-slate-500", children: start + i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-3 py-3 font-medium text-foreground", children: s.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-3 py-3", children: s.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-3 py-3", children: s.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-3 py-3", children: s.region }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "whitespace-nowrap px-3 py-3 text-right font-semibold", children: tzs(s.balance) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: s.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "View", onClick: () => setViewing(s), className: "rounded-md p-1.5 text-blue-600 hover:bg-blue-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Edit", className: "rounded-md p-1.5 text-amber-600 hover:bg-amber-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Delete", onClick: () => setToDelete(s), className: "rounded-md p-1.5 text-rose-600 hover:bg-rose-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }) })
      ] }, s.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-white/40 px-4 py-3 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "Showing ",
        filtered.length === 0 ? 0 : start + 1,
        " to ",
        Math.min(start + perPage, filtered.length),
        " of ",
        filtered.length,
        " entries"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40", children: "Previous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-blue-600 px-3 py-1 font-semibold text-white", children: page }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages, className: "rounded-md border border-slate-200 bg-white px-3 py-1 font-medium disabled:opacity-40", children: "Next" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewing, onOpenChange: (o) => !o && setViewing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Supplier Details" }) }),
      viewing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-slate-500", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: viewing.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Name", value: viewing.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Phone", value: viewing.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Email", value: viewing.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Region", value: viewing.region }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Balance", value: tzs(viewing.balance) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 h-px bg-slate-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "TIN Number", value: viewing.tin }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "VRN", value: viewing.vrn }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Address", value: viewing.address }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Branch", value: viewing.branch })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!toDelete, onOpenChange: (o) => !o && setToDelete(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete supplier?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "This will permanently remove ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: toDelete?.name }),
          ". This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => setToDelete(null), className: "bg-rose-600 hover:bg-rose-700", children: "Delete" })
      ] })
    ] }) })
  ] });
}
function DetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-28 shrink-0 text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right text-sm font-medium text-foreground", children: value })
  ] });
}
export {
  SuppliersPage as component
};
