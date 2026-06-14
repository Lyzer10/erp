import { lazy, Suspense, useMemo } from "react";
import type { EChartsOption } from "echarts";

// Dynamic import so the ~800 KB ECharts bundle is NOT in the initial JS chunk.
// It only fetches after the page first paints, eliminating the load-time lag.
const ReactECharts = lazy(() => import("echarts-for-react"));

const palette = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#06b6d4", "#ef4444"];

interface Props {
  option: EChartsOption;
  height?: number | string;
  className?: string;
}

function ChartSkeleton({ height }: { height: number | string }) {
  return (
    <div
      style={{ height, width: "100%" }}
      className="animate-pulse rounded-xl bg-slate-100"
    />
  );
}

export function EChart({ option, height = 280, className }: Props) {
  const merged = useMemo<EChartsOption>(
    () => ({
      color: palette,
      textStyle: { fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif", color: "#475569" },
      grid: { left: 40, right: 20, top: 30, bottom: 30, containLabel: true },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "rgba(203,213,225,0.6)",
        borderWidth: 1,
        textStyle: { color: "#1e293b" },
        extraCssText: "backdrop-filter: blur(12px); border-radius: 12px; box-shadow: 0 8px 24px rgba(31,38,135,0.12);",
      },
      legend: { textStyle: { color: "#64748b" }, top: 0 },
      ...option,
    }),
    [option],
  );

  return (
    <Suspense fallback={<ChartSkeleton height={height} />}>
      <ReactECharts
        option={merged}
        style={{ height, width: "100%" }}
        className={className}
        opts={{ renderer: "svg" }}
      />
    </Suspense>
  );
}

export const chartPalette = palette;
