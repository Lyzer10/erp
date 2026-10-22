import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/sales/invoices/new")({
  beforeLoad: () => {
    throw redirect({ to: "/pos" });
  },
});
