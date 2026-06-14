import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
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
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
      try {
        document.cookie = `is_logged_in=true; path=/; max-age=${maxAge}; SameSite=Lax`;
        localStorage.setItem("is_logged_in", "true");
      } catch {
        // storage may be blocked
      }
      navigate({ to: "/" });
    }, 800);
  }

  const copy = {
    tagline: lang === "en"
      ? "Enterprise resource planning — built for East Africa."
      : "Mfumo wa usimamizi wa biashara — uliojengwa kwa Afrika Mashariki.",
    heading: lang === "en"
      ? "Manage\nyour business"
      : "Simamia\nbiashara yako",
    feat1Title: lang === "en" ? "Real-time Analytics" : "Takwimu za Wakati Halisi",
    feat1Desc: lang === "en"
      ? "Track your business performance with live dashboards and reports"
      : "Fuatilia utendaji wa biashara kwa dashibodi na ripoti za moja kwa moja",
    feat2Title: lang === "en" ? "M-Pesa Integration" : "Muunganiko wa M-Pesa",
    feat2Desc: lang === "en"
      ? "Accept payments seamlessly with integrated mobile money"
      : "Pokea malipo kwa urahisi kupitia pesa za simu zilizounganishwa",
    feat3Title: lang === "en" ? "Inventory Management" : "Usimamizi wa Bidhaa",
    feat3Desc: lang === "en"
      ? "Never run out of stock with automated inventory tracking"
      : "Usiishiwe na bidhaa kwa ufuatiliaji otomatiki wa hifadhi",
    signIn: lang === "en" ? "Sign In" : "Ingia",
    signInSub: lang === "en"
      ? "Enter your credentials to access your account"
      : "Ingiza taarifa zako kufikia akaunti yako",
    emailLabel: lang === "en" ? "Email or Username" : "Barua pepe au Jina",
    emailPlaceholder: lang === "en" ? "you@company.com" : "jina@kampuni.com",
    passLabel: lang === "en" ? "Password" : "Nywila",
    passPlaceholder: lang === "en" ? "Enter your password" : "Ingiza nywila yako",
    remember: lang === "en" ? "Remember me" : "Nikumbuke",
    forgot: lang === "en" ? "Forgot password?" : "Umesahau nywila?",
    copyright: lang === "en"
      ? "© 2005–2026 DeveleICT."
      : "© 2005–2026 DeveleICT.",
    contact: lang === "en" ? "Contact Us" : "Wasiliana Nasi",
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ─── LEFT: Dark brand panel ─── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#111113] text-white">
        {/* Subtle radial glow — brand-tinted, not decorative */}
        <div
          className="pointer-events-none absolute -top-[30%] -right-[20%] h-[140%] w-[80%] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #1f9c88 0%, transparent 70%)",
          }}
        />

        {/* Top bar: logo + tagline */}
        <div className="relative z-10 flex items-center justify-between px-10 pt-10">
          <p className="max-w-xs text-sm font-medium text-white/50 leading-relaxed">
            {copy.tagline}
          </p>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 px-10 pb-4">
          <h1
            className="text-[clamp(2.75rem,5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white whitespace-pre-line"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {copy.heading}
          </h1>
        </div>

        {/* Feature checklist */}
        <div className="relative z-10 space-y-5 px-10 pb-10">
          {[
            { title: copy.feat1Title, desc: copy.feat1Desc },
            { title: copy.feat2Title, desc: copy.feat2Desc },
            { title: copy.feat3Title, desc: copy.feat3Desc },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1f9c88]/15 text-[#1f9c88]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative phone mockup — built with CSS to avoid external images */}
        <div className="pointer-events-none absolute bottom-[-2%] right-[6%] z-10 w-[220px]">
          <div className="rounded-[28px] border border-white/10 bg-[#1a1a1c] p-2 shadow-2xl shadow-black/50">
            <div className="overflow-hidden rounded-[22px] bg-[#0e0e10]">
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[9px] font-semibold text-white/60">
                <span>9:41</span>
                <div className="flex gap-1">
                  <span>●●●</span>
                </div>
              </div>
              {/* App header */}
              <div className="px-4 pb-2 pt-1">
                <p className="text-[8px] font-bold uppercase tracking-widest text-[#1f9c88]">DeveleERP</p>
                <p className="text-[10px] font-medium text-white/40">Dashboard</p>
              </div>
              {/* Big metric */}
              <div className="mx-4 rounded-xl bg-white/[0.04] px-3 py-3 border border-white/5">
                <p className="text-[8px] font-semibold text-white/40 uppercase tracking-wider">Total Revenue</p>
                <p className="mt-0.5 text-lg font-extrabold tracking-tight text-white">897,000</p>
                <p className="text-[8px] font-semibold text-[#1f9c88]">TZS</p>
              </div>
              {/* Mini chart bars */}
              <div className="flex items-end gap-[3px] px-4 py-3">
                {[40, 65, 55, 80, 70, 90, 60, 75, 50, 85, 95, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h * 0.35}px`,
                      background: i >= 8
                        ? "#1f9c88"
                        : "rgba(255,255,255,0.06)",
                    }}
                  />
                ))}
              </div>
              {/* Bottom row */}
              <div className="flex justify-between px-4 pb-4 pt-1">
                {[
                  { label: lang === "en" ? "Orders" : "Oda", val: "142" },
                  { label: lang === "en" ? "Items" : "Bidhaa", val: "1,980" },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-white/[0.04] border border-white/5 px-3 py-2 flex-1 first:mr-2">
                    <p className="text-[7px] font-semibold text-white/35 uppercase tracking-wider">{m.label}</p>
                    <p className="text-xs font-bold text-white">{m.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Sign-in form ─── */}
      <div className="flex flex-col bg-white">
        {/* Top bar: brand mark + lang */}
        <div className="flex items-center justify-between px-8 pt-8 sm:px-12 sm:pt-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/devele-logo.png"
              alt="DeveleERP"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="text-base font-bold text-[#111113]">DeveleERP</span>
          </div>
          <button
            onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#111113]/60 transition hover:bg-slate-100 hover:text-[#111113] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f9c88]"
          >
            {lang === "en" ? "English" : "Kiswahili"}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-current opacity-50">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Form centered vertically */}
        <div className="flex flex-1 items-center justify-center px-8 py-12 sm:px-12">
          <div className="w-full max-w-[380px]">
            <h2 className="text-[28px] font-bold text-[#111113] tracking-[-0.01em]">
              {copy.signIn}
            </h2>
            <p className="mt-2 text-sm text-[#111113]/50 font-medium">
              {copy.signInSub}
            </p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              {/* Email / Username */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-[#111113]/70 mb-1.5">
                  {copy.emailLabel}
                </label>
                <input
                  id="login-email"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#111113] placeholder:text-[#111113]/30 outline-none transition duration-150 focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/12"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-pass" className="block text-sm font-medium text-[#111113]/70 mb-1.5">
                  {copy.passLabel}
                </label>
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={copy.passPlaceholder}
                    className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 pr-11 text-sm text-[#111113] placeholder:text-[#111113]/30 outline-none transition duration-150 focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#111113]/30 transition hover:text-[#111113]/60 focus-visible:outline-none"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#111113]/60 select-none font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1f9c88] focus:ring-[#1f9c88] accent-[#1f9c88]"
                  />
                  {copy.remember}
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#1f9c88] hover:text-[#177d6d] transition focus-visible:outline-none"
                >
                  {copy.forgot}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-[#111113] py-3 text-sm font-semibold text-white transition duration-150 hover:bg-[#1f9c88] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f9c88] focus-visible:ring-offset-2"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                    {copy.signIn}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e2e8f0]/60 px-8 py-5 sm:px-12">
          <p className="text-xs text-[#111113]/35 font-medium">{copy.copyright}</p>
          <div className="flex items-center gap-5">
            <button type="button" className="text-xs font-medium text-[#111113]/35 transition hover:text-[#111113]/60 focus-visible:outline-none">
              {copy.contact}
            </button>
            <button
              onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
              className="text-xs font-medium text-[#111113]/35 transition hover:text-[#111113]/60 focus-visible:outline-none"
            >
              {lang === "en" ? "English" : "Kiswahili"} ▾
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
