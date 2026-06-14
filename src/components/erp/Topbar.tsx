import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ScanLine, Menu, Plus, PanelLeft, LogOut, User, Settings, ChevronDown, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslate, setLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
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
  roleEn: "System Administrator",
  roleSw: "Msimamizi wa Mfumo",
  email: "aisha.otieno@devele.co",
  departmentEn: "IT",
  departmentSw: "TEHAMA",
  branchEn: "Head Office",
  branchSw: "Ofisi Kuu",
  joinedEn: "Jan 2024",
  joinedSw: "Januari 2024",
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
  const { lang, t } = useTranslate();
  const { theme, toggleTheme } = useTheme();

  const getDayName = (day: string) => {
    if (lang === "en") return day;
    const map: Record<string, string> = {
      Sun: "Jumapili",
      Mon: "Jumatatu",
      Tue: "Jumanne",
      Wed: "Jumatano",
      Thu: "Alhamisi",
      Fri: "Ijumaa",
      Sat: "Jumamosi",
    };
    return map[day] || day;
  };

  const getMonthName = (month: string) => {
    if (lang === "en") return month;
    const map: Record<string, string> = {
      Jan: "Jan",
      Feb: "Feb",
      Mar: "Mac",
      Apr: "Apr",
      May: "Mei",
      Jun: "Jun",
      Jul: "Jul",
      Aug: "Ago",
      Sep: "Sep",
      Oct: "Okt",
      Nov: "Nov",
      Dec: "Des",
    };
    return map[month] || month;
  };

  const formattedDate = now.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" });
  const [weekdayPart, monthPart, dayPart] = formattedDate.replace(",", "").split(" ");
  // weekdayPart = "Mon", monthPart = "Jun", dayPart = "15" or similar
  const dateLabel = lang === "en" 
    ? `${weekdayPart}, ${monthPart} ${dayPart}`
    : `${getDayName(weekdayPart)}, ${dayPart} ${getMonthName(monthPart)}`;

  const timeLabel = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  function handleLogout() {
    document.cookie = "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    try { localStorage.removeItem("is_logged_in"); } catch {}
    navigate({ to: "/login" });
  }

  const role = lang === "en" ? DUMMY_USER.roleEn : DUMMY_USER.roleSw;
  const branch = lang === "en" ? DUMMY_USER.branchEn : DUMMY_USER.branchSw;
  const dept = lang === "en" ? DUMMY_USER.departmentEn : DUMMY_USER.departmentSw;
  const joined = lang === "en" ? DUMMY_USER.joinedEn : DUMMY_USER.joinedSw;

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
          <Plus className="h-3.5 w-3.5" /> {t("invoice")}
        </Link>
        <Link
          to="/sales/invoices/proforma"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" /> {t("proforma")}
        </Link>
        <Link
          to="/products/purchase-orders"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" /> {t("purchaseOrder")}
        </Link>
        <Link
          to="/products/self-service"
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" /> {t("paymentRequest")}
        </Link>
      </div>

      {/* Quick actions dropdown for mobile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none"
              aria-label={lang === "en" ? "Quick Actions" : "Vitendo vya Haraka"}
            >
              <Plus className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-1">
            <DropdownMenuItem asChild className="rounded-lg">
              <Link to="/sales/invoices/new" className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> {t("invoice")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg">
              <Link to="/sales/invoices/proforma" className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> {t("proforma")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg">
              <Link to="/products/purchase-orders" className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> {t("purchaseOrder")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg">
              <Link to="/products/self-service" className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" /> {t("paymentRequest")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Breadcrumb on small screens */}
      <span className="ml-2 truncate text-xs font-medium capitalize text-muted-foreground md:hidden">
        {pathname === "/" ? t("dashboard") : pathname.split("/").filter(Boolean).join(" / ").replaceAll("-", " ")}
      </span>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden items-center text-right gap-2 md:flex">
          <span className="text-xs font-semibold text-foreground">{dateLabel}</span>
          <span className="text-[11px] text-muted-foreground">{timeLabel}</span>
        </div>

        {/* Flag language switcher button */}
        <button
          onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white/70 hover:border-slate-300"
          title={lang === "en" ? "Change to Kiswahili" : "Badili kwenda Kiingereza"}
        >
          <span className="text-base">{lang === "en" ? "🇬🇧" : "🇹🇿"}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{lang === "en" ? "EN" : "SW"}</span>
        </button>

        {/* Dark Mode toggle */}
        <button
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/60 bg-white/50 p-2 shadow-sm backdrop-blur-md transition hover:bg-white/70 hover:border-slate-300 dark:bg-slate-800/40 dark:border-slate-700 dark:hover:bg-slate-800/60"
          aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          title={theme === "light" ? (lang === "en" ? "Switch to Dark Mode" : "Badili kwenda Mandhari Meusi") : (lang === "en" ? "Switch to Light Mode" : "Badili kwenda Mandhari Mepesi")}
        >
          {theme === "light" ? <Moon className="h-4 w-4 text-slate-600" /> : <Sun className="h-4 w-4 text-amber-500" />}
        </button>

        <Link
          to="/pos"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600"
        >
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">{t("openPos")}</span>
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
              <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-900">
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
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-900 shadow-md">
                  {DUMMY_USER.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{DUMMY_USER.name}</p>
                  <p className="truncate text-xs text-slate-500">{DUMMY_USER.email}</p>
                </div>
              </div>
              <div className="mt-2 flex gap-3 text-[11px] text-slate-500">
                <span className="rounded-md bg-white/70 px-2 py-0.5 font-medium">{role}</span>
                <span className="rounded-md bg-white/70 px-2 py-0.5 font-medium">{branch}</span>
              </div>
            </div>

            <div className="p-1">
              <DropdownMenuItem
                className="gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium"
                onSelect={() => setProfileOpen(true)}
              >
                <User className="h-4 w-4 text-slate-400" /> {lang === "en" ? "View Profile" : "Angalia Wasifu"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium">
                <Link to="/admin/settings">
                  <Settings className="h-4 w-4 text-slate-400" /> {lang === "en" ? "Settings" : "Mipangilio"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer rounded-lg px-3 py-2 text-rose-600 focus:text-rose-600 text-sm font-semibold"
                onSelect={handleLogout}
              >
                <LogOut className="h-4 w-4" /> {lang === "en" ? "Log Out" : "Ondoka"}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile detail dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{lang === "en" ? "My Profile" : "Wasifu Wangu"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-900 shadow-lg">
                {DUMMY_USER.initials}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{DUMMY_USER.name}</p>
                <p className="text-sm text-slate-500 font-medium">{role}</p>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              {[
                { label: lang === "en" ? "Email" : "Barua Pepe",      value: DUMMY_USER.email },
                { label: lang === "en" ? "Department" : "Idara", value: dept },
                { label: lang === "en" ? "Branch" : "Tawi",     value: branch },
                { label: lang === "en" ? "Joined" : "Alijiunga",     value: joined },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-slate-700">{value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              {lang === "en" ? "Log Out" : "Ondoka"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
