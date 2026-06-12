import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { invoices, customers, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/sales/receipts")({
  head: () => ({ meta: [{ title: "Receipts & Delivery — DeveleERP" }] }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const { t, lang } = useTranslate();

  const receiptsData = invoices.slice(0, 12).map((i, k) => ({ 
    id: `RCP-${4000 + k}`, 
    customer: i.customer, 
    date: i.date, 
    ref: i.id, 
    amount: i.amount * 1000 
  }));

  const deliveryData = customers.slice(0, 10).map((c, k) => ({ 
    id: `DN-${5000 + k}`, 
    customer: c.name, 
    date: c.createdAt || "2026-06-12", 
    items: 3 + k, 
    status: lang === "en" ? "Delivered" : "Imewasilishwa" 
  }));

  const mergeData = invoices.slice(0, 10).map(i => ({
    ...i,
    amount: i.amount * 1000
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Receipts & Delivery" : "Stakabadhi na Uwasilishaji"} 
        description={lang === "en" ? "Customer receipts, delivery notes, and invoice merging." : "Stakabadhi za wateja, hati za uwasilishaji (delivery notes), na kuunganisha ankara."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "receipts", label: lang === "en" ? "Receipts" : "Stakabadhi", render: () => (
          <DataTable data={receiptsData} columns={[
            { key: "id", header: lang === "en" ? "Receipt #" : "Stakabadhi #" }, 
            { key: "customer", header: lang === "en" ? "Customer" : "Mteja" },
            { key: "ref", header: lang === "en" ? "Invoice Ref" : "Rejeo la Ankara" }, 
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
            { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) },
          ]} />
        )},
        { key: "delivery", label: lang === "en" ? "Delivery Notes" : "Hati za Uwasilishaji", render: () => (
          <DataTable data={deliveryData} columns={[
            { key: "id", header: "DN #" }, 
            { key: "customer", header: lang === "en" ? "Customer" : "Mteja" },
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
            { key: "items", header: lang === "en" ? "Items" : "Vitu", align: "right" },
            { key: "status", header: lang === "en" ? "Status" : "Hali" },
          ]} />
        )},
        { key: "merge", label: lang === "en" ? "Merge Invoices" : "Unganisha Ankara", render: () => (
          <DataTable data={mergeData} columns={[
            { key: "id", header: lang === "en" ? "Invoice #" : "Ankara #" }, 
            { key: "customer", header: lang === "en" ? "Customer" : "Mteja" },
            { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
            { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) },
          ]} />
        )},
      ]} />
    </div>
  );
}
