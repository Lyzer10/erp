import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, ScanLine } from "lucide-react";
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
  user,
}: {
  readonly onMenuClick?: () => void;
  readonly onToggleSidebar?: () => void;
  readonly user: ShellUser;
}) {
  const navigate = useNavigate();
  const { lang, t } = useTranslate();
  const initials = user.username.slice(0, 2).toUpperCase();
  async function logout() {
    await logoutUserFn();
    await navigate({ to: "/login" });
  }
  return (
    <header className="glass-topbar sticky top-0 z-30 flex h-16 items-center gap-3 px-3 lg:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden text-sm md:block">
        <p className="font-bold">{user.username}</p>
        <p className="text-xs text-muted-foreground">
          {user.role}
          {user.isTestUser ? " · Demo" : ""}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
          className="rounded-xl border bg-white/60 px-3 py-2 text-xs font-bold"
        >
          {lang === "en" ? "SW" : "EN"}
        </button>
        <Link
          to="/pos"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
        >
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">{t("openPos")}</span>
        </Link>
        <div
          className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-xs font-black text-blue-900"
          title={`${user.username} · ${user.email}`}
        >
          {initials}
        </div>
        <button
          onClick={logout}
          className="rounded-xl border bg-white/60 p-2 text-rose-700"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
