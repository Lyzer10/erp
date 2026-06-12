import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function PageHeader({ title, description, actions }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: description })
    ] }),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })
  ] });
}
export {
  PageHeader as P
};
