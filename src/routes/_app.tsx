import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";

export const Route = createFileRoute("/_app")({
  component: () => <AppShell />,
});

// Outlet is rendered inside AppShell.
export { Outlet };
