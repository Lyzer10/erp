import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/hr/staff")({
  component: () => <ModuleNotEnabled name="Human Resources" />,
});
