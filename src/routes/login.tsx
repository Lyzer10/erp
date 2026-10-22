import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useTranslate, setLanguage } from "@/lib/i18n";
import { loginUserFn } from "@/lib/api/auth";

const SLIDES = ["/login-bg-1.jpg", "/login-bg-2.jpg", "/login-bg-3.jpg"];
const SLIDE_INTERVAL_MS = 8000;

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign In — DeveleERP" }],
    // Only the first slide is fetched with the page; the rest load after it is interactive.
    links: [{ rel: "preload", as: "image", href: SLIDES[0], fetchPriority: "high" }],
  }),
  component: LoginPage,
});

function BackgroundSlideshow() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState<boolean[]>(() => SLIDES.map((_, index) => index === 0));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const load = () =>
      SLIDES.slice(1).forEach((src, offset) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () =>
          !cancelled &&
          setReady((current) => current.map((value, index) => value || index === offset + 1));
        image.src = src;
      });
    // Start right after the first slide has painted so every photo is ready by its turn.
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", load);
    };
  }, []);

  useEffect(() => {
    if (ready.filter(Boolean).length < 2) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setActive((current) => {
        // Skip any slide that has not finished downloading yet.
        for (let step = 1; step <= SLIDES.length; step++) {
          const next = (current + step) % SLIDES.length;
          if (ready[next]) return next;
        }
        return current;
      });
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [ready]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SLIDES.map((src, index) =>
        ready[index] ? (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out will-change-[opacity]"
            style={{ backgroundImage: `url('${src}')`, opacity: index === active ? 1 : 0 }}
          />
        ) : null,
      )}
      {/* Photos stay clear; only a faint bottom shade so the credit line is readable. */}
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent)" }}
      />
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { lang } = useTranslate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginUserFn({ data: { username, password } });
      if (!result.success) {
        setErrorMessage(result.message || "Invalid username or password.");
        return;
      }
      await navigate({ to: "/" });
    } catch {
      setErrorMessage("Unable to sign in. Check the server connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const copy = {
    signIn: lang === "en" ? "Sign In" : "Ingia",
    signUp: lang === "en" ? "Sign Up" : "Jisajili",
    welcome:
      lang === "en" ? "Welcome back — sign in to continue." : "Karibu tena — ingia ili kuendelea.",
    emailPlaceholder: lang === "en" ? "Email or Username" : "Barua pepe au Jina",
    passPlaceholder: lang === "en" ? "Password" : "Nywila",
    forgot: lang === "en" ? "Forgot password?" : "Umesahau nywila?",
    copyright: "© 2005–2026 DeveleICT.",
    contact: lang === "en" ? "Contact Us" : "Wasiliana Nasi",
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0f3d36] p-4 sm:p-6">
      <BackgroundSlideshow />
      <a
        href="https://www.magnific.com/author/asphotofamily"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-4 z-10 text-[11px] text-white/60 transition hover:text-white/90"
      >
        Photos by ASphotofamily on Freepik
      </a>
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/30 ring-1 ring-black/[0.04]">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(31,156,136,0.18) 0%, transparent 70%)",
          }}
        />

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

        <div className="relative px-8 pb-4 pt-8 sm:px-12">
          <div className="text-center">
            <h2 className="text-[34px] font-bold leading-none tracking-[-0.02em] text-[#111113]">
              {copy.signIn}
            </h2>
            <p className="mt-2.5 text-sm font-medium text-[#111113]/55">{copy.welcome}</p>
          </div>

          {errorMessage && (
            <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200/60 p-4 text-sm font-medium text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              id="login-email"
              type="text"
              autoComplete="username"
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
                background: "linear-gradient(135deg, #25b89f 0%, #1f9c88 50%, #177d6d 100%)",
              }}
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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

        <div className="relative mt-6 flex items-center justify-between border-t border-[#e2e8f0]/70 px-8 py-5 sm:px-12">
          <p className="text-xs font-medium text-[#111113]/40">{copy.copyright}</p>
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
