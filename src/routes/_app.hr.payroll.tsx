import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/hr/payroll")({
  component: () => <ModuleNotEnabled name="Payroll" />,
});
