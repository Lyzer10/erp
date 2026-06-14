import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";
import { useTranslate } from "@/lib/i18n";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Building2, Palette, CreditCard, ShieldCheck, MessageSquare, Key, 
  Save, AlertCircle, Check, Plus, Trash2, Globe, Clock, Download, 
  Upload, Eye, EyeOff, Sparkles, Server, FileText, X
} from "lucide-react";

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — DeveleERP" }] }),
  component: SettingsPage,
});

// Helper component for standard input fields
const SettingsField = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "",
  disabled = false
}: { 
  label: string; 
  value: string; 
  onChange?: (val: string) => void;
  type?: string; 
  placeholder?: string;
  disabled?: boolean;
}) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition duration-150",
        "focus:border-[#1f9c88] focus:outline-none focus:ring-2 focus:ring-[#1f9c88]/20",
        disabled && "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100"
      )}
    />
  </div>
);

// Toggle helper
const SettingsToggle = ({
  label,
  checked,
  onChange,
  description
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <div className="space-y-0.5">
      <label className="text-sm font-semibold text-slate-800">{label}</label>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1f9c88] focus:ring-offset-2",
        checked ? "bg-[#1f9c88]" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  </div>
);



function SettingsPage() {
  const { t, lang } = useTranslate();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const triggerSave = () => {
    setSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  // ================= TAB 1 STATE: BUSINESS PROFILE & HOURS =================
  const [bizProfile, setBizProfile] = useState({
    name: "Lumen Trading Co. Ltd",
    registrationNo: "TIN-102-938-124",
    vatNo: "VRN-400192837",
    phone: "+255 754 123 456",
    email: "info@lumentrading.co.tz",
    website: "https://lumentrading.co.tz",
    timezone: "Africa/Dar_es_Salaam",
    currency: "TZS (Shilling)",
    address: "Kariakoo Market Street, Dar es Salaam, Tanzania",
  });

  const [workingHours, setWorkingHours] = useState([
    { day: "Monday", swDay: "Jumatatu", active: true, start: "08:00", end: "17:00" },
    { day: "Tuesday", swDay: "Jumanne", active: true, start: "08:00", end: "17:00" },
    { day: "Wednesday", swDay: "Jumatano", active: true, start: "08:00", end: "17:00" },
    { day: "Thursday", swDay: "Alhamisi", active: true, start: "08:00", end: "17:00" },
    { day: "Friday", swDay: "Ijumaa", active: true, start: "08:00", end: "17:00" },
    { day: "Saturday", swDay: "Jumamosi", active: true, start: "09:00", end: "14:00" },
    { day: "Sunday", swDay: "Jumapili", active: false, start: "09:00", end: "13:00" },
  ]);

  const handleHourChange = (idx: number, key: "active" | "start" | "end", val: any) => {
    const updated = [...workingHours];
    updated[idx] = { ...updated[idx], [key]: val };
    setWorkingHours(updated);
  };

  // ================= TAB 2 STATE: APPEARANCE & RECEIPTS =================
  const [activeTheme, setActiveTheme] = useState("emerald");
  const [receiptSize, setReceiptSize] = useState("80mm");
  const [printLogo, setPrintLogo] = useState(true);
  const [printTax, setPrintTax] = useState(true);
  const [printPhone, setPrintPhone] = useState(true);
  const [printBarcode, setPrintBarcode] = useState(false);
  const [headerText, setHeaderText] = useState("ASANTE KWA KUFANYA BIASHARA NASI / THANK YOU FOR SHOPPING");
  const [footerText, setFooterText] = useState("BIDHAA HAZIRUDISHWI ZIKISHANUNULIWA / GOODS ONCE SOLD ARE NOT RETURNABLE");
  
  // Logos
  const [lightLogo, setLightLogo] = useState<string | null>("/devele-logo.png");
  const [darkLogo, setDarkLogo] = useState<string | null>(null);

  // ================= TAB 3: SUBSCRIPTION =================
  const [billingLogs] = useState([
    { date: "2026-06-12", ref: "QE7819DK83", amount: "TZS 200,000", status: "Completed", swStatus: "Imekamilika" },
    { date: "2026-05-12", ref: "QD8293DM12", amount: "TZS 200,000", status: "Completed", swStatus: "Imekamilika" },
    { date: "2026-04-12", ref: "QC8172DN02", amount: "TZS 200,000", status: "Completed", swStatus: "Imekamilika" },
    { date: "2026-03-12", ref: "QB9182DP99", amount: "TZS 200,000", status: "Completed", swStatus: "Imekamilika" },
  ]);

  // ================= TAB 4 STATE: PAYMENT GATEWAYS =================
  const [gateways, setGateways] = useState({
    mpesaKey: "da23j8f1h28fa9fh18fa09fh2",
    mpesaSecret: "8f0a2e4b9c1d8e3f5a7b",
    mpesaShortcode: "400293",
    mpesaPasskey: "bf0a1c2d3e4f5a6b7c8d9e0f",
    mpesaSandbox: true,

    airtelMerchantId: "AIRTEL-TZ-9018",
    airtelApiKey: "air_live_7a8b9c0d1e2f",
    airtelShortcode: "556677",

    selcomCode: "SEL-TZ-40019",
    selcomToken: "sel_token_f98a7b6c5d4e",
    selcomSecret: "sel_sec_3a2b1c0d",
  });

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ================= TAB 5 STATE: SMS SETTINGS =================
  const [activeSMSProvider, setActiveSMSProvider] = useState("BlessedSMS");
  const [smsConfig, setSmsConfig] = useState({
    username: "lumentrading_sms",
    apiKey: "sms_api_live_8f0a2e4b9c1d8e",
    senderId: "LUMEN_TRD",
    partnerId: "PTN-4001",
  });
  const [smsCredits, setSmsCredits] = useState(1420);
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupNumber, setTopupNumber] = useState("+255 754 123 456");
  const [topupAmount, setTopupAmount] = useState("10000");
  const [topupStatus, setTopupStatus] = useState<"idle" | "sending" | "success">("idle");
  const [smsTriggerCheckout, setSmsTriggerCheckout] = useState(true);

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    setTopupStatus("sending");
    setTimeout(() => {
      setTopupStatus("success");
      const creditsAdded = Math.round(Number(topupAmount) / 10); // 10 TZS per SMS mock
      setTimeout(() => {
        setSmsCredits(prev => prev + creditsAdded);
        setTopupOpen(false);
        setTopupStatus("idle");
      }, 1500);
    }, 1500);
  };

  // ================= TAB 6 STATE: DEVELOPER API KEYS =================
  const [apiKeys, setApiKeys] = useState([
    { id: "KEY-1", name: "WooCommerce Store Sync", token: "dev_live_8f0a2e4b9c1d8e3f4a2b", scopes: ["catalog:read", "orders:write"], limit: 120, created: "2026-06-01" },
    { id: "KEY-2", name: "Admin Mobile App Client", token: "dev_live_7c9f8a3d2e1b0c5d4e3f", scopes: ["catalog:read", "orders:read"], limit: 60, created: "2026-06-10" },
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState("120");
  const [newKeyScopes, setNewKeyScopes] = useState({
    "catalog:read": true,
    "orders:read": true,
    "orders:write": false
  });

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const generatedToken = `dev_live_${randomHex}`;
    const selectedScopes = Object.entries(newKeyScopes)
      .filter(([_, checked]) => checked)
      .map(([scope]) => scope);

    const newKey = {
      id: `KEY-${Date.now()}`,
      name: newKeyName,
      token: generatedToken,
      scopes: selectedScopes,
      limit: Number(newKeyLimit) || 120,
      created: new Date().toISOString().split("T")[0]
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName("");
    setNewKeyLimit("120");
    setNewKeyScopes({ "catalog:read": true, "orders:read": true, "orders:write": false });
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  // Currency helper
  const tzs = (amount: number) => {
    return "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader 
          title={t("settings")} 
          description={lang === "en" ? "System-wide settings, payment modules, operational configurations, and developer utilities." : "Mipangilio ya mfumo, mifumo ya malipo, usanidi wa uendeshaji, na zana za watengenezaji."} 
        />
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 border border-emerald-150 animate-in fade-in duration-200">
              <Check className="h-4 w-4" />
              <span>{lang === "en" ? "Settings saved successfully!" : "Mipangilio imehifadhiwa kikamilifu!"}</span>
            </div>
          )}
          <button 
            onClick={triggerSave}
            disabled={saving}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg bg-[#1f9c88] hover:bg-[#177d6d] px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm duration-150 focus:outline-none focus:ring-2 focus:ring-[#1f9c88] focus:ring-offset-2",
              saving && "opacity-80 cursor-wait"
            )}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{lang === "en" ? "Updating..." : "Inasasisha..."}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{lang === "en" ? "Save Changes" : "Hifadhi Mabadiliko"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <TabbedPage tabs={[
        // ================= TAB 1: PROFILE & HOURS =================
        { 
          key: "profile", 
          label: lang === "en" ? "Profile & Hours" : "Wasifu na Saa za Kazi", 
          render: () => (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Card */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <Building2 className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "Business Profile" : "Wasifu wa Biashara"}
                    </h2>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SettingsField 
                      label={lang === "en" ? "Business / Company Name" : "Jina la Biashara / Kampuni"} 
                      value={bizProfile.name} 
                      onChange={(val) => setBizProfile({...bizProfile, name: val})}
                    />
                    <SettingsField 
                      label={lang === "en" ? "Registration Number (TIN)" : "Namba ya TIN (Usajili)"} 
                      value={bizProfile.registrationNo} 
                      onChange={(val) => setBizProfile({...bizProfile, registrationNo: val})}
                    />
                    <SettingsField 
                      label={lang === "en" ? "VAT Number (VRN)" : "Namba ya VAT (VRN)"} 
                      value={bizProfile.vatNo} 
                      onChange={(val) => setBizProfile({...bizProfile, vatNo: val})}
                    />
                    <SettingsField 
                      label={lang === "en" ? "Official Phone Number" : "Namba Rasmi ya Simu"} 
                      value={bizProfile.phone} 
                      onChange={(val) => setBizProfile({...bizProfile, phone: val})}
                    />
                    <SettingsField 
                      label={lang === "en" ? "Official Email" : "Barua Pepe Rasmi"} 
                      value={bizProfile.email} 
                      onChange={(val) => setBizProfile({...bizProfile, email: val})}
                    />
                    <SettingsField 
                      label={lang === "en" ? "Website URL" : "Tovuti ya Kampuni"} 
                      value={bizProfile.website} 
                      onChange={(val) => setBizProfile({...bizProfile, website: val})}
                    />
                  </div>

                  <div className="mt-4 space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {lang === "en" ? "Physical Address" : "Anwani ya Eneo"}
                    </label>
                    <textarea 
                      value={bizProfile.address} 
                      onChange={(e) => setBizProfile({...bizProfile, address: e.target.value})}
                      rows={3} 
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none focus:ring-2 focus:ring-[#1f9c88]/20"
                    />
                  </div>
                </GlassCard>

                {/* Localization Preferences */}
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <Globe className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "Localization Settings" : "Mipangilio ya Kikanda"}
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {lang === "en" ? "Base Currency" : "Sarafu Kuu"}
                      </label>
                      <select 
                        value={bizProfile.currency} 
                        onChange={(e) => setBizProfile({...bizProfile, currency: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      >
                        <option value="TZS (Shilling)">TZS (Tanzanian Shilling)</option>
                        <option value="KES (Shilling)">KES (Kenyan Shilling)</option>
                        <option value="USD ($)">USD (US Dollar)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {lang === "en" ? "System Timezone" : "Ukanda wa Saa"}
                      </label>
                      <select 
                        value={bizProfile.timezone} 
                        onChange={(e) => setBizProfile({...bizProfile, timezone: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      >
                        <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
                        <option value="Africa/Nairobi">Africa/Nairobi</option>
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                      </select>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Working Hours Card */}
              <div className="space-y-6">
                <GlassCard className="rounded-xl border border-slate-200 h-full">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <Clock className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "Business Hours" : "Saa za Kazi za Wiki"}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {workingHours.map((item, idx) => (
                      <div key={item.day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`day-${item.day}`}
                            checked={item.active}
                            onChange={(e) => handleHourChange(idx, "active", e.target.checked)}
                            className="rounded text-[#1f9c88] focus:ring-[#1f9c88] h-4 w-4"
                          />
                          <label htmlFor={`day-${item.day}`} className="text-sm font-semibold text-slate-700 w-24">
                            {lang === "en" ? item.day : item.swDay}
                          </label>
                        </div>
                        {item.active ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="time" 
                              value={item.start}
                              onChange={(e) => handleHourChange(idx, "start", e.target.value)}
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                            />
                            <span className="text-xs text-slate-400">&mdash;</span>
                            <input 
                              type="time" 
                              value={item.end}
                              onChange={(e) => handleHourChange(idx, "end", e.target.value)}
                              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 font-semibold italic bg-red-50/55 px-2 py-0.5 rounded">
                            {lang === "en" ? "Closed" : "Tumefunga"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )
        },

        // ================= TAB 2: APPEARANCE & RECEIPTS =================
        { 
          key: "appearance", 
          label: lang === "en" ? "Appearance & Receipts" : "Muonekano na Risiti", 
          render: () => (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Visual Appearance & Themes */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <Palette className="h-5 w-5 text-[#1f9c88]" />
                  <h2 className="text-base font-semibold text-slate-800">
                    {lang === "en" ? "Visual Branding & Theme" : "Chapa ya Visual na Mandhari"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      {lang === "en" ? "Brand Primary Theme" : "Rangi Kuu ya Chapa"}
                    </label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setActiveTheme("emerald")}
                        className={cn(
                          "w-10 h-10 rounded-full bg-[#1f9c88] border-4 transition-all",
                          activeTheme === "emerald" ? "border-slate-800 scale-105" : "border-transparent"
                        )}
                        title="Emerald Green (Default)"
                      />
                      <button 
                        onClick={() => setActiveTheme("blue")}
                        className={cn(
                          "w-10 h-10 rounded-full bg-blue-600 border-4 transition-all",
                          activeTheme === "blue" ? "border-slate-800 scale-105" : "border-transparent"
                        )}
                        title="Blue Ocean"
                      />
                      <button 
                        onClick={() => setActiveTheme("indigo")}
                        className={cn(
                          "w-10 h-10 rounded-full bg-indigo-700 border-4 transition-all",
                          activeTheme === "indigo" ? "border-slate-800 scale-105" : "border-transparent"
                        )}
                        title="Indigo Sky"
                      />
                      <button 
                        onClick={() => setActiveTheme("slate")}
                        className={cn(
                          "w-10 h-10 rounded-full bg-slate-700 border-4 transition-all",
                          activeTheme === "slate" ? "border-slate-800 scale-105" : "border-transparent"
                        )}
                        title="Charcoal Gray"
                      />
                    </div>
                  </div>

                  {/* Logo uploads mock fields */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center bg-slate-50/50">
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                        {lang === "en" ? "Light Background Logo" : "Nembo ya Mandhari Meupe"}
                      </label>
                      {lightLogo ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={lightLogo} alt="Light Logo" className="h-10 object-contain" />
                          <button onClick={() => setLightLogo(null)} className="text-xs text-red-600 font-semibold hover:underline">
                            {lang === "en" ? "Remove" : "Ondoa"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:bg-slate-100 p-2 rounded transition">
                          <Upload className="h-5 w-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">{lang === "en" ? "Upload Logo" : "Pakia Nembo"}</span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center bg-slate-50/50">
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">
                        {lang === "en" ? "Dark Background Logo" : "Nembo ya Mandhari Meusi"}
                      </label>
                      {darkLogo ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={darkLogo} alt="Dark Logo" className="h-10 object-contain bg-slate-900 p-1 rounded" />
                          <button onClick={() => setDarkLogo(null)} className="text-xs text-red-600 font-semibold hover:underline">
                            {lang === "en" ? "Remove" : "Ondoa"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:bg-slate-100 p-2 rounded transition">
                          <Upload className="h-5 w-5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">{lang === "en" ? "Upload Logo" : "Pakia Nembo"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Receipt Configurations */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <FileText className="h-5 w-5 text-[#1f9c88]" />
                  <h2 className="text-base font-semibold text-slate-800">
                    {lang === "en" ? "POS Receipt Print Prefs" : "Mipangilio ya Kuchapisha Risiti"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      {lang === "en" ? "Receipt Paper Size" : "Ukubwa wa Karatasi ya Risiti"}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["58mm", "80mm", "A4"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setReceiptSize(size)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-semibold transition text-center",
                            receiptSize === size 
                              ? "bg-blue-100 text-blue-900 border-[#1f9c88]" 
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <SettingsToggle 
                      label={lang === "en" ? "Show Logo on Receipt" : "Onyesha Nembo kwenye Risiti"}
                      checked={printLogo} 
                      onChange={setPrintLogo}
                    />
                    <SettingsToggle 
                      label={lang === "en" ? "Include Detailed VAT Breakdowns" : "Weka Mchanganuo wa Kodi ya VAT"}
                      checked={printTax} 
                      onChange={setPrintTax}
                    />
                    <SettingsToggle 
                      label={lang === "en" ? "Show Contact Phone Number" : "Onyesha Namba ya Simu ya Biashara"}
                      checked={printPhone} 
                      onChange={setPrintPhone}
                    />
                    <SettingsToggle 
                      label={lang === "en" ? "Print Barcode of Invoice ID" : "Chapisha Msimbo (Barcode) wa Ankara"}
                      checked={printBarcode} 
                      onChange={setPrintBarcode}
                    />
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {lang === "en" ? "Receipt Header Message" : "Ujumbe wa Juu kwenye Risiti"}
                      </label>
                      <input 
                        type="text" 
                        value={headerText} 
                        onChange={(e) => setHeaderText(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {lang === "en" ? "Receipt Footer Message" : "Ujumbe wa Chini kwenye Risiti"}
                      </label>
                      <input 
                        type="text" 
                        value={footerText} 
                        onChange={(e) => setFooterText(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        },

        // ================= TAB 3: SUBSCRIPTION =================
        { 
          key: "subscription", 
          label: lang === "en" ? "Subscription" : "Uanachama & Malipo", 
          render: () => (
            <div className="space-y-6">
              {/* Package Details */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <Sparkles className="h-5 w-5 text-[#1f9c88]" />
                  <h2 className="text-base font-semibold text-slate-800">
                    {lang === "en" ? "Active Subscription Plan" : "Kifurushi cha Uanachama"}
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {lang === "en" ? "Enterprise Package" : "Kifurushi cha Enterprise"}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">| {lang === "en" ? "Licensed" : "Inamilikiwa Halali"}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      TZS 200,000 / {lang === "en" ? "Month" : "Mwezi"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Next renewal date: July 14, 2026" : "Tarehe ya kulipia upya: Julai 14, 2026"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="rounded-lg bg-[#1f9c88]/10 text-[#1f9c88] hover:bg-[#1f9c88]/20 px-4 py-2 text-xs font-bold transition">
                      {lang === "en" ? "Upgrade Plan" : "Boresha Kifurushi"}
                    </button>
                    <button className="rounded-lg bg-[#1f9c88] hover:bg-[#177d6d] text-white px-4 py-2 text-xs font-bold shadow-sm transition">
                      {lang === "en" ? "Renew Now" : "Lipia Sasa"}
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Billing Logs Table */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <CreditCard className="h-5 w-5 text-[#1f9c88]" />
                  <h2 className="text-base font-semibold text-slate-800">
                    {lang === "en" ? "M-Pesa Billing History" : "Historia ya Malipo ya M-Pesa"}
                  </h2>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="p-3">{lang === "en" ? "Billing Date" : "Tarehe ya Malipo"}</th>
                        <th className="p-3">{lang === "en" ? "Transaction Ref (M-Pesa)" : "Kumbukumbu ya Malipo"}</th>
                        <th className="p-3">{lang === "en" ? "Amount Paid" : "Kiasi Kilicholipwa"}</th>
                        <th className="p-3">{lang === "en" ? "Status" : "Hali ya Malipo"}</th>
                        <th className="p-3 text-center">{lang === "en" ? "Invoice" : "Ankara PDF"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {billingLogs.map((log) => (
                        <tr key={log.ref} className="hover:bg-slate-50/55 transition">
                          <td className="p-3 font-medium">{log.date}</td>
                          <td className="p-3 font-mono text-xs">{log.ref}</td>
                          <td className="p-3 font-semibold">{log.amount}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900 border border-blue-100">
                              {lang === "en" ? log.status : log.swStatus}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button className="text-slate-500 hover:text-[#1f9c88] transition" title="Download Invoice">
                              <Download className="h-4 w-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )
        },

        // ================= TAB 4: PAYMENT GATEWAYS =================
        { 
          key: "gateways", 
          label: lang === "en" ? "Payment Gateways" : "Mifumo ya Malipo", 
          render: () => (
            <div className="space-y-6">
              {/* M-Pesa Gateway Card */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">M</span>
                    <div>
                      <h2 className="text-base font-semibold text-slate-800">M-Pesa Direct (Safaricom Daraja API)</h2>
                      <p className="text-xs text-slate-500">{lang === "en" ? "Configure C2B push requests and paybill alerts." : "Weka vigezo vya maombi ya malipo ya M-Pesa."}</p>
                    </div>
                  </div>
                  <SettingsToggle 
                    label={lang === "en" ? "Sandbox Mode" : "Modi ya Sandbox"}
                    checked={gateways.mpesaSandbox}
                    onChange={(val) => setGateways({...gateways, mpesaSandbox: val})}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <SettingsField 
                    label="Consumer Key" 
                    value={gateways.mpesaKey} 
                    onChange={(val) => setGateways({...gateways, mpesaKey: val})}
                  />
                  <div className="space-y-1 relative">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Consumer Secret</label>
                    <div className="relative">
                      <input 
                        type={showSecrets.mpesaSecret ? "text" : "password"} 
                        value={gateways.mpesaSecret} 
                        onChange={(e) => setGateways({...gateways, mpesaSecret: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => toggleSecret("mpesaSecret")} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecrets.mpesaSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SettingsField 
                    label={lang === "en" ? "Shortcode (Paybill/Till)" : "Msimbo Mfupi (Paybill/Till)"} 
                    value={gateways.mpesaShortcode} 
                    onChange={(val) => setGateways({...gateways, mpesaShortcode: val})}
                  />
                  <div className="space-y-1 relative">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Passkey</label>
                    <div className="relative">
                      <input 
                        type={showSecrets.mpesaPasskey ? "text" : "password"} 
                        value={gateways.mpesaPasskey} 
                        onChange={(e) => setGateways({...gateways, mpesaPasskey: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => toggleSecret("mpesaPasskey")} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecrets.mpesaPasskey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Airtel Money Card */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center font-bold text-red-800 text-sm">A</span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">Airtel Money Merchant API</h2>
                    <p className="text-xs text-slate-500">{lang === "en" ? "Configure online payment prompts for Airtel Money." : "Weka vigezo vya malipo kwa mtandao wa Airtel."}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <SettingsField 
                    label="Merchant ID" 
                    value={gateways.airtelMerchantId} 
                    onChange={(val) => setGateways({...gateways, airtelMerchantId: val})}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Secret Key</label>
                    <div className="relative">
                      <input 
                        type={showSecrets.airtelApiKey ? "text" : "password"} 
                        value={gateways.airtelApiKey} 
                        onChange={(e) => setGateways({...gateways, airtelApiKey: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => toggleSecret("airtelApiKey")} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecrets.airtelApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <SettingsField 
                    label={lang === "en" ? "Airtel Biller Shortcode" : "Msimbo wa Malipo wa Airtel"} 
                    value={gateways.airtelShortcode} 
                    onChange={(val) => setGateways({...gateways, airtelShortcode: val})}
                  />
                </div>
              </GlassCard>

              {/* Selcom Pesalink Card */}
              <GlassCard className="rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-900 text-sm">S</span>
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">Selcom Pesalink</h2>
                    <p className="text-xs text-slate-500">{lang === "en" ? "Integrate Selcom multi-operator gateway for local bank transfers." : "Unganisha mfumo wa Selcom kwa uhamisho wa benki na mitandao ya ndani."}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <SettingsField 
                    label="Merchant Code" 
                    value={gateways.selcomCode} 
                    onChange={(val) => setGateways({...gateways, selcomCode: val})}
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Token</label>
                    <div className="relative">
                      <input 
                        type={showSecrets.selcomToken ? "text" : "password"} 
                        value={gateways.selcomToken} 
                        onChange={(e) => setGateways({...gateways, selcomToken: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => toggleSecret("selcomToken")} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecrets.selcomToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Security Secret</label>
                    <div className="relative">
                      <input 
                        type={showSecrets.selcomSecret ? "text" : "password"} 
                        value={gateways.selcomSecret} 
                        onChange={(e) => setGateways({...gateways, selcomSecret: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => toggleSecret("selcomSecret")} 
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showSecrets.selcomSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        },

        // ================= TAB 5: SMS SETTINGS =================
        { 
          key: "sms", 
          label: lang === "en" ? "SMS Settings" : "Ujumbe wa SMS", 
          render: () => (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* API Provider settings */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <MessageSquare className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "SMS Gateway Configurations" : "Usanidi wa SMS Gateway"}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                        {lang === "en" ? "Active SMS Provider" : "Mtoa Huduma wa SMS Aliyefanya Kazi"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {["BlessedSMS", "PlanetSMS", "TextSMS", "TZ SMS"].map((prov) => (
                          <button
                            key={prov}
                            type="button"
                            onClick={() => setActiveSMSProvider(prov)}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-sm font-semibold transition text-center",
                              activeSMSProvider === prov 
                                ? "bg-blue-100 text-blue-900 border-[#1f9c88]" 
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <SettingsField 
                        label={lang === "en" ? "API Username" : "Jina la Mtumiaji la API"} 
                        value={smsConfig.username} 
                        onChange={(val) => setSmsConfig({...smsConfig, username: val})}
                      />
                      <SettingsField 
                        label="Partner ID / Client ID" 
                        value={smsConfig.partnerId} 
                        onChange={(val) => setSmsConfig({...smsConfig, partnerId: val})}
                      />
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Key / Token</label>
                        <input 
                          type="password" 
                          value={smsConfig.apiKey} 
                          onChange={(e) => setSmsConfig({...smsConfig, apiKey: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                        />
                      </div>
                      <SettingsField 
                        label={lang === "en" ? "Sender ID (Must be pre-approved)" : "Sender ID (Lazima iwe imeidhinishwa)"} 
                        value={smsConfig.senderId} 
                        onChange={(val) => setSmsConfig({...smsConfig, senderId: val})}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* SMS triggers */}
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <AlertCircle className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "Automated Alerts Triggers" : "Vichocheo vya Ujumbe wa Moja kwa Moja"}
                    </h2>
                  </div>

                  <SettingsToggle 
                    label={lang === "en" ? "Send receipt via SMS on sale checkout" : "Tuma kiungo cha risiti kwa SMS mauzo yanapokamilika"}
                    description={lang === "en" ? "Automated SMS to customer phone containing digital receipt download link." : "Hutuma SMS moja kwa moja kwa mteja iliyo na kiungo cha kupakua risiti ya dijitali."}
                    checked={smsTriggerCheckout}
                    onChange={setSmsTriggerCheckout}
                  />
                </GlassCard>
              </div>

              {/* Credits Sidebar Panel */}
              <div className="space-y-6">
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {lang === "en" ? "SMS Credit Balance" : "Salio la Mikopo ya SMS"}
                    </p>
                    <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                      {smsCredits.toLocaleString()} <span className="text-sm font-semibold text-slate-500">SMS</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === "en" ? "Average cost: TZS 10 per SMS alert" : "Gharama ya wastani: TZS 10 kwa kila SMS"}
                    </p>

                    <button 
                      onClick={() => setTopupOpen(true)}
                      className="mt-4 w-full rounded-lg bg-[#1f9c88] hover:bg-[#177d6d] text-white px-4 py-2 text-sm font-bold shadow-sm transition"
                    >
                      {lang === "en" ? "Top Up SMS Credits" : "Nunua Mikopo ya SMS"}
                    </button>
                  </div>
                </GlassCard>

                <GlassCard className="rounded-xl border border-slate-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    {lang === "en" ? "SMS API Status" : "Hali ya API ya SMS"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{lang === "en" ? "Connected to BlessedSMS Server (Latency 45ms)" : "Imeunganishwa na BlessedSMS (Muda 45ms)"}</span>
                  </div>
                </GlassCard>
              </div>

              {/* MOCK SMS TOPUP MODAL */}
              {topupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100 relative animate-in scale-in duration-200">
                    <button 
                      onClick={() => setTopupOpen(false)} 
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                      {lang === "en" ? "Top Up SMS Credits" : "Nunua Mikopo ya SMS"}
                    </h3>

                    <form onSubmit={handleTopup} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {lang === "en" ? "Select Bundle Amount" : "Chagua Kiasi cha Kifurushi"}
                        </label>
                        <select 
                          value={topupAmount} 
                          onChange={(e) => setTopupAmount(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#1f9c88] focus:outline-none"
                        >
                          <option value="10000">TZS 10,000 (1,000 SMS)</option>
                          <option value="25000">TZS 25,000 (2,500 SMS)</option>
                          <option value="50000">TZS 50,000 (5,000 SMS)</option>
                        </select>
                      </div>

                      <SettingsField 
                        label={lang === "en" ? "M-Pesa Number for Paybill Push" : "Namba ya M-Pesa kwa Ajili ya Malipo"} 
                        value={topupNumber}
                        onChange={setTopupNumber}
                      />

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-500">
                        {lang === "en" 
                          ? "Submitting will trigger a secure M-Pesa STK Push request on your phone. Enter your PIN to complete transaction."
                          : "Kutuma kutatuma ombi salama la malipo la M-Pesa STK kwenye simu yako. Weka PIN kukamilisha."
                        }
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setTopupOpen(false)}
                          className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition"
                        >
                          {lang === "en" ? "Cancel" : "Ghairi"}
                        </button>
                        <button 
                          type="submit"
                          disabled={topupStatus === "sending"}
                          className="rounded-lg bg-[#1f9c88] hover:bg-[#177d6d] text-white px-4 py-2 text-xs font-bold shadow-sm transition disabled:opacity-50"
                        >
                          {topupStatus === "sending" ? (lang === "en" ? "Requesting..." : "Inaomba...") : (lang === "en" ? "Purchase" : "Nunua Sasa")}
                        </button>
                      </div>
                    </form>

                    {topupStatus === "success" && (
                      <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                        <Check className="h-10 w-10 text-emerald-600 bg-emerald-50 rounded-full p-2 mb-3" />
                        <h4 className="text-base font-bold text-slate-800">
                          {lang === "en" ? "Top Up Request Triggered!" : "Ombi la Malipo Limeanzishwa!"}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">
                          {lang === "en" ? "Please check your phone for the M-Pesa PIN prompt to finalize the payment." : "Tafadhali kagua simu yako kuweka PIN ya M-Pesa ili kukamilisha malipo."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        },

        // ================= TAB 6: API KEYS =================
        { 
          key: "apikeys", 
          label: lang === "en" ? "Developer API Keys" : "Funguo za API", 
          render: () => (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* API Keys List */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <Key className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "Developer Integrations API Keys" : "Funguo za API za Ushirikiano"}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {apiKeys.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <Server className="h-8 w-8 mx-auto text-slate-300" />
                        <p className="text-sm font-semibold">{lang === "en" ? "No Developer API keys generated yet." : "Hakuna funguo za API zilizotengenezwa bado."}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {apiKeys.map((k) => (
                          <div key={k.id} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 relative hover:border-slate-300 transition">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-0.5">
                                <h3 className="text-sm font-bold text-slate-800">{k.name}</h3>
                                <p className="text-xs text-slate-400">
                                  {lang === "en" ? `Created on ${k.created}` : `Ilitengenezwa ${k.created}`}
                                </p>
                              </div>
                              <button 
                                onClick={() => handleDeleteKey(k.id)}
                                className="text-slate-400 hover:text-red-600 transition" 
                                title="Revoke Key"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 text-xs justify-between">
                              <div className="space-y-1">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider block">API Token</span>
                                <code className="bg-slate-50 border border-slate-150 rounded px-2 py-1 font-mono text-slate-800 select-all block text-left">
                                  {k.token}
                                </code>
                              </div>

                              <div className="space-y-1 text-left sm:text-right">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider block">
                                  {lang === "en" ? "Rate Limit" : "Kikomo cha API"}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {k.limit} {lang === "en" ? "requests/min" : "maombi/dakika"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-100">
                              {k.scopes.map((s) => (
                                <span key={s} className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-150">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Generate New API Key Panel */}
              <div className="space-y-6">
                <GlassCard className="rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <ShieldCheck className="h-5 w-5 text-[#1f9c88]" />
                    <h2 className="text-base font-semibold text-slate-800">
                      {lang === "en" ? "Generate API Key" : "Tengeneza Ufunguo wa API"}
                    </h2>
                  </div>

                  <form onSubmit={handleCreateKey} className="space-y-4">
                    <SettingsField 
                      label={lang === "en" ? "Key Description Name" : "Maelezo ya Jina la Ufunguo"} 
                      placeholder="e.g. ERP Mobile App Integration"
                      value={newKeyName}
                      onChange={setNewKeyName}
                    />

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                        {lang === "en" ? "Permission Scopes" : "Upeo wa Ruhusa"}
                      </label>
                      <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="scope-cat-read"
                            checked={newKeyScopes["catalog:read"]}
                            onChange={(e) => setNewKeyScopes({...newKeyScopes, "catalog:read": e.target.checked})}
                            className="rounded text-[#1f9c88] focus:ring-[#1f9c88] h-4 w-4"
                          />
                          <label htmlFor="scope-cat-read" className="text-xs font-medium text-slate-700">catalog:read</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="scope-ord-read"
                            checked={newKeyScopes["orders:read"]}
                            onChange={(e) => setNewKeyScopes({...newKeyScopes, "orders:read": e.target.checked})}
                            className="rounded text-[#1f9c88] focus:ring-[#1f9c88] h-4 w-4"
                          />
                          <label htmlFor="scope-ord-read" className="text-xs font-medium text-slate-700">orders:read</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="scope-ord-write"
                            checked={newKeyScopes["orders:write"]}
                            onChange={(e) => setNewKeyScopes({...newKeyScopes, "orders:write": e.target.checked})}
                            className="rounded text-[#1f9c88] focus:ring-[#1f9c88] h-4 w-4"
                          />
                          <label htmlFor="scope-ord-write" className="text-xs font-medium text-slate-700">orders:write</label>
                        </div>
                      </div>
                    </div>

                    <SettingsField 
                      label={lang === "en" ? "Rate Limit (req/min)" : "Kikomo cha API (maombi/dakika)"} 
                      type="number"
                      value={newKeyLimit}
                      onChange={setNewKeyLimit}
                    />

                    <button 
                      type="submit"
                      disabled={!newKeyName.trim()}
                      className="w-full rounded-lg bg-[#1f9c88] hover:bg-[#177d6d] text-white px-4 py-2 text-sm font-bold shadow-sm transition disabled:opacity-50"
                    >
                      {lang === "en" ? "Generate Key" : "Tengeneza Ufunguo"}
                    </button>
                  </form>
                </GlassCard>
              </div>
            </div>
          )
        }
      ]} />
    </div>
  );
}

