import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { Plus } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/finance/payment-vouchers")({
  head: () => ({ meta: [{ title: "Payment Vouchers — DeveleERP" }] }),
  component: PaymentVouchersPage,
});

function PaymentVouchersPage() {
  const { t, lang } = useTranslate();

  const vouchers = Array.from({ length: 15 }, (_, i) => {
    const originalAccount = ["Cash", "Bank - KCB", "Bank - Equity"][i % 3];
    const accountName = lang === "en" 
      ? originalAccount 
      : originalAccount.replace("Cash", "Taslimu").replace("Bank", "Benki");
    
    return {
      id: `PV-${7000 + i}`,
      payee: ["Acme Trading", "KCB Bank", "Office Supplies Co", "Skyline Holdings", "Cobalt Hardware"][i % 5],
      date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
      account: accountName,
      amount: Math.round(Math.random() * 8000 + 200) * 1000, // Multiply by 1000 to have realistic TZS values
      status: ["Approved", "Pending", "Approved", "Rejected"][i % 4],
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Payment Vouchers" : "Vocha za Malipo"} 
        description={lang === "en" ? "Authorize and track outgoing payments." : "Idhinisha na ufuatilie malipo yanayotoka."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
              <Plus className="h-4 w-4" />
              {lang === "en" ? "New Voucher" : "Vocha Mpya"}
            </button>
          </div>
        } 
      />
      <DataTable data={vouchers} columns={[
        { key: "id", header: lang === "en" ? "Voucher #" : "Vocha #" }, 
        { key: "payee", header: lang === "en" ? "Payee" : "Mlipwaji" },
        { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
        { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
        { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) },
        { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> },
      ]} />
    </div>
  );
}
