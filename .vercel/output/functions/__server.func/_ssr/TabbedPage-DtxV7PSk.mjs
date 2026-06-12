import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
function TabbedPage({ tabs, defaultKey }) {
  const [active, setActive] = reactExports.useState(defaultKey ?? tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card flex flex-wrap items-center gap-1 p-1.5", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setActive(t.key),
        className: cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition",
          active === t.key ? "bg-linear-to-r from-blue-500 to-emerald-500 text-white shadow-md" : "text-foreground/70 hover:bg-white/50 hover:text-foreground"
        ),
        children: t.label
      },
      t.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: current.render() })
  ] });
}
export {
  TabbedPage as T
};
