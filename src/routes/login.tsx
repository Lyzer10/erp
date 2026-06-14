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

  // Translation helpers for landing slogans and mockup items
  const welcomeText = lang === "en" ? "Welcome Back" : "Karibu Tena";
  const enterCreds = lang === "en" ? "Enter your username and password to access your account." : "Ingiza jina la mtumiaji na nywila yako kufikia akaunti.";
  const usernameLabel = lang === "en" ? "Username" : "Jina la Mtumiaji";
  const passLabel = lang === "en" ? "Password" : "Nywila";
  const placeholderUser = lang === "en" ? "Enter your username" : "Ingiza jina la mtumiaji";
  const placeholderPass = lang === "en" ? "Enter your password" : "Ingiza nywila yako";
  const rememberText = lang === "en" ? "Remember Me" : "Nikumbuke";
  const forgotText = lang === "en" ? "Forgot Password?" : "Umesahau Nywila?";
  const orLoginWith = lang === "en" ? "Or Login With" : "Au Ingia Kwa";
  const noAccount = lang === "en" ? "Don't Have An Account?" : "Huna Akaunti?";
  const registerNow = lang === "en" ? "Register Now" : "Sajili Sasa";
  const copyrightText = lang === "en" ? "Copyright © 2026 DeveleICT. All Rights Reserved." : "Haki zote zimehifadhiwa © 2026 DeveleICT.";
  const privacyText = lang === "en" ? "Privacy Policy" : "Sera ya Faragha";

  // Banner Slogans
  const bannerHeading = lang === "en" ? "Effortlessly manage your team and operations." : "Simamia timu na shughuli zako kwa urahisi kabisa.";
  const bannerSubtext = lang === "en" ? "Log in to access your CRM dashboard and manage your team." : "Ingia ili kufikia dashibodi yako ya CRM na kusimamia timu yako.";

  // Mockup translation fields
  const mockTotalSales = lang === "en" ? "Total Sales" : "Mauzo Yote";
  const mockSalesOverview = lang === "en" ? "Sales Overview" : "Muhtasari wa Mauzo";
  const mockCategories = lang === "en" ? "Sales Categories" : "Makundi ya Mauzo";
  const mockTransactions = lang === "en" ? "Product Transactions" : "Miamala ya Bidhaa";
  const mockPaid = lang === "en" ? "Paid" : "Imelipwa";
  const mockPending = lang === "en" ? "Pending" : "Inasubiri";

  return (
    <div className="grid min-h-screen lg:grid-cols-12 bg-white font-sans antialiased">
      {/* LEFT SIDE: Login Form Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-white relative">
        {/* Language Selector in Top Right of Form Panel */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setLanguage(lang === "en" ? "sw" : "en")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 focus:outline-none cursor-pointer"
            title={lang === "en" ? "Badili kwenda Kiswahili" : "Change to English"}
          >
            <span className="text-base">{lang === "en" ? "🇬🇧" : "🇹🇿"}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{lang === "en" ? "EN" : "SW"}</span>
          </button>
        </div>

        {/* Top Branding Logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:mb-0">
          <img
            src="/devele-logo.png"
            alt="DeveleERP"
            className="h-10 w-10 rounded-xl object-contain shadow-sm bg-white p-1 border border-slate-100"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 leading-tight">DeveleERP</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#1f9c88]">Enterprise Suite</span>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-sm mx-auto my-auto py-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {welcomeText}
          </h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            {enterCreds}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {usernameLabel}
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={placeholderUser}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-150 focus:border-[#1f9c88] focus:bg-white focus:ring-2 focus:ring-[#1f9c88]/15"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                {passLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={placeholderPass}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-150 focus:border-[#1f9c88] focus:bg-white focus:ring-2 focus:ring-[#1f9c88]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-500 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1f9c88] focus:ring-[#1f9c88] accent-[#1f9c88]"
                />
                {rememberText}
              </label>
              <button type="button" className="text-xs font-bold text-[#1f9c88] hover:text-[#177d6d] hover:underline cursor-pointer">
                {forgotText}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#1f9c88] hover:bg-[#177d6d] py-3 text-sm font-bold text-white shadow-lg shadow-[#1f9c88]/20 transition-all duration-150 disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f9c88] focus:ring-offset-2"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-7 text-center">
            <hr className="border-slate-150" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {orLoginWith}
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.79 17.3 4.25 11.24 7.08 7.35c1.4-1.92 3.1-2.12 4.22-1.34 1.18.8 2.03.78 3.25-.03 1.05-.72 2.7-.85 3.84.58-2.33 2.02-1.96 5.86.73 7.05-1.74 3.96-3.8 6.73-5.87 6.67zM15.48 4.21c.88-1.07 1.45-2.58.9-4.21-1.42.06-3.14.95-3.86 2.18-.8.92-1.34 2.44-.7 4.02 1.57.12 3.07-.76 3.66-1.99z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Registration Prompt */}
          <p className="mt-8 text-center text-xs font-medium text-slate-500">
            {noAccount}{" "}
            <button type="button" className="font-bold text-[#1f9c88] hover:text-[#177d6d] hover:underline cursor-pointer">
              {registerNow}
            </button>
          </p>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-6 mt-8 text-[11px] text-slate-400 font-semibold gap-2">
          <span>{copyrightText}</span>
          <button type="button" className="hover:text-[#1f9c88] transition text-left cursor-pointer">{privacyText}</button>
        </div>
      </div>

      {/* RIGHT SIDE: Premium Showcase with Live CSS Mockup */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1f9c88] to-[#125d51] relative overflow-hidden text-white">
        {/* Abstract vector schematic blueprint overlay */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#ffffff_0.75px,transparent_0.75px)] [background-size:20px_20px]" />
        
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] text-white stroke-current opacity-15 z-0" 
          viewBox="0 0 100 100" 
          fill="none"
        >
          <circle cx="50" cy="50" r="45" strokeWidth="0.1" />
          <circle cx="50" cy="50" r="43" strokeWidth="0.08" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="30" strokeWidth="0.12" strokeDasharray="8 4" className="animate-[spin_200s_linear_infinite]" />
          <line x1="50" y1="2" x2="50" y2="98" strokeWidth="0.08" strokeDasharray="4 4" />
          <line x1="2" y1="50" x2="98" y2="50" strokeWidth="0.08" strokeDasharray="4 4" />
          <line x1="15" y1="15" x2="85" y2="85" strokeWidth="0.06" />
        </svg>

        {/* Slogans Container */}
        <div className="relative z-10 max-w-xl mb-6">
          <h3 className="text-3xl font-extrabold tracking-tight mb-3 leading-snug">
            {bannerHeading}
          </h3>
          <p className="text-emerald-100 text-sm font-medium opacity-90 max-w-md">
            {bannerSubtext}
          </p>
        </div>

        {/* CSS Mockup Dashboard Grid container */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
            
            {/* Top Stat widgets row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Sales Card */}
              <div className="bg-[#1f9c88]/40 border border-white/10 rounded-xl p-3 shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-emerald-100/80 font-bold uppercase tracking-wider block mb-1">{mockTotalSales}</span>
                <span className="text-base font-extrabold tracking-tight text-white block">TZS 18.4M</span>
                <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white mt-1 border border-white/5">+12.4%</span>
              </div>

              {/* Chat Performance / Activity status card */}
              <div className="bg-white/10 border border-white/10 rounded-xl p-3 shadow-sm">
                <span className="text-[10px] text-emerald-100/80 font-bold uppercase tracking-wider block mb-1">Shift / Zamu</span>
                <span className="text-base font-extrabold text-white block">07:42:12</span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 mt-1 border border-emerald-500/10">Active</span>
              </div>

              {/* Sales overview statistics sparkline */}
              <div className="bg-white/10 border border-white/10 rounded-xl p-3 shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-emerald-100/80 font-bold uppercase tracking-wider block mb-1">{mockSalesOverview}</span>
                <span className="text-xs font-bold text-white block">Steady Growth</span>
                <div className="absolute bottom-2 left-3 right-3 h-4">
                  <svg className="w-full h-full text-emerald-300" viewBox="0 0 100 20" fill="none" preserveAspectRatio="none">
                    <path d="M0 15 Q 15 2, 30 14 T 60 4 T 100 8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Core Section: Split-columns grid */}
            <div className="grid grid-cols-12 gap-3">
              {/* Left Column: Recent transactions table */}
              <div className="col-span-8 bg-white/10 border border-white/10 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">{mockTransactions}</span>
                  <span className="text-[9px] font-bold text-emerald-200">View All</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">#SL-9218</p>
                      <p className="text-[10px] text-emerald-100/70">Walk-in Customer</p>
                    </div>
                    <span className="font-semibold">TZS 450k</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[9px] font-bold">{mockPaid}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">#SL-9217</p>
                      <p className="text-[10px] text-emerald-100/70">Kariakoo Wholesale Ltd</p>
                    </div>
                    <span className="font-semibold">TZS 1.2M</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[9px] font-bold">{mockPaid}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">#SL-9216</p>
                      <p className="text-[10px] text-emerald-100/70">Juma Ally Omary</p>
                    </div>
                    <span className="font-semibold">TZS 320k</span>
                    <span className="rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-[9px] font-bold">{mockPending}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Category breakdown donuts chart widget */}
              <div className="col-span-4 bg-white/10 border border-white/10 rounded-xl p-3 flex flex-col justify-between items-center text-center">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-100 block">{mockCategories}</span>
                <div className="relative h-20 w-20 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/10" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-300" strokeWidth="3.5" strokeDasharray="65, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-extrabold text-white">6,248</span>
                    <span className="text-[8px] text-emerald-200 uppercase tracking-widest">Units</span>
                  </div>
                </div>
                <div className="w-full flex justify-between text-[9px] font-bold text-emerald-100/90 pt-1">
                  <span>Retail: 65%</span>
                  <span>Wholesale: 35%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Small badge */}
        <div className="text-[10px] text-emerald-100/60 font-semibold uppercase tracking-widest relative z-10 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
          Powered by DeveleERP 2.5 — Secure Cloud Service
        </div>
      </div>
    </div>
  );
}
