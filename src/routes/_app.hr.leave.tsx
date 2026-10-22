import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/hr/leave")({
  component: () => <ModuleNotEnabled name="Leave Management" />,
});
