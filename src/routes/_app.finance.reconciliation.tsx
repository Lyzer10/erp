import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { Check } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/finance/reconciliation")({
  head: () => ({ meta: [{ title: "Bank Reconciliation — DeveleERP" }] }),
  component: ReconciliationPage,
});

function ReconciliationPage() {
  const { t, lang } = useTranslate();

  const prepareData = Array.from({ length: 8 }, (_, i) => {
    const originalDesc = ["Deposit", "Withdrawal", "Cheque", "Transfer"][i % 4];
    const desc = lang === "en"
      ? originalDesc
      : originalDesc.replace("Deposit", "Amana").replace("Withdrawal", "Kutoa").replace("Cheque", "Hundi").replace("Transfer", "Uhamisho");

    return {
      date: `2026-06-${String(i + 1).padStart(2, "0")}`,
      ref: `TXN-${100 + i}`,
      desc,
      amount: (500 + i * 220) * 1000,
      matched: i % 2 === 0
    };
  });

  const listData = Array.from({ length: 8 }, (_, i) => ({
    id: `REC-${800 + i}`,
    account: ["KCB", "Equity"][i % 2],
    period: lang === "en" ? `May 2026` : `Mei 2026`,
    prepared: "Aisha Otieno",
    diff: i * 40 * 1000,
    status: ["Completed", "Pending", "Approved"][i % 3]
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t("bankReconciliation")} 
        description={lang === "en" ? "Match bank statements with ledger transactions." : "Linganisha taarifa za benki na kumbukumbu za vitabu vya mahesabu."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "prepare", label: lang === "en" ? "Prepare Reconciliation" : "Tayarisha Usuluhishi", render: () => (
          <GlassCard>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Bank Account" : "Akaunti ya Benki"}</label>
                <select className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm">
                  <option>KCB - 1234567890</option>
                  <option>Equity - 0998877665</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Statement Date" : "Tarehe ya Taarifa"}</label>
                <input type="date" className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Closing Balance" : "Salio la Mwisho"}</label>
                <input type="number" className="mt-1 w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm" placeholder="0.00" />
              </div>
            </div>
            <DataTable searchable={false} pageSize={20} data={prepareData}
              columns={[
                { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
                { key: "ref", header: lang === "en" ? "Reference" : "Kumbukumbu" }, 
                { key: "desc", header: lang === "en" ? "Description" : "Maelezo" },
                { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) },
                { key: "matched", header: lang === "en" ? "Match" : "Suluhisha", render: (r) => r.matched ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <Check className="h-3.5 w-3.5" /> 
                    {lang === "en" ? "Matched" : "Imelingana"}
                  </span>
                ) : (
                  <button className="text-blue-600 hover:underline">
                    {lang === "en" ? "Match" : "Linganisha"}
                  </button>
                )} 
              ]} 
            />
          </GlassCard>
        )},
        { key: "list", label: lang === "en" ? "Reconciliation List" : "Orodha ya Usuluhishi", render: () => (
          <DataTable data={listData}
            columns={[
              { key: "id", header: lang === "en" ? "Recon #" : "Usuluhishi #" }, 
              { key: "account", header: lang === "en" ? "Account" : "Akaunti" }, 
              { key: "period", header: lang === "en" ? "Period" : "Kipindi" }, 
              { key: "prepared", header: lang === "en" ? "Prepared By" : "Imetayarishwa Na" },
              { key: "diff", header: lang === "en" ? "Difference" : "Tofauti", align: "right", render: (r) => currency(r.diff) },
              { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> }
            ]} 
          />
        )},
      ]} />
    </div>
  );
}
