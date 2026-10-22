import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/finance/reconciliation")({
  component: () => <ModuleNotEnabled name="Bank Reconciliation" />,
});
