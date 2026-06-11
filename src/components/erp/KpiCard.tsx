import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

interface Props {
  readonly label: string;
  readonly value: string;
  readonly delta?: number;
  readonly hint?: string;
  readonly icon?: LucideIcon;
  readonly tint?: "blue" | "emerald" | "amber" | "violet" | "cyan";
}

const tintMap = {
  blue:    "from-blue-500/20 to-blue-400/5 text-blue-600",
  emerald: "from-emerald-500/20 to-emerald-400/5 text-emerald-600",
  amber:   "from-amber-500/20 to-amber-400/5 text-amber-600",
  violet:  "from-violet-500/20 to-violet-400/5 text-violet-600",
  cyan:    "from-cyan-500/20 to-cyan-400/5 text-cyan-600",
};

export function KpiCard({ label, value, delta, hint, icon: Icon, tint = "blue" }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {Icon && (
          <div className={cn("shrink-0 rounded-xl bg-linear-to-br p-2.5", tintMap[tint])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {(delta !== undefined || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta !== undefined && (
            <span className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
              positive ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700",
            )}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? "+" : ""}{delta}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}
