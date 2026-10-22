import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/sales/invoices/proforma")({
  beforeLoad: () => {
    throw redirect({ to: "/sales/invoices" });
  },
});
