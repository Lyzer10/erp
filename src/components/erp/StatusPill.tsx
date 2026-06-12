import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";

const styles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20",
  Paid: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20",
  Approved: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20",
  Completed: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20",
  Pending: "bg-amber-500/15 text-amber-700 ring-amber-500/20",
  Prepared: "bg-blue-500/15 text-blue-700 ring-blue-500/20",
  Partial: "bg-blue-500/15 text-blue-700 ring-blue-500/20",
  Draft: "bg-slate-500/15 text-slate-700 ring-slate-500/20",
  "On Leave": "bg-violet-500/15 text-violet-700 ring-violet-500/20",
  "On Hold": "bg-amber-500/15 text-amber-700 ring-amber-500/20",
  Overdue: "bg-rose-500/15 text-rose-700 ring-rose-500/20",
  Rejected: "bg-rose-500/15 text-rose-700 ring-rose-500/20",
  Inactive: "bg-slate-500/15 text-slate-700 ring-slate-500/20",
};

const labels: Record<string, Record<string, string>> = {
  Active: { en: "Active", sw: "Hai" },
  Paid: { en: "Paid", sw: "Imelipwa" },
  Approved: { en: "Approved", sw: "Imeidhinishwa" },
  Completed: { en: "Completed", sw: "Imekamilika" },
  Pending: { en: "Pending", sw: "Inasubiri" },
  Prepared: { en: "Prepared", sw: "Imetayarishwa" },
  Partial: { en: "Partial", sw: "Kiasi" },
  Draft: { en: "Draft", sw: "Rasimu" },
  "On Leave": { en: "On Leave", sw: "Likizoni" },
  "On Hold": { en: "On Hold", sw: "Imesimamishwa" },
  Overdue: { en: "Overdue", sw: "Muda Umeisha" },
  Rejected: { en: "Rejected", sw: "Imekataliwa" },
  Inactive: { en: "Inactive", sw: "Siyo Hai" },
};

export function StatusPill({ status }: { status: string }) {
  const { lang } = useTranslate();
  const displayLabel = labels[status]?.[lang] ?? status;
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      styles[status] ?? "bg-slate-500/15 text-slate-700 ring-slate-500/20",
    )}>
      {displayLabel}
    </span>
  );
}
