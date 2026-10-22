import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { getCurrentUserFn } from "@/lib/api/auth";

function AppShellWrapper() {
  const { user } = Route.useRouteContext();
  return <AppShell user={user} />;
}

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const user = await getCurrentUserFn();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    return { user };
  },
  component: AppShellWrapper,
});

// Outlet is rendered inside AppShell.
export { Outlet };
