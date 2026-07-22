import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";

function AppShellWrapper() {
  return <AppShell />;
}

export const Route = createFileRoute("/_app")({
  component: AppShellWrapper,
});

// Outlet is rendered inside AppShell.
export { Outlet };
