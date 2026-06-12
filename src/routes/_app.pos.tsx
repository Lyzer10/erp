import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ScanLine, ShoppingCart, CreditCard, Sparkles } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/pos")({
  head: () => ({ meta: [{ title: "Point of Sale — DeveleERP" }] }),
  component: PosPage,
});

function PosPage() {
  const router = useRouter();
  const { t, lang } = useTranslate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="glass-panel relative max-w-2xl overflow-hidden rounded-3xl p-12 text-center">
        <div className="relative">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-500 text-white shadow-md">
            <ScanLine className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            {lang === "en" ? "Point of Sale" : "Kituo cha Mauzo (POS)"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {lang === "en" 
              ? "A fast, touch-friendly POS terminal is on the way. Scan, ring up, and accept payments — all from one clean screen." 
              : "Kituo cha mauzo cha haraka na rahisi kutumia kinakuja hivi karibuni. Skena bidhaa na upokee malipo yote kwenye skrini moja nadhifu."
            }
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="glass-card p-4">
              <ShoppingCart className="mx-auto h-6 w-6 text-blue-600" />
              <p className="mt-2 text-xs font-medium">{lang === "en" ? "Quick Checkout" : "Malipo ya Haraka"}</p>
            </div>
            <div className="glass-card p-4">
              <CreditCard className="mx-auto h-6 w-6 text-emerald-600" />
              <p className="mt-2 text-xs font-medium">{lang === "en" ? "Multi-payment" : "Njia Nyingi za Malipo"}</p>
            </div>
            <div className="glass-card p-4">
              <Sparkles className="mx-auto h-6 w-6 text-violet-600" />
              <p className="mt-2 text-xs font-medium">{lang === "en" ? "Offline Mode" : "Nje ya Mtandao"}</p>
            </div>
          </div>

          <button
            onClick={() => router.history.back()}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition"
          >
            {lang === "en" ? "Back" : "Rudi Nyuma"}
          </button>

          <p className="mt-4 text-xs text-muted-foreground">{lang === "en" ? "Coming soon" : "Inakuja hivi karibuni"}</p>
        </div>
      </div>
    </div>
  );
}
