import { createFileRoute } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/access-denied")({
  head: () => ({ meta: [{ title: "Access not allowed — DeveleERP" }] }),
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  const { lang } = useTranslate();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center text-center">
      <div>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-700">
          <ShieldX className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold">
          {lang === "en" ? "Access not allowed" : "Huna ruhusa ya kufungua sehemu hii"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {lang === "en"
            ? "Ask your administrator if you need access to this part of the system."
            : "Muulize msimamizi wako kama unahitaji kutumia sehemu hii ya mfumo."}
        </p>
      </div>
    </div>
  );
}
