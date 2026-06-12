import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslate, setLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — DeveleERP" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { lang, t } = useTranslate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days vs 1 day
      try {
        document.cookie = `is_logged_in=true; path=/; max-age=${maxAge}; SameSite=Lax`;
        localStorage.setItem("is_logged_in", "true");
      } catch {
        // storage may be blocked in some embedded contexts
      }
      navigate({ to: "/" });
    }, 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="relative w-full max-w-sm">
        {/* Language Selector */}
        <div className="absolute -top-14 right-0">
          <button
            onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white/70 hover:border-slate-300 focus:outline-none"
            title={lang === "en" ? "Badili kwenda Kiswahili" : "Change to English"}
          >
            <span className="text-base">{lang === "en" ? "🇬🇧" : "🇹🇿"}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{lang === "en" ? "EN" : "SW"}</span>
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/80 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur-sm">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <img
              src="/devele-logo.png"
              alt="DeveleICT"
              className="h-14 w-14 rounded-xl object-contain shadow-sm"
            />
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">DeveleERP</h1>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Enterprise Suite</p>
            </div>
          </div>

          <h2 className="mb-1 text-center text-lg font-bold text-slate-900">{t("loginTitle")}</h2>
          <p className="mb-6 text-center text-xs text-slate-500">{t("loginSub")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("usernameLabel")}
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("usernamePlaceholder")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded accent-blue-600"
                />
                {t("rememberMe")}
              </label>
              <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
                {t("forgotPassword")}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600 disabled:opacity-60"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            {lang === "en" ? "Powered by" : "Inaendeshwa na"}{" "}
            <span className="font-semibold text-slate-500">DeveleICT</span>
          </p>
        </div>
      </div>
    </div>
  );
}
