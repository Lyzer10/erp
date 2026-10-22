import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";

export function ModuleNotEnabled({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
      <Construction className="mx-auto h-10 w-10 text-amber-700" />
      <h1 className="mt-4 text-xl font-black text-amber-950">{name} is not enabled</h1>
      <p className="mt-2 text-sm text-amber-900">
        This prototype module was removed from production navigation because it was not backed by
        reliable database transactions. No dummy figures are being shown.
      </p>
      <Link
        to="/"
        className="mt-5 inline-block rounded-xl bg-amber-900 px-4 py-2 text-sm font-bold text-white"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
