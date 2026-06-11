import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Tab {
  key: string;
  label: string;
  render: () => ReactNode;
}

interface Props {
  readonly tabs: Tab[];
  readonly defaultKey?: string;
}

export function TabbedPage({ tabs, defaultKey }: Props) {
  const [active, setActive] = useState(defaultKey ?? tabs[0].key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="space-y-4">
      <div className="glass-card flex flex-wrap items-center gap-1 p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              active === t.key
                ? "bg-linear-to-r from-blue-500 to-emerald-500 text-white shadow-md"
                : "text-foreground/70 hover:bg-white/50 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{current.render()}</div>
    </div>
  );
}
