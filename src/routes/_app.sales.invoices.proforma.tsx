import { createFileRoute } from "@tanstack/react-router";
import { InvoiceForm } from "@/components/erp/InvoiceForm";

export const Route = createFileRoute("/_app/sales/invoices/proforma")({
  head: () => ({ meta: [{ title: "Create Proforma — Lumen ERP" }] }),
  component: () => <InvoiceForm variant="proforma" />,
});
