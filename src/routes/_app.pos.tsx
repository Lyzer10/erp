import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ScanLine, ShoppingCart, CreditCard, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/pos")({
  head: () => ({ meta: [{ title: "Point of Sale — DeveleERP" }] }),
  component: PosPage,
});

function PosPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="glass-panel relative max-w-2xl overflow-hidden rounded-3xl p-12 text-center">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-linear-to-br from-emerald-400/40 to-transparent blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-linear-to-br from-blue-400/40 to-transparent blur-2xl" />
        <div className="relative">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-linear-to-br from-blue-500 to-emerald-500 text-white shadow-2xl shadow-emerald-500/40">
            <ScanLine className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="mt-3 text-base text-muted-foreground">A fast, touch-friendly POS terminal is on the way. Scan, ring up, and accept payments — all from one clean screen.</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="glass-card p-4">
              <ShoppingCart className="mx-auto h-6 w-6 text-blue-600" />
              <p className="mt-2 text-xs font-medium">Quick Checkout</p>
            </div>
            <div className="glass-card p-4">
              <CreditCard className="mx-auto h-6 w-6 text-emerald-600" />
              <p className="mt-2 text-xs font-medium">Multi-payment</p>
            </div>
            <div className="glass-card p-4">
              <Sparkles className="mx-auto h-6 w-6 text-violet-600" />
              <p className="mt-2 text-xs font-medium">Offline Mode</p>
            </div>
          </div>

          <button
            onClick={() => router.history.back()}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30"
          >
            Back
          </button>

          <p className="mt-4 text-xs text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
