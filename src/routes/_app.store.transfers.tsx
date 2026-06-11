import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { currency } from "@/lib/mock";

const make = (prefix: string, n = 10) => Array.from({ length: n }, (_, i) => ({
  id: `${prefix}-${1000 + i}`, from: ["Main","Westlands","Mombasa"][i%3], to: ["Westlands","Mombasa","Main"][i%3],
  items: 3 + i%6, value: 500 + i*420, date: `2026-06-${String((i%28)+1).padStart(2,"0")}`,
  status: ["Pending","Completed","Approved"][i%3],
}));

export const Route = createFileRoute("/_app/store/transfers")({
  head: () => ({ meta: [{ title: "Store Transfers — Lumen ERP" }] }),
  component: () => {
    const cols = [
      { key: "id", header: "Ref" }, { key: "from", header: "From" }, { key: "to", header: "To" },
      { key: "items", header: "Items", align: "right" as const },
      { key: "value", header: "Value", align: "right" as const, render: (r: any) => currency(r.value) },
      { key: "date", header: "Date" }, { key: "status", header: "Status", render: (r: any) => <StatusPill status={r.status} /> },
    ];
    return (
      <div className="space-y-6">
        <PageHeader title="Store Transfers" description="Transfers between branches, stores, and receipts." />
        <TabbedPage tabs={[
          { key: "ib", label: "Inter Branch", render: () => <DataTable data={make("IBT")} columns={cols} /> },
          { key: "is", label: "Inter Store", render: () => <DataTable data={make("IST")} columns={cols} /> },
          { key: "received", label: "Received Purchases", render: () => <DataTable data={make("RCV").map(r=>({...r, from:"Supplier"}))} columns={cols} /> },
          { key: "issued", label: "Issued", render: () => <DataTable data={make("ISS")} columns={cols} /> },
        ]} />
      </div>
    );
  },
});
