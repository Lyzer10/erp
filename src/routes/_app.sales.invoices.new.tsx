import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/erp/InvoiceForm";

export const Route = createFileRoute("/_app/sales/invoices/new")({
  head: () => ({ meta: [{ title: "Create Invoice — Lumen ERP" }] }),
  component: () => <InvoiceForm variant="invoice" />,
});
