import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Search, ScanLine, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <header className="glass-topbar sticky top-0 z-30 flex h-16 items-center gap-3 px-4 lg:px-8">
      <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-white/50 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <nav className="hidden items-center gap-1.5 text-sm md:flex">
        <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium capitalize text-foreground">{c.replace(/-/g, " ")}</span>
          </span>
        ))}
      </nav>

      <div className="relative ml-auto hidden max-w-md flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search invoices, customers, products..."
          className="border-white/60 bg-white/60 pl-9 backdrop-blur-md" />
      </div>

      <Link to="/pos" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50">
        <ScanLine className="h-4 w-4" />
        <span className="hidden sm:inline">Open POS</span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </Link>

      <button className="relative rounded-xl border border-white/60 bg-white/50 p-2 backdrop-blur-md transition hover:bg-white/70">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
        AO
      </div>
    </header>
  );
}
