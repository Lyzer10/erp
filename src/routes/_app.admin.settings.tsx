import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";
import { useTranslate } from "@/lib/i18n";

const Field = ({ label, value, type = "text" }: { label: string; value: string; type?: string }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <input type={type} defaultValue={value} className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" />
  </div>
);

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Lumen ERP" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang } = useTranslate();
  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("settings")} 
        description={lang === "en" ? "System configuration and company information." : "Usanidi wa mfumo na taarifa za kampuni."} 
      />
      <TabbedPage tabs={[
        { key: "config", label: lang === "en" ? "Configurations" : "Usanidi", render: () => (
          <GlassCard>
            <h2 className="mb-4 text-base font-semibold">{lang === "en" ? "System Preferences" : "Mapendeleo ya Mfumo"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={lang === "en" ? "Default Currency" : "Sarafu ya Kawaida"} value="USD ($)" />
              <Field label={lang === "en" ? "Fiscal Year Start" : "Mwanzo wa Mwaka wa Fedha"} value="January" />
              <Field label={lang === "en" ? "Timezone" : "Ukanda wa Saa"} value="Africa/Nairobi" />
              <Field label={lang === "en" ? "Date Format" : "Muundo wa Tarehe"} value="YYYY-MM-DD" />
              <Field label={lang === "en" ? "Tax Rate (%)" : "Kiwango cha Kodi (%)"} value="16" type="number" />
              <Field label={lang === "en" ? "Invoice Prefix" : "Kihusishi cha Ankara"} value="INV-" />
            </div>
            <button className="mt-6 rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
              {lang === "en" ? "Save Changes" : "Hifadhi Mabadiliko"}
            </button>
          </GlassCard>
        )},
        { key: "company", label: lang === "en" ? "Company Info" : "Taarifa za Kampuni", render: () => (
          <GlassCard>
            <h2 className="mb-4 text-base font-semibold">{lang === "en" ? "Company Profile" : "Wasifu wa Kampuni"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={lang === "en" ? "Company Name" : "Jina la Kampuni"} value="Lumen Trading Co." />
              <Field label={lang === "en" ? "Registration #" : "Namba ya Usajili"} value="C-128937" />
              <Field label={lang === "en" ? "VAT Number" : "Namba ya VAT"} value="P051234567A" />
              <Field label={lang === "en" ? "Phone" : "Simu"} value="+254 700 123 456" />
              <Field label={lang === "en" ? "Email" : "Barua Pepe"} value="info@lumen.co" />
              <Field label={lang === "en" ? "Website" : "Tovuti"} value="https://lumen.co" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Address" : "Anwani"}</label>
              <textarea className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" rows={3} defaultValue="Industrial Area, Nairobi, Kenya" />
            </div>
            <button className="mt-6 rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
              {lang === "en" ? "Update Company" : "Sasisha Kampuni"}
            </button>
          </GlassCard>
        )},
      ]} />
    </div>
  );
}
