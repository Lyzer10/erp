import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/finance/bank-cash")({
  component: () => <ModuleNotEnabled name="Bank & Cash" />,
});
