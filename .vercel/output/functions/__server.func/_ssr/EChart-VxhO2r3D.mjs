import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
const ReactECharts = reactExports.lazy(() => import("../_libs/echarts-for-react.mjs"));
const palette = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#06b6d4", "#ef4444"];
function ChartSkeleton({ height }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: { height, width: "100%" },
      className: "animate-pulse rounded-xl bg-slate-100"
    }
  );
}
function EChart({ option, height = 280, className }) {
  const merged = reactExports.useMemo(
    () => ({
      color: palette,
      textStyle: { fontFamily: "Plus Jakarta Sans, sans-serif", color: "#475569" },
      grid: { left: 40, right: 20, top: 30, bottom: 30, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "rgba(203,213,225,0.6)",
        borderWidth: 1,
        textStyle: { color: "#1e293b" },
        extraCssText: "backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 8px 24px rgba(31,38,135,0.12);"
      },
      legend: { textStyle: { color: "#64748b" }, top: 0 },
      ...option
    }),
    [option]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartSkeleton, { height }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ReactECharts,
    {
      option: merged,
      style: { height, width: "100%" },
      className,
      opts: { renderer: "svg" }
    }
  ) });
}
export {
  EChart as E
};
