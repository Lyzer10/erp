import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, PanelLeft, ScanLine } from "lucide-react";
import { logoutUserFn } from "@/lib/api/auth";
import { setLanguage, useTranslate } from "@/lib/i18n";

export type ShellUser = {
  id: string | number;
  username: string;
  email: string;
  role: string;
  isTestUser: boolean;
};

export function Topbar({
  onMenuClick,
  onToggleSidebar,
  user,
}: {
  readonly onMenuClick?: () => void;
  readonly onToggleSidebar?: () => void;
  readonly user: ShellUser;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { lang, t } = useTranslate();
  const initials = user.username.slice(0, 2).toUpperCase();

  async function logout() {
    await logoutUserFn();
    await navigate({ to: "/login" });
  }

  const breadcrumb =
    pathname === "/"
      ? "Dashboard"
      : pathname
          .split("/")
          .filter(Boolean)
          .map((part) => part.replaceAll("-", " "))
          .join(" / ");

  return (
    <header className="glass-topbar sticky top-0 z-30 flex h-16 items-center gap-2 px-3 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onToggleSidebar}
        className="hidden rounded-lg p-2 text-muted-foreground transition hover:bg-slate-100 hover:text-foreground lg:inline-flex"
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </button>

      <span className="truncate text-xs font-medium capitalize text-muted-foreground sm:text-sm">
        {breadcrumb}
      </span>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          title={lang === "en" ? "Change to Kiswahili" : "Badili kwenda Kiingereza"}
        >
          <span aria-hidden="true">{lang === "en" ? "🇬🇧" : "🇹🇿"}</span>
          {lang === "en" ? "EN" : "SW"}
        </button>
        <Link
          to="/pos"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#177d6d]"
        >
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">{t("openPos")}</span>
        </Link>
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 transition hover:bg-slate-50"
            title={`${user.username} · ${user.email}`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-900">
              {initials}
            </span>
            <span className="hidden max-w-28 truncate text-xs font-medium text-slate-700 sm:block">
              {user.username}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
          <div className="invisible absolute right-0 top-full z-40 mt-2 w-64 translate-y-1 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="truncate text-sm font-semibold text-slate-900">{user.username}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
              <p className="mt-1 text-[11px] font-medium text-[#177d6d]">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
