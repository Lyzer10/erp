import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/erp/DataTable";
import { PageHeader } from "@/components/erp/PageHeader";
import { getProductsFn } from "@/lib/api/domain";
import {
  commitProductImportFn,
  previewProductImportFn,
  setImportedProductImageFn,
  type PlannedRow,
} from "@/lib/api/product-import";
import { useTranslate } from "@/lib/i18n";
import { resizeProductImage } from "@/lib/image-resize";
import {
  downloadProductWorkbook,
  photoKey,
  readPhotoZip,
  readProductWorkbook,
  type ExportableProduct,
} from "@/lib/product-excel";
import { IMPORT_COLUMNS, parseRow, type ImportRowInput } from "@/lib/product-import";

export const Route = createFileRoute("/_app/products/catalog_/import")({
  head: () => ({ meta: [{ title: "Import Products — DeveleERP" }] }),
  loader: () => getProductsFn(),
  component: ImportPage,
});

type Photo = { name: string; blob: Blob };
type PreviewRow = PlannedRow & { photo?: Photo };
type Stage = "upload" | "preview" | "importing" | "done";
type Filter = "all" | "error" | "create" | "update" | "unchanged";

const FIELD_LABELS = Object.fromEntries(
  IMPORT_COLUMNS.map((column) => [column.key, column.header.replace(" *", "")]),
) as Record<string, string>;

