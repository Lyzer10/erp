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
  const { lang } = useTranslate();
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
    signIn: lang === "en" ? "Sign In" : "Ingia",
    signUp: lang === "en" ? "Sign Up" : "Jisajili",
    welcome:
      lang === "en"
        ? "Welcome back — sign in to continue."
        : "Karibu tena — ingia ili kuendelea.",
    emailPlaceholder: lang === "en" ? "Email or Username" : "Barua pepe au Jina",
    passPlaceholder: lang === "en" ? "Password" : "Nywila",
    forgot: lang === "en" ? "Forgot password?" : "Umesahau nywila?",
    copyright: "© 2005–2026 DeveleICT.",
    contact: lang === "en" ? "Contact Us" : "Wasiliana Nasi",
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6"
      style={{
        background:
          "radial-gradient(1200px 700px at 50% 0%, #eaf5f2 0%, #f4f6f7 55%, #e6ebee 100%)",
      }}
    >
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/[0.04]">
        {/* Soft brand glow accent */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(31,156,136,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Top: language toggle + Sign Up */}
        <div className="relative flex items-center justify-between px-8 pt-7 sm:px-12">
          <button
            onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
            className="text-sm font-medium text-[#111113]/50 transition hover:text-[#111113] focus-visible:outline-none"
          >
            {lang === "en" ? "English" : "Kiswahili"} ▾
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#111113]/70 transition hover:text-[#1f9c88] focus-visible:outline-none"
          >
            <UserPlus className="h-4 w-4" />
            {copy.signUp}
          </button>
        </div>

        {/* Logo — large & centered */}
        <div className="relative flex flex-col items-center px-8 pt-8 sm:px-12">
          <img
            src="/devele-logo.png"
            alt="DeveleERP"
            className="h-20 w-20 rounded-2xl object-contain shadow-lg shadow-[#1f9c88]/15 ring-1 ring-black/5"
          />
          <span className="mt-4 text-2xl font-extrabold tracking-tight text-[#111113]">
            DeveleERP
          </span>
        </div>

        {/* Form */}
        <div className="relative px-8 pb-4 pt-8 sm:px-12">
          <div className="text-center">
            <h2 className="text-[34px] font-bold leading-none tracking-[-0.02em] text-[#111113]">
              {copy.signIn}
            </h2>
            <p className="mt-2.5 text-sm font-medium text-[#111113]/55">
              {copy.welcome}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

            <div className="pt-1">
              <button
                type="button"
                className="text-sm font-semibold text-[#1f9c88] transition hover:text-[#177d6d] focus-visible:outline-none"
              >
                {copy.forgot}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold text-white shadow-lg shadow-[#1f9c88]/25 transition duration-150 hover:shadow-xl hover:shadow-[#1f9c88]/35 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f9c88] focus-visible:ring-offset-2"
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

        {/* Footer */}
        <div className="relative mt-6 flex items-center justify-between border-t border-[#e2e8f0]/70 px-8 py-5 sm:px-12">
          <p className="text-xs font-medium text-[#111113]/40">
            {copy.copyright}
          </p>
          <button
            type="button"
            className="text-xs font-medium text-[#111113]/40 transition hover:text-[#111113]/70 focus-visible:outline-none"
          >
            {copy.contact}
          </button>
        </div>
      </div>
    </div>
  );
}
