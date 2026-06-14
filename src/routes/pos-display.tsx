import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShoppingBag, Clock } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/pos-display")({
  head: () => ({ meta: [{ title: "Customer Display — DeveleERP" }] }),
  component: PosDisplayPage,
});

function PosDisplayPage() {
  const { lang, t } = useTranslate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [cartData, setCartData] = useState<{
    items: any[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    customer: string;
  } | null>(null);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const data = localStorage.getItem("pos_active_cart");
        if (data) {
          setCartData(JSON.parse(data));
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("pos_cart_updated", handleUpdate);
    handleUpdate();

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("pos_cart_updated", handleUpdate);
    };
  }, []);

  const tzs = (amount: number) => {
    return "TZS " + new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
  };

  const hasItems = cartData && cartData.items.length > 0;

  return (
    <div className="flex h-screen flex-col bg-slate-100 font-sans text-slate-800">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between bg-white px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src="/devele-logo.png" alt="Logo" className="h-9 w-9 object-contain" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800">DeveleERP Terminal</h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{t("customerFacingScreen")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
          <Clock className="h-4 w-4 text-[#1f9c88]" />
          <span>{time}</span>
        </div>
      </header>

      {/* Main split dashboard */}
      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {hasItems ? (
          <>
            {/* Scanned Items list */}
            <div className="flex-1 flex flex-col justify-between p-4 md:p-6 overflow-visible md:overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t("scannedItems")}</h2>
                {cartData.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm transition">
                    {/* Item Image */}
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 flex items-center justify-center">
                      {!imageErrors[item.id] && (item.image || item.image === undefined) ? (
                        <img 
                          src={item.image || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=60"} 
                          alt="" 
                          onError={() => {
                            setImageErrors(prev => ({ ...prev, [item.id]: true }));
                          }}
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</p>
                    </div>

                    <div className="text-center font-bold text-slate-600 text-xs px-3 py-1.5 bg-slate-50 rounded-lg">
                      {t("qty")}: {item.quantity}
                    </div>

                    <div className="text-right w-28 shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 block">{tzs(item.price * item.quantity)}</span>
                      <span className="text-[10px] font-semibold text-slate-400">@ {tzs(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary right panel */}
            <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 md:p-6 flex flex-col justify-between shadow-2xl relative z-10 shrink-0">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("cartSummary")}</h2>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{t("customer")}: {cartData.customer}</p>
                </div>

                <div className="space-y-2 text-sm text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>{t("subtotal")}</span>
                    <span>{tzs(cartData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>{t("discountLabel")}</span>
                    <span>-{tzs(cartData.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("vatDisplay")}</span>
                    <span>{tzs(cartData.tax)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t("totalToPay")}</span>
                  <span className="text-2xl font-black text-[#1f9c88] tabular-nums">{tzs(cartData.total)}</span>
                </div>
                <div className="rounded-2xl bg-[#1f9c88]/10 text-center py-3 text-xs font-bold text-[#1f9c88] animate-pulse">
                  {t("proceedWithPayment")}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white space-y-4 select-none">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner">
              <ShoppingBag className="h-10 w-10 text-[#1f9c88]" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h2 className="text-lg font-bold text-slate-800">{t("welcomeShop")}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {t("itemsWillAppear")}
              </p>
            </div>
            <div className="pt-8 grid grid-cols-2 gap-4 max-w-md w-full">
              <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("weeklyPromo")}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{t("groceriesPromo")}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("customerCare")}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{lang === "en" ? "Support" : "Msaada"}: +255 754 123 456</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="h-10 bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase border-t border-slate-200">
        {t("thankYouShopping")}
      </footer>
    </div>
  );
}