function ImportPage() {
  const { lang } = useTranslate();
  const en = lang === "en";
  const loaded = Route.useLoaderData();
  const products = loaded.data as unknown as ExportableProduct[];
  const categories = useMemo(() => products.map((product) => product.category), [products]);

  const [stage, setStage] = useState<Stage>("upload");
  const [excel, setExcel] = useState<File | null>(null);
  const [zip, setZip] = useState<File | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [rows, setRows] = useState<ImportRowInput[]>([]);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [unusedPhotos, setUnusedPhotos] = useState<string[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [result, setResult] = useState<{
    created: number;
    updated: number;
    unchanged: number;
    photos: number;
    photoFailures: string[];
  } | null>(null);

  async function download(withProducts: boolean) {
    setBusy(withProducts ? "export" : "template");
    try {
      await downloadProductWorkbook(categories, withProducts ? products : undefined, lang);
    } finally {
      setBusy(null);
    }
  }

  async function check() {
    if (!excel) return;
    setBusy("check");
    setProblems([]);
    try {
      const read = await readProductWorkbook(excel);
      if (read.problems.length) {
        setProblems(read.problems);
        return;
      }
      const parsed = read.rows.map(({ rowNumber, raw }) => parseRow(rowNumber, raw));
      const valid = parsed
        .filter((row) => !row.errors.length)
        .map((row) => row.values as ImportRowInput);
      const planned = valid.length ? await previewProductImportFn({ data: { rows: valid } }) : [];
      const plannedByRow = new Map(planned.map((row) => [row.rowNumber, row]));

      const { photos, skipped } = zip
        ? await readPhotoZip(zip)
        : { photos: new Map<string, Photo>(), skipped: [] };
      const used = new Set<string>();
      const findPhoto = (
        row: { barcode?: string; productName: string },
        values: Partial<ImportRowInput>,
      ) => {
        const keys = [
          row.barcode,
          values.barcode,
          values.strength ? `${values.name} ${values.strength}` : undefined,
          values.name,
          row.productName,
        ].filter(Boolean) as string[];
        for (const key of keys) {
          const photo = photos.get(photoKey(key));
          if (photo) {
            used.add(photoKey(key));
            return photo;
          }
        }
        return undefined;
      };

      const combined: PreviewRow[] = parsed.map((row) => {
        const plannedRow: PlannedRow = plannedByRow.get(row.rowNumber) ?? {
          rowNumber: row.rowNumber,
          action: "error",
          productName: row.values.name ?? (en ? "(no name)" : "(hakuna jina)"),
          barcode: row.values.barcode,
          changes: [],
          errors: [],
          warnings: [],
        };
        const errors = [...row.errors, ...plannedRow.errors];
        return {
          ...plannedRow,
          action: errors.length ? "error" : plannedRow.action,
          errors,
          photo: findPhoto(plannedRow, row.values),
        };
      });
      setRows(valid);
      setPreview(combined);
      setUnusedPhotos([
        ...[...photos.entries()].filter(([key]) => !used.has(key)).map(([, photo]) => photo.name),
        ...skipped,
      ]);
      setFilter(combined.some((row) => row.action === "error") ? "error" : "all");
      setStage("preview");
    } catch (cause) {
      setProblems([cause instanceof Error ? cause.message : String(cause)]);
    } finally {
      setBusy(null);
    }
  }

  async function runImport() {
    setStage("importing");
    setBusy(en ? "Saving products…" : "Inahifadhi bidhaa…");
    try {
      const saved = await commitProductImportFn({ data: { rows } });
      const photoByRow = new Map(
        preview.filter((row) => row.photo).map((row) => [row.rowNumber, row.photo!]),
      );
      const withPhotos = saved.products.filter((product) => photoByRow.has(product.rowNumber));
      const photoFailures: string[] = [];
      let uploaded = 0;
      for (const [index, product] of withPhotos.entries()) {
        setBusy(
          en
            ? `Uploading photos ${index + 1} of ${withPhotos.length}…`
            : `Inapakia picha ${index + 1} kati ya ${withPhotos.length}…`,
        );
        const photo = photoByRow.get(product.rowNumber)!;
        try {
          const imageUpload = await resizeProductImage(photo.blob, photo.name);
          await setImportedProductImageFn({ data: { productId: product.productId, imageUpload } });
          uploaded++;
        } catch (cause) {
          photoFailures.push(
            `${product.name}: ${cause instanceof Error ? cause.message : String(cause)}`,
          );
        }
      }
      setResult({ ...saved, photos: uploaded, photoFailures });
      setStage("done");
    } catch (cause) {
      setProblems([cause instanceof Error ? cause.message : String(cause)]);
      setStage("preview");
    } finally {
      setBusy(null);
    }
  }

  const counts = {
    all: preview.length,
    error: preview.filter((row) => row.action === "error").length,
    create: preview.filter((row) => row.action === "create").length,
    update: preview.filter((row) => row.action === "update").length,
    unchanged: preview.filter((row) => row.action === "unchanged").length,
  };
  const visible = filter === "all" ? preview : preview.filter((row) => row.action === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title={en ? "Import products from Excel" : "Ingiza bidhaa kutoka Excel"}
        description={
          en
            ? "Add or update many products at once. Nothing is saved until every row is correct and you confirm."
            : "Ongeza au sasisha bidhaa nyingi kwa pamoja. Hakuna kinachohifadhiwa mpaka kila mstari uwe sahihi na uthibitishe."
        }
        actions={
          <Link
            to="/products/catalog"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" /> {en ? "Back to catalog" : "Rudi kwenye orodha"}
          </Link>
        }
      />

      {!loaded.canDelete && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          {en
            ? "Only administrators can import products. You can still download the template and export."
            : "Wasimamizi pekee wanaweza kuingiza bidhaa. Bado unaweza kupakua kiolezo na kuhamisha."}
        </p>
      )}

      {problems.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          {problems.map((problem) => (
            <p key={problem} className="font-semibold">
              {problem}
            </p>
          ))}
        </div>
      )}

      {(stage === "upload" || stage === "preview") && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="glass-card space-y-3 p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1f9c88] text-xs text-white">
                1
              </span>
              {en ? "Get the Excel file" : "Pata faili la Excel"}
            </h2>
            <p className="text-sm text-slate-600">
              {en
                ? "Use the template for new products, or export your current products to edit prices and details."
                : "Tumia kiolezo kwa bidhaa mpya, au hamisha bidhaa zilizopo ili kubadilisha bei na taarifa."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void download(false)}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {busy === "template" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {en ? "Download template" : "Pakua kiolezo"}
              </button>
              <button
                type="button"
                onClick={() => void download(true)}
                disabled={busy !== null || !products.length}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-60"
              >
                {busy === "export" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                {en ? `Export ${products.length} products` : `Hamisha bidhaa ${products.length}`}
              </button>
            </div>
          </section>

          <section className="glass-card space-y-3 p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1f9c88] text-xs text-white">
                2
              </span>
              {en ? "Upload and check" : "Pakia na kagua"}
            </h2>
            <FilePick
              label={en ? "Excel file (.xlsx)" : "Faili la Excel (.xlsx)"}
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              file={excel}
              onChange={(file) => {
                setExcel(file);
                setStage("upload");
              }}
              icon={FileSpreadsheet}
            />
            <FilePick
              label={
                en
                  ? "Photos ZIP (optional) — name each photo by barcode or product name"
                  : "ZIP ya picha (si lazima) — ipe kila picha jina la barcode au la bidhaa"
              }
              accept=".zip,application/zip"
              file={zip}
              onChange={(file) => {
                setZip(file);
                setStage("upload");
              }}
              icon={ImageIcon}
            />
            <button
              type="button"
              onClick={() => void check()}
              disabled={!excel || busy !== null || !loaded.canDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {busy === "check" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {en ? "Check file" : "Kagua faili"}
            </button>
          </section>
        </div>
      )}

      {stage === "preview" && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-bold">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1f9c88] text-xs text-white">
              3
            </span>
            {en ? "Review before importing" : "Kagua kabla ya kuingiza"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(
              [
                [
                  "all",
                  en ? "All rows" : "Mistari yote",
                  "border-slate-300 bg-slate-800 text-white",
                ],
                ["error", en ? "Problems" : "Matatizo", "border-rose-300 bg-rose-600 text-white"],
                ["create", en ? "New" : "Mpya", "border-emerald-300 bg-emerald-600 text-white"],
                ["update", en ? "Updates" : "Masasisho", "border-blue-300 bg-blue-600 text-white"],
                [
                  "unchanged",
                  en ? "No change" : "Hakuna badiliko",
                  "border-slate-300 bg-slate-500 text-white",
                ],
              ] as const
            ).map(([key, label, activeTone]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  filter === key
                    ? activeTone
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
                <span className="rounded-full bg-black/10 px-1.5">{counts[key]}</span>
              </button>
            ))}
          </div>

          {unusedPhotos.length > 0 && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {en ? "Photos not matched to any row: " : "Picha zisizolingana na mstari wowote: "}
              {unusedPhotos.slice(0, 15).join(", ")}
              {unusedPhotos.length > 15 ? "…" : ""}
            </p>
          )}

          <DataTable
            data={visible}
            pageSize={25}
            columns={[
              { key: "rowNumber", header: en ? "Row" : "Mstari" },
              {
                key: "productName",
                header: en ? "Product" : "Bidhaa",
                render: (row: PreviewRow) => (
                  <span className="font-semibold">
                    {row.productName}
                    {row.barcode && (
                      <span className="block text-xs font-normal text-slate-500">
                        {row.barcode}
                      </span>
                    )}
                  </span>
                ),
              },
              {
                key: "action",
                header: en ? "Result" : "Matokeo",
                render: (row: PreviewRow) => <ActionBadge action={row.action} en={en} />,
              },
              {
                key: "details",
                header: en ? "Details" : "Maelezo",
                render: (row: PreviewRow) => (
                  <div className="space-y-1 text-xs">
                    {row.errors.map((error) => (
                      <p key={error} className="font-semibold text-rose-700">
                        {error}
                      </p>
                    ))}
                    {row.changes.map((change) => (
                      <p key={change.field} className="text-slate-700">
                        <span className="font-semibold">
                          {FIELD_LABELS[change.field] ?? change.field}:
                        </span>{" "}
                        {change.from} →{" "}
                        <span className="font-semibold text-blue-700">{change.to}</span>
                      </p>
                    ))}
                    {row.warnings.map((warning) => (
                      <p key={warning} className="text-amber-700">
                        {warning}
                      </p>
                    ))}
                  </div>
                ),
              },
              {
                key: "photo",
                header: en ? "Photo" : "Picha",
                render: (row: PreviewRow) =>
                  row.photo ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {row.photo.name}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  ),
              },
            ]}
          />

          <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-slate-700">
              {counts.error
                ? en
                  ? `${counts.error} row(s) have problems. Fix them in Excel and check the file again — nothing is saved until all rows are correct.`
                  : `Mistari ${counts.error} ina matatizo. Irekebishe kwenye Excel na ukague tena — hakuna kitakachohifadhiwa mpaka mistari yote iwe sahihi.`
                : en
                  ? `Ready: ${counts.create} new, ${counts.update} updated, ${counts.unchanged} unchanged.`
                  : `Tayari: ${counts.create} mpya, ${counts.update} zitasasishwa, ${counts.unchanged} hazibadiliki.`}
            </p>
            <button
              type="button"
              onClick={() => void runImport()}
              disabled={
                counts.error > 0 ||
                (counts.create + counts.update === 0 && !preview.some((row) => row.photo))
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              <Upload className="h-4 w-4" /> {en ? "Import products" : "Ingiza bidhaa"}
            </button>
          </div>
        </section>
      )}

      {stage === "importing" && (
        <div className="glass-card flex items-center gap-3 p-6 text-sm font-semibold text-slate-700">
          <Loader2 className="h-5 w-5 animate-spin text-[#1f9c88]" />
          {busy}
        </div>
      )}

      {stage === "done" && result && (
        <section className="glass-card space-y-4 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
            <CheckCircle2 className="h-6 w-6" /> {en ? "Import complete" : "Uingizaji umekamilika"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label={en ? "New products" : "Bidhaa mpya"} value={result.created} />
            <Stat label={en ? "Updated" : "Zimesasishwa"} value={result.updated} />
            <Stat label={en ? "Unchanged" : "Hazijabadilika"} value={result.unchanged} />
            <Stat label={en ? "Photos added" : "Picha zimeongezwa"} value={result.photos} />
          </div>
          {result.photoFailures.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">
                {en
                  ? "The products were saved, but these photos could not be added. Add them from the product page:"
                  : "Bidhaa zimehifadhiwa, lakini picha hizi hazikuongezwa. Ziongeze kwenye ukurasa wa bidhaa:"}
              </p>
              {result.photoFailures.map((failure) => (
                <p key={failure}>{failure}</p>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Link
              to="/products/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f9c88] px-4 py-2 text-sm font-bold text-white"
            >
              {en ? "View catalog" : "Angalia orodha"}
            </Link>
            <button
              type="button"
              onClick={() => {
                setStage("upload");
                setExcel(null);
                setZip(null);
                setPreview([]);
                setResult(null);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              {en ? "Import another file" : "Ingiza faili lingine"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function FilePick({
  label,
  accept,
  file,
  onChange,
  icon: Icon,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  icon: typeof FileSpreadsheet;
}) {
  return (
    <label className="block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-white p-3 text-sm hover:border-[#1f9c88]">
      <span className="flex items-center gap-2 font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-[#1f9c88]" /> {label}
      </span>
      <span className="mt-1 block truncate text-xs text-slate-500">{file ? file.name : "—"}</span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}

function ActionBadge({ action, en }: { action: PlannedRow["action"]; en: boolean }) {
  const styles: Record<PlannedRow["action"], [string, string, string]> = {
    error: ["bg-rose-600 text-white", "Problem", "Tatizo"],
    create: ["bg-emerald-100 text-emerald-800", "New", "Mpya"],
    update: ["bg-blue-100 text-blue-800", "Update", "Sasisha"],
    unchanged: ["bg-slate-100 text-slate-600", "No change", "Hakuna badiliko"],
  };
  const [tone, enLabel, swLabel] = styles[action];
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold ${tone}`}>
      {en ? enLabel : swLabel}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
