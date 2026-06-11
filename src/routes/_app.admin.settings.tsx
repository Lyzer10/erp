import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";

const Field = ({ label, value, type = "text" }: { label: string; value: string; type?: string }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <input type={type} defaultValue={value} className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" />
  </div>
);

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Settings" description="System configuration and company information." />
      <TabbedPage tabs={[
        { key: "config", label: "Configurations", render: () => (
          <GlassCard>
            <h3 className="mb-4 text-base font-semibold">System Preferences</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Default Currency" value="USD ($)" />
              <Field label="Fiscal Year Start" value="January" />
              <Field label="Timezone" value="Africa/Nairobi" />
              <Field label="Date Format" value="YYYY-MM-DD" />
              <Field label="Tax Rate (%)" value="16" type="number" />
              <Field label="Invoice Prefix" value="INV-" />
            </div>
            <button className="mt-6 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md">Save Changes</button>
          </GlassCard>
        )},
        { key: "company", label: "Company Info", render: () => (
          <GlassCard>
            <h3 className="mb-4 text-base font-semibold">Company Profile</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company Name" value="Lumen Trading Co." />
              <Field label="Registration #" value="C-128937" />
              <Field label="VAT Number" value="P051234567A" />
              <Field label="Phone" value="+254 700 123 456" />
              <Field label="Email" value="info@lumen.co" />
              <Field label="Website" value="https://lumen.co" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground">Address</label>
              <textarea className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm backdrop-blur" rows={3} defaultValue="Industrial Area, Nairobi, Kenya" />
            </div>
            <button className="mt-6 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md">Update Company</button>
          </GlassCard>
        )},
      ]} />
    </div>
  ),
});
