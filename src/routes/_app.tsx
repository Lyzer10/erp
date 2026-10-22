import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { getCurrentUserFn } from "@/lib/api/auth";
import { MODULE_HOME, MODULE_KEYS, moduleForPath } from "@/lib/modules";

function AppShellWrapper() {
  const { user } = Route.useRouteContext();
  return <AppShell user={user} />;
}

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    const requiredModule = moduleForPath(location.pathname);
    if (requiredModule && !user.modules.includes(requiredModule)) {
      // Redirect before child loaders run so blocked pages never request their data.
      const firstAllowed = MODULE_KEYS.find((module) => user.modules.includes(module));
      if (location.pathname === "/" && firstAllowed) throw redirect({ href: MODULE_HOME[firstAllowed] });
      throw redirect({ to: "/access-denied" });
    }
    return { user };
  },
  component: AppShellWrapper,
});
