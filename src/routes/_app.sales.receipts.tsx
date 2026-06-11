import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { invoices, customers, currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/sales/receipts")({
  head: () => ({ meta: [{ title: "Receipts & Delivery — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Receipts & Delivery" description="Customer receipts, delivery notes, and invoice merging." />
      <TabbedPage tabs={[
        { key: "receipts", label: "Receipts", render: () => (
          <DataTable data={invoices.slice(0, 12).map((i, k) => ({ id: `RCP-${4000+k}`, customer: i.customer, date: i.date, ref: i.id, amount: i.amount }))}
            columns={[
              { key: "id", header: "Receipt #" }, { key: "customer", header: "Customer" },
              { key: "ref", header: "Invoice Ref" }, { key: "date", header: "Date" },
              { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) },
            ]} />
        )},
        { key: "delivery", label: "Delivery Notes", render: () => (
          <DataTable data={customers.slice(0, 10).map((c, k) => ({ id: `DN-${5000+k}`, customer: c.name, date: c.createdAt, items: 3 + k, status: "Delivered" }))}
            columns={[
              { key: "id", header: "DN #" }, { key: "customer", header: "Customer" },
              { key: "date", header: "Date" }, { key: "items", header: "Items", align: "right" },
              { key: "status", header: "Status" },
            ]} />
        )},
        { key: "merge", label: "Merge Invoices", render: () => (
          <DataTable data={invoices.slice(0, 10)} columns={[
            { key: "id", header: "Invoice #" }, { key: "customer", header: "Customer" },
            { key: "date", header: "Date" },
            { key: "amount", header: "Amount", align: "right", render: (r) => currency(r.amount) },
          ]} />
        )},
      ]} />
    </div>
  ),
});
