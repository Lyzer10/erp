import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try {
        document.cookie = `is_logged_in=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        localStorage.setItem("is_logged_in", "true");
      } catch {
        /* blocked */
      }
      navigate({ to: "/" });
    }, 700);
  }

  const copy = {
    tagline:
      lang === "en"
        ? "Enterprise resource planning — built for East Africa."
        : "Mfumo wa usimamizi wa biashara — uliojengwa kwa Afrika Mashariki.",
    heading: lang === "en" ? "Manage\nyour business" : "Simamia\nbiashara yako",
    signIn: lang === "en" ? "Sign In" : "Ingia",
    signUp: lang === "en" ? "Sign Up" : "Jisajili",
    emailPlaceholder: lang === "en" ? "Email or Username" : "Barua pepe au Jina",
    passPlaceholder: lang === "en" ? "Password" : "Nywila",
    forgot: lang === "en" ? "Forgot password?" : "Umesahau nywila?",
    copyright: "© 2005–2026 DeveleICT.",
    contact: lang === "en" ? "Contact Us" : "Wasiliana Nasi",
  };

  return (
    <div
      className="min-h-screen w-full p-3 sm:p-5 lg:p-6"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% 0%, #d8dce0 0%, #b8bdc2 45%, #9aa0a6 100%)",
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] overflow-hidden rounded-[28px] shadow-2xl shadow-black/20 lg:grid-cols-[1fr_1.05fr]">
        {/* ─── LEFT: Dark brand panel ─── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#1a1310] text-white lg:flex">
          {/* Subtle radial brand glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08]"
            style={{
              background:
                "radial-gradient(circle, #1f9c88 0%, transparent 60%)",
            }}
          />
          {/* Decorative ring behind heading */}
          <div className="pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />

          {/* Tagline */}
          <div className="relative z-10 px-10 pt-10">
            <p className="max-w-xs text-[13px] font-medium leading-relaxed text-white/55">
              {copy.tagline}
            </p>
          </div>

          {/* Hero heading — centered */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-10">
            <h1
              className="whitespace-pre-line text-center text-[clamp(2.5rem,4.2vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.025em] text-white"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {copy.heading}
            </h1>
          </div>

          {/* Phone mockup — centered bottom */}
          <div className="relative z-10 mx-auto mb-[-20px] w-[230px]">
            <div className="rounded-[34px] border border-white/10 bg-[#0f0c0a] p-2 shadow-2xl shadow-black/60">
              <div className="overflow-hidden rounded-[28px] bg-[#0a0807]">
                <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[9px] font-semibold text-white/60">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>
                <div className="px-4 pb-2 pt-1">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#1f9c88]">
                    DeveleERP
                  </p>
                  <p className="text-[10px] font-medium text-white/40">
                    Dashboard
                  </p>
                </div>
                <div className="mx-4 rounded-xl border border-white/5 bg-white/[0.04] px-3 py-3">
                  <p className="text-[8px] font-semibold uppercase tracking-wider text-white/40">
                    Total Revenue
                  </p>
                  <p className="mt-0.5 text-lg font-extrabold tracking-tight text-white">
                    897,000
                  </p>
                  <p className="text-[8px] font-semibold text-[#1f9c88]">TZS</p>
                </div>
                <div className="flex items-end gap-[3px] px-4 py-3">
                  {[40, 65, 55, 80, 70, 90, 60, 75, 50, 85, 95, 45].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h * 0.35}px`,
                          background:
                            i >= 8 ? "#1f9c88" : "rgba(255,255,255,0.06)",
                        }}
                      />
                    ),
                  )}
                </div>
                <div className="flex justify-between gap-2 px-4 pb-4 pt-1">
                  {[
                    { label: lang === "en" ? "Orders" : "Oda", val: "142" },
                    { label: lang === "en" ? "Items" : "Bidhaa", val: "1,980" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex-1 rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2"
                    >
                      <p className="text-[7px] font-semibold uppercase tracking-wider text-white/35">
                        {m.label}
                      </p>
                      <p className="text-xs font-bold text-white">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Sign-in panel ─── */}
        <div className="flex flex-col bg-white">
          {/* Top: brand mark + Sign Up */}
          <div className="flex items-center justify-between px-8 pt-8 sm:px-14 sm:pt-10">
            <div className="flex items-center gap-2.5">
              <img
                src="/devele-logo.png"
                alt="DeveleERP"
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="text-base font-bold text-[#111113]">
                DeveleERP
              </span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#111113]/70 transition hover:text-[#1f9c88] focus-visible:outline-none"
            >
              <UserPlus className="h-4 w-4" />
              {copy.signUp}
            </button>
          </div>

          {/* Form centered */}
          <div className="flex flex-1 items-center justify-center px-8 py-10 sm:px-14">
            <div className="w-full max-w-[440px]">
              <h2 className="text-[42px] font-bold leading-none tracking-[-0.02em] text-[#111113]">
                {copy.signIn}
              </h2>

              <form onSubmit={handleSubmit} className="mt-10 space-y-4">
                {/* Email */}
                <input
                  id="login-email"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="w-full rounded-full border border-[#e2e8f0] bg-white px-6 py-4 text-[15px] text-[#111113] placeholder:text-[#111113]/40 outline-none transition duration-150 focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15"
                />

                {/* Password */}
                <div className="relative">
                  <input
                    id="login-pass"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={copy.passPlaceholder}
                    className="w-full rounded-full border border-[#e2e8f0] bg-white px-6 py-4 pr-14 text-[15px] text-[#111113] placeholder:text-[#111113]/40 outline-none transition duration-150 focus:border-[#1f9c88] focus:ring-2 focus:ring-[#1f9c88]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#111113]/40 transition hover:text-[#111113]/70 focus-visible:outline-none"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>

                {/* Forgot */}
                <div className="pt-1">
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#1f9c88] transition hover:text-[#177d6d] focus-visible:outline-none"
                  >
                    {copy.forgot}
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold text-white shadow-lg shadow-[#1f9c88]/25 transition duration-150 hover:shadow-xl hover:shadow-[#1f9c88]/35 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f9c88] focus-visible:ring-offset-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #25b89f 0%, #1f9c88 50%, #177d6d 100%)",
                  }}
                >
                  {loading ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      {copy.signIn}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 pb-7 pt-4 sm:px-14">
            <p className="text-xs font-medium text-[#111113]/40">
              {copy.copyright}
            </p>
            <div className="flex items-center gap-5">
              <button
                type="button"
                className="text-xs font-medium text-[#111113]/40 transition hover:text-[#111113]/70 focus-visible:outline-none"
              >
                {copy.contact}
              </button>
              <button
                onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
                className="flex items-center gap-1 text-xs font-medium text-[#111113]/40 transition hover:text-[#111113]/70 focus-visible:outline-none"
              >
                {lang === "en" ? "English" : "Kiswahili"} ▾
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
