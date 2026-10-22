import { createFileRoute } from "@tanstack/react-router";
import { ModuleNotEnabled } from "@/components/erp/ModuleNotEnabled";
export const Route = createFileRoute("/_app/finance/payment-vouchers")({
  component: () => <ModuleNotEnabled name="Payment Vouchers" />,
});
