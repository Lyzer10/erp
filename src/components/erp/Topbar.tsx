import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ScanLine, Menu, Plus, PanelLeft, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  readonly onMenuClick?: () => void;
  readonly onToggleSidebar?: () => void;
}

const DUMMY_USER = {
  name: "Aisha Otieno",
  initials: "AO",
  role: "System Administrator",
  email: "aisha.otieno@devele.co",
  department: "IT",
  branch: "Head Office",
  joined: "Jan 2024",
};

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
  const navigate = useNavigate();
  const now = useNow();
  const [profileOpen, setProfileOpen] = useState(false);

  const dateLabel = now.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });
  const timeLabel = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  function handleLogout() {
    document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    try { localStorage.removeItem("is_logged_in"); } catch {}
    navigate({ to: "/login" });
  }

  return (
    <header className="glass-topbar sticky top-0 z-30 flex h-16 items-center gap-2 px-3 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/50 hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
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
        <div className="hidden items-center text-right gap-2 md:flex">
          <span className="text-xs font-semibold text-foreground">{dateLabel}</span>
          <span className="text-[11px] text-muted-foreground">{timeLabel}</span>
        </div>

        <Link
          to="/pos"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
        >
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">Open POS</span>
        </Link>

        <button
          className="relative rounded-xl border border-white/60 bg-white/50 p-2 backdrop-blur-md transition hover:bg-white/70"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/50 pl-1 pr-2 py-1 backdrop-blur-md transition hover:bg-white/70 focus:outline-none">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                {DUMMY_USER.initials}
              </div>
              <span className="hidden text-xs font-medium text-slate-700 sm:block">{DUMMY_USER.name.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden">
            {/* Profile header */}
            <div className="bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-md">
                  {DUMMY_USER.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{DUMMY_USER.name}</p>
                  <p className="truncate text-xs text-slate-500">{DUMMY_USER.email}</p>
                </div>
              </div>
              <div className="mt-2 flex gap-3 text-[11px] text-slate-500">
                <span className="rounded-md bg-white/70 px-2 py-0.5 font-medium">{DUMMY_USER.role}</span>
                <span className="rounded-md bg-white/70 px-2 py-0.5 font-medium">{DUMMY_USER.branch}</span>
              </div>
            </div>

            <div className="p-1">
              <DropdownMenuItem
                className="gap-2 cursor-pointer rounded-lg px-3 py-2"
                onSelect={() => setProfileOpen(true)}
              >
                <User className="h-4 w-4 text-slate-400" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2 cursor-pointer rounded-lg px-3 py-2">
                <Link to="/admin/settings">
                  <Settings className="h-4 w-4 text-slate-400" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer rounded-lg px-3 py-2 text-rose-600 focus:text-rose-600"
                onSelect={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Log Out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile detail dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-500 text-xl font-bold text-white shadow-lg">
                {DUMMY_USER.initials}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{DUMMY_USER.name}</p>
                <p className="text-sm text-slate-500">{DUMMY_USER.role}</p>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              {[
                { label: "Email",      value: DUMMY_USER.email },
                { label: "Department", value: DUMMY_USER.department },
                { label: "Branch",     value: DUMMY_USER.branch },
                { label: "Joined",     value: DUMMY_USER.joined },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-700">{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              Log Out
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
