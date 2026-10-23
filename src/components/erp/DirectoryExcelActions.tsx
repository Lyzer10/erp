import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { commitDirectoryImportFn, previewDirectoryImportFn } from "@/lib/api/directory-import";
import { downloadDirectoryWorkbook, readDirectoryWorkbook, type DirectoryKind } from "@/lib/directory-excel";

export function DirectoryExcelActions({ kind, rows, lang, canImport, onImported }: { kind: DirectoryKind; rows: Array<Record<string, unknown>>; lang: "en" | "sw"; canImport: boolean; onImported: () => Promise<void> }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function importFile(file?: File) {
    if (!file) return;
    setBusy(true); setMessage(null);
    try {
      const parsed = await readDirectoryWorkbook(file);
      if (parsed.errors.length) throw new Error(parsed.errors.join("\n"));
      const preview = await previewDirectoryImportFn({ data: { kind, rows: parsed.rows } });
      if (preview.errors.length) throw new Error(preview.errors.join("\n"));
      const question = lang === "en" ? `Import ${preview.creates} new and update ${preview.updates} existing record(s)?` : `Uingize taarifa mpya ${preview.creates} na kusasisha ${preview.updates}?`;
      if (!window.confirm(question)) return;
      const result = await commitDirectoryImportFn({ data: { kind, rows: parsed.rows } });
      await onImported();
      setMessage(lang === "en" ? `${result.created} created, ${result.updated} updated.` : `${result.created} zimeongezwa, ${result.updated} zimesasishwa.`);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Import failed."); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button type="button" onClick={() => void downloadDirectoryWorkbook(kind, [], lang, true)} className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-semibold"><FileSpreadsheet className="h-4 w-4" />{lang === "en" ? "Template" : "Kiolezo"}</button>
      <button type="button" onClick={() => void downloadDirectoryWorkbook(kind, rows, lang)} className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-semibold"><Download className="h-4 w-4" />{lang === "en" ? "Export Excel" : "Pakua Excel"}</button>
      {canImport && <><input ref={fileRef} type="file" accept=".xlsx" className="sr-only" onChange={(event) => void importFile(event.target.files?.[0])} /><button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"><Upload className="h-4 w-4" />{busy ? (lang === "en" ? "Checking..." : "Inakagua...") : (lang === "en" ? "Import Excel" : "Ingiza Excel")}</button></>}
      {message && <p role="status" className="basis-full whitespace-pre-line text-right text-xs text-slate-600">{message}</p>}
    </div>
  );
}
