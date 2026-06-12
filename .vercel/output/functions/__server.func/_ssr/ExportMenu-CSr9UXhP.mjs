import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-C3foCxkR.mjs";
import { g as ChevronDown, z as FileSpreadsheet, F as FileText } from "../_libs/lucide-react.mjs";
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
export {
  ExportMenu as E
};
