import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { purchaseOrders, currency } from "@/lib/mock";
import { Plus } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/products/purchase-orders/")({
  head: () => ({ meta: [{ title: "Purchase Orders — DeveleERP" }] }),
  component: PurchaseOrdersPage,
});

function PurchaseOrdersPage() {
  const { t, lang } = useTranslate();

  const cols = [
    { key: "id", header: lang === "en" ? "LPO #" : "LPO #" }, 
    { key: "supplier", header: lang === "en" ? "Supplier" : "Muuzaji" }, 
    { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
    { key: "items", header: lang === "en" ? "Items" : "Vitu", align: "right" as const },
    { key: "total", header: lang === "en" ? "Total" : "Jumla", align: "right" as const, render: (r: typeof purchaseOrders[0]) => currency(r.total) },
    { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r: typeof purchaseOrders[0]) => <StatusPill status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Purchase Orders (LPO)" : "Hati za Manunuzi (LPO)"} 
        description={lang === "en" ? "Create, approve, and reject local purchase orders." : "Tengeneza, idhinisha, na ukatae hati za manunuzi ya ndani (LPO)."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <Link
              to="/products/purchase-orders/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition"
            >
              <Plus className="h-4 w-4" /> 
              {lang === "en" ? "Create LPO" : "Tengeneza LPO"}
            </Link>
          </div>
        } 
      />
      <TabbedPage tabs={[
        { key: "all", label: lang === "en" ? "All" : "Zote", render: () => <DataTable data={purchaseOrders} columns={cols} /> },
        { key: "approved", label: lang === "en" ? "Approved" : "Imeidhinishwa", render: () => <DataTable data={purchaseOrders.filter(p => p.status === "Approved")} columns={cols} /> },
        { key: "pending", label: lang === "en" ? "Pending" : "Inasubiri", render: () => <DataTable data={purchaseOrders.filter(p => p.status === "Pending")} columns={cols} /> },
        { key: "rejected", label: lang === "en" ? "Rejected" : "Imekataliwa", render: () => <DataTable data={purchaseOrders.filter(p => p.status === "Rejected")} columns={cols} /> },
      ]} />
    </div>
  );
}
