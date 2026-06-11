import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Mobile sidebar drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn(
            "absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div className={cn(
          "absolute inset-y-0 left-0 w-72 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}>
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg bg-white/80 p-1.5 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="glass-nav h-full lg:hidden">
              <MobileSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-20" : "lg:pl-72")}>
        <Topbar onMenuClick={() => setMobileOpen(true)} onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function MobileSidebar({ onNavigate }: Readonly<{ onNavigate: () => void }>) {
  return (
    <div className="[&>aside]:static [&>aside]:flex [&>aside]:h-full [&>aside]:w-72">
      <AppSidebar onNavigate={onNavigate} collapsed={false} />
    </div>
  );
}
