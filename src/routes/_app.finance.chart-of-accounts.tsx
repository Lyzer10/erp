import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/finance/chart-of-accounts")({
  component: () => <ModuleNotEnabled name="Chart of Accounts" />,
});
