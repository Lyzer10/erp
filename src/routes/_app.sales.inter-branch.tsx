import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/sales/inter-branch")({
  component: () => <ModuleNotEnabled name="Inter-branch Requests" />,
});
