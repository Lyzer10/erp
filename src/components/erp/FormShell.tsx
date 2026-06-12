import type { ReactNode } from "react";
import { Info, Lightbulb, ShieldCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormShellProps {
  readonly header?: ReactNode;
  readonly children: ReactNode;
  readonly aside?: ReactNode;
}

/**
 * Two-column form layout: fluid main + fixed 320px right rail.
 * On screens < lg the rail stacks below.
 */
export function FormShell({ header, children, aside }: FormShellProps) {
  return (
    <div className="space-y-6">
      {header}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">{children}</div>
        {aside && <aside className="w-full shrink-0 space-y-4 lg:w-80">{aside}</aside>}
      </div>
    </div>
  );
}

/* ---------- Dark info cards used in the right rail ---------- */

interface DarkCardProps {
  readonly title: string;
  readonly icon?: LucideIcon;
  readonly tone?: "indigo" | "emerald" | "amber";
  readonly children: ReactNode;
}

const toneMap = {
  indigo:  "bg-slate-900",
  emerald: "bg-slate-900",
  amber:   "bg-slate-900",
};

const iconToneMap = {
  indigo:  "bg-indigo-500/15 text-indigo-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  amber:   "bg-amber-500/15 text-amber-300",
};

export function DarkCard({ title, icon: Icon = Info, tone = "indigo", children }: DarkCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-slate-100 shadow-md border border-slate-800",
        toneMap[tone],
      )}
    >
      <div className="relative flex items-center gap-2.5">
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", iconToneMap[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold tracking-tight text-white">{title}</h3>
      </div>
      <div className="relative mt-3 text-[13px] leading-relaxed text-slate-300">{children}</div>
    </div>
  );
}

interface InfoRailProps {
  readonly about: { title: string; description: string; bullets?: string[] };
  readonly tips: string[];
  readonly notice?: string;
}

/** Standard 3-card rail: About + Why this matters + Quick Tips. */
export function InfoRail({ about, tips, notice }: InfoRailProps) {
  return (
    <>
      <DarkCard title={about.title} icon={Info} tone="indigo">
        <p>{about.description}</p>
        {about.bullets && about.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {about.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                <span className="text-slate-300">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </DarkCard>

      <DarkCard title="Quick Tips" icon={Lightbulb} tone="amber">
        <ul className="space-y-1.5">
          {tips.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </DarkCard>

      {notice && (
        <DarkCard title="Notice" icon={ShieldCheck} tone="emerald">
          <p>{notice}</p>
        </DarkCard>
      )}
    </>
  );
}
