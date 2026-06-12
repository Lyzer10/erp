import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { useEffect, useState } from "react";

function AppShellWrapper() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = document.cookie
      .split("; ")
      .some((item) => item.trim().startsWith("is_logged_in=true"));

    if (!isLoggedIn) {
      navigate({ to: "/login", replace: true });
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 px-4">
        {/* Subtle background blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        </div>

        <div className="relative text-center">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
          <p className="mt-4 text-sm font-semibold tracking-wide text-slate-600 uppercase">
            Verifying Session
          </p>
          <p className="mt-1 text-xs text-slate-400">Please wait while we secure your connection...</p>
        </div>
      </div>
    );
  }

  return <AppShell />;
}

export const Route = createFileRoute("/_app")({
  component: AppShellWrapper,
});

// Outlet is rendered inside AppShell.
export { Outlet };
