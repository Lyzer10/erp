import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/store/transfers")({
  component: () => <ModuleNotEnabled name="Stock Transfers" />,
});
