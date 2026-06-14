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
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50/50 px-4 overflow-hidden">
      {/* Premium subtle background grid pattern & radial blur */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_30%,#ccfbf1_40%,transparent_100%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_30%_80%,#e0f2fe_40%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Language Selector */}
        <div className="absolute -top-14 right-0">
          <button
            onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white hover:border-slate-300 focus:outline-none cursor-pointer"
            title={lang === "en" ? "Badili kwenda Kiswahili" : "Change to English"}
          >
            <span className="text-base">{lang === "en" ? "🇬🇧" : "🇹🇿"}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{lang === "en" ? "EN" : "SW"}</span>
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-md transition-all duration-300 hover:shadow-slate-200/70">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <img
              src="/devele-logo.png"
              alt="DeveleICT"
              className="h-14 w-14 rounded-xl object-contain shadow-sm bg-white p-1"
            />
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">DeveleERP</h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1f9c88]">Enterprise Suite</p>
            </div>
          </div>

          <h2 className="mb-1 text-center text-sm font-bold text-slate-800 uppercase tracking-wider">{t("loginTitle")}</h2>
          <p className="mb-6 text-center text-xs text-slate-500 font-medium">{t("loginSub")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1f9c88] focus:bg-white focus:ring-2 focus:ring-[#1f9c88]/15"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1f9c88] focus:bg-white focus:ring-2 focus:ring-[#1f9c88]/15"
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
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-[#1f9c88] focus:ring-[#1f9c88] accent-[#1f9c88]"
                />
                {t("rememberMe")}
              </label>
              <button type="button" className="text-xs font-semibold text-[#1f9c88] hover:text-[#177d6d] hover:underline cursor-pointer">
                {t("forgotPassword")}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#1f9c88] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1f9c88]/15 hover:bg-[#177d6d] disabled:opacity-60 transition cursor-pointer"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {lang === "en" ? "Powered by" : "Inaendeshwa na"}{" "}
            <span className="font-extrabold text-slate-500">DeveleICT</span>
          </p>
        </div>
      </div>
    </div>
  );
}
