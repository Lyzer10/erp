import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

interface Props {
  readonly label: string;
  readonly value: string;
  readonly delta?: number;
  readonly hint?: string;
  readonly icon?: LucideIcon;
  readonly tint?: "blue" | "emerald" | "amber" | "violet" | "cyan";
}

export function KpiCard({ label, value, delta, hint, icon: Icon }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="glass-card px-5 py-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
      </div>
      <p className="mt-2.5 text-xl font-bold tracking-tight text-foreground">{value}</p>
      {(delta !== undefined || hint) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 font-medium ${positive ? "text-emerald-600" : "text-rose-600"}`}>
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
