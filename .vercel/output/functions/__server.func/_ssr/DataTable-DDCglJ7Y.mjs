import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { G as Search } from "../_libs/lucide-react.mjs";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
function toStr(v) {
  if (v === null || v === void 0) return "";
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") return "[Function]";
  return `${v}`;
}
function rowKey(row) {
  return Object.values(row).slice(0, 4).map(toStr).join("|");
}
function DataTable({
  data,
  columns,
  searchable = true,
  pageSize = 10,
  emptyMessage = "No records found."
}) {
  const [q, setQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const filtered = reactExports.useMemo(() => {
    if (!q) return data;
    const lc = q.toLowerCase();
    return data.filter(
      (r) => Object.values(r).some((v) => toStr(v).toLowerCase().includes(lc))
    );
  }, [data, q]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card overflow-hidden p-0", children: [
    searchable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xs flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: q,
            onChange: (e) => {
              setQ(e.target.value);
              setPage(1);
            },
            placeholder: "Search...",
            className: "h-8 bg-muted/50 pl-9 text-sm focus-visible:bg-card"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        filtered.length,
        " records"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: cn(
            "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
            c.align === "right" && "text-right",
            c.align === "center" && "text-center",
            c.className
          ),
          children: c.header
        },
        c.key
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pageRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: columns.length, className: "px-4 py-10 text-center text-sm text-muted-foreground", children: emptyMessage }) }) : pageRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "tr",
        {
          className: "border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30",
          children: columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: cn(
                "px-4 py-3",
                c.align === "right" && "text-right",
                c.align === "center" && "text-center",
                c.className
              ),
              children: c.render ? c.render(row) : toStr(row[c.key])
            },
            c.key
          ))
        },
        rowKey(row)
      )) })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        "Page ",
        page,
        " of ",
        totalPages,
        " — ",
        filtered.length,
        " records"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setPage((p) => Math.max(1, p - 1)),
            disabled: page === 1,
            className: "rounded-md border border-border bg-card px-3 py-1 text-xs font-medium transition hover:bg-muted disabled:opacity-40",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
            disabled: page === totalPages,
            className: "rounded-md border border-border bg-card px-3 py-1 text-xs font-medium transition hover:bg-muted disabled:opacity-40",
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
}
export {
  DataTable as D
};
