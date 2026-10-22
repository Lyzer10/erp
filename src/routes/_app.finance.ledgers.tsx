import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/finance/ledgers")({
  component: () => <ModuleNotEnabled name="General Ledger" />,
});
