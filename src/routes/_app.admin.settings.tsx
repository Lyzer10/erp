import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { getBusinessSettingsFn, updateBusinessSettingsFn } from "@/lib/api/operations";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/admin/settings")({
  head: () => ({ meta: [{ title: "Business Settings — DeveleERP" }] }),
  loader: () => getBusinessSettingsFn(),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang } = useTranslate();
  const loaded = Route.useLoaderData();
  const [businessName, setBusinessName] = useState(loaded.businessName);
  const [tin, setTin] = useState(loaded.tin || "");
  const [vrn, setVrn] = useState(loaded.vrn || "");
  const [phone, setPhone] = useState(loaded.phone || "");
  const [email, setEmail] = useState(loaded.email || "");
  const [address, setAddress] = useState(loaded.address || "");
  const [taxRate, setTaxRate] = useState(loaded.taxRateBasisPoints / 100);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateBusinessSettingsFn({
        data: {
          businessName,
          tin: tin || undefined,
          vrn: vrn || undefined,
          phone: phone || undefined,
          email,
          address: address || undefined,
          currency: "TZS",
          taxRateBasisPoints: Math.round(taxRate * 100),
        },
      });
      setMessage("Settings saved. New POS sales will use this tax rate.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Business Settings" : "Mipangilio ya Biashara"}
        description={
          lang === "en"
            ? "Identity and tax configuration used by live transactions."
            : "Utambulisho na kodi inayotumika kwenye miamala."
        }
      />
      <form onSubmit={save} className="glass-card max-w-3xl space-y-5 p-6">
        {message && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Business name" value={businessName} setValue={setBusinessName} required />
          <Input label="TIN" value={tin} setValue={setTin} />
          <Input label="VRN" value={vrn} setValue={setVrn} />
          <Input label="Phone" value={phone} setValue={setPhone} />
          <Input label="Email" value={email} setValue={setEmail} type="email" />
          <label className="block text-sm font-semibold">
            Tax rate (%)
            <input
              min={0}
              max={100}
              step={0.01}
              type="number"
              value={taxRate}
              onChange={(event) => setTaxRate(Number(event.target.value))}
              className="input-field mt-1"
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Address
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="input-field mt-1 min-h-24"
          />
        </label>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Important:</strong> Set the tax rate only after confirming the pharmacy’s
          applicable Tanzanian tax/EFD treatment. A value of 0% records no tax.
        </div>
        <button
          disabled={saving}
          className="rounded-xl bg-[#1f9c88] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="input-field mt-1"
      />
    </label>
  );
}
