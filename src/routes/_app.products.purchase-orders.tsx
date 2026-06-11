import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { purchaseOrders, currency } from "@/lib/mock";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/products/purchase-orders")({
  head: () => ({ meta: [{ title: "Purchase Orders — Lumen ERP" }] }),
  component: () => {
    const cols = [
      { key: "id", header: "LPO #" }, { key: "supplier", header: "Supplier" }, { key: "date", header: "Date" },
      { key: "items", header: "Items", align: "right" as const },
      { key: "total", header: "Total", align: "right" as const, render: (r: typeof purchaseOrders[0]) => currency(r.total) },
      { key: "status", header: "Status", render: (r: typeof purchaseOrders[0]) => <StatusPill status={r.status} /> },
    ];
    return (
      <div className="space-y-6">
        <PageHeader title="Purchase Orders (LPO)" description="Create, approve, and reject local purchase orders."
          actions={<button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md"><Plus className="h-4 w-4" />Create LPO</button>} />
        <TabbedPage tabs={[
          { key: "all", label: "All", render: () => <DataTable data={purchaseOrders} columns={cols} /> },
          { key: "approved", label: "Approved", render: () => <DataTable data={purchaseOrders.filter(p => p.status === "Approved")} columns={cols} /> },
          { key: "pending", label: "Pending", render: () => <DataTable data={purchaseOrders.filter(p => p.status === "Pending")} columns={cols} /> },
          { key: "rejected", label: "Rejected", render: () => <DataTable data={purchaseOrders.filter(p => p.status === "Rejected")} columns={cols} /> },
        ]} />
      </div>
    );
  },
});
