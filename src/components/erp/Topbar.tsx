import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ScanLine, Menu, Plus, PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  readonly onMenuClick?: () => void;
  readonly onToggleSidebar?: () => void;
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function Topbar({ onMenuClick, onToggleSidebar }: Readonly<Props>) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const now = useNow();

  const dateLabel = now.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });
  const timeLabel = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="glass-topbar sticky top-0 z-30 flex h-16 items-center gap-2 px-3 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/50 hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={onToggleSidebar}
        className="hidden rounded-lg p-2 text-muted-foreground transition hover:bg-white/60 hover:text-foreground lg:inline-flex"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      {/* Quick actions */}
      <div className="hidden items-center gap-2 md:flex">
        <Link
          to="/sales/invoices/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" /> Invoice
        </Link>
        <Link
          to="/sales/invoices/proforma"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" /> Proforma
        </Link>
        <Link
          to="/products/purchase-orders"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" /> Purchase Order
        </Link>
        <Link
          to="/products/self-service"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" /> Payment Request
        </Link>
      </div>

      {/* Breadcrumb on small screens */}
      <span className="ml-2 truncate text-xs font-medium capitalize text-muted-foreground md:hidden">
        {pathname === "/" ? "Dashboard" : pathname.split("/").filter(Boolean).join(" / ").replaceAll("-", " ")}
      </span>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden flex-col items-end text-right leading-tight md:flex">
          <span className="text-xs font-semibold text-foreground">{dateLabel}</span>
          <span className="text-[11px] text-muted-foreground">{timeLabel}</span>
        </div>

        <Link
          to="/pos"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50"
        >
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">Open POS</span>
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        <button
          className="relative rounded-xl border border-white/60 bg-white/50 p-2 backdrop-blur-md transition hover:bg-white/70"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
          AO
        </div>
      </div>
    </header>
  );
}
