import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { KpiCard } from "@/components/erp/KpiCard";
import { invoices, currency } from "@/lib/mock";
import { Plus, FileText, Receipt, Clock, CheckCircle2 } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

import { getInvoicesFn } from "@/lib/api/domain";

export const Route = createFileRoute("/_app/sales/invoices/")({
  head: () => ({ meta: [{ title: "Invoices — DeveleERP" }] }),
  loader: () => getInvoicesFn(),
  component: InvoicesPage,
});

function InvoicesPage() {
  const initialInvoicesData = Route.useLoaderData();
  const { t, lang } = useTranslate();
  const invoicesData = (initialInvoicesData as any)?.data || initialInvoicesData || invoices;

  const cols = [
    { key: "id", header: lang === "en" ? "Invoice #" : "Ankara #" },
    { key: "customer", header: lang === "en" ? "Customer" : "Mteja" },
    { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
    { key: "due", header: lang === "en" ? "Hadi Lini" : "Muda Uliobaki" },
    {
      key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right" as const,
      render: (r: typeof invoices[0]) => <span className="font-semibold">{currency(r.amount * 1000)}</span>,
    },
    { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r: typeof invoices[0]) => <StatusPill status={r.status} /> },
  ];
  
  const byType = (type: string) => {
    return (invoicesData as any[])
      .filter((i: any) => i.type === type)
      .map((i: any) => ({ ...i, amount: i.amount * 1000 }));
  };

  const totalIssued = invoices.reduce((s, i) => s + i.amount * 1000, 0);
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const pendingCount = invoices.filter((i) => i.status === "Pending").length;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("invoices")}
        description={lang === "en" ? "Create and manage invoices, proformas, credit notes, and cash sales." : "Tengeneza na usimamie ankara, proforma, hati za mkopo, na mauzo ya taslimu."}
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/80">
              <FileText className="h-4 w-4" /> 
              {lang === "en" ? "Merge Invoices" : "Unganisha Ankara"}
            </button>
            <Link
              to="/sales/invoices/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> 
              {lang === "en" ? "New Invoice" : "Ankara Mpya"}
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={lang === "en" ? "Total Issued" : "Jumla Zilizotolewa"} value={currency(totalIssued)} icon={Receipt} tint="blue" />
        <KpiCard label={lang === "en" ? "Paid" : "Zilizolipwa"} value={String(paidCount)} icon={CheckCircle2} tint="emerald" />
        <KpiCard label={lang === "en" ? "Pending" : "Zinazosubiri"} value={String(pendingCount)} icon={Clock} tint="amber" />
        <KpiCard label={lang === "en" ? "Overdue" : "Zilizopitwa na Muda"} value={String(overdueCount)} icon={Clock} tint="violet" />
      </div>
      <TabbedPage
        tabs={[
          { key: "all", label: lang === "en" ? "All Invoices" : "Ankara Zote", render: () => <DataTable data={byType("Invoice")} columns={cols} /> },
          {
            key: "proforma", label: "Proforma", render: () => (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Link
                    to="/sales/invoices/proforma"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" /> 
                    {lang === "en" ? "New Proforma" : "Proforma Mpya"}
                  </Link>
                </div>
                <DataTable data={byType("Proforma")} columns={cols} />
              </div>
            ),
          },
          { key: "credit", label: lang === "en" ? "Credit Notes" : "Hati za Mkopo", render: () => <DataTable data={byType("Credit Note")} columns={cols} /> },
          { key: "cash", label: lang === "en" ? "Cash Sales" : "Mauzo ya Taslimu", render: () => <DataTable data={byType("Cash Sale")} columns={cols} /> },
        ]}
      />
    </div>
  );
}
