// Client-safe rules for the Excel product import. The browser uses them to read the
// spreadsheet and the server re-applies them before anything is saved.
import { z } from "zod";

export const PURCHASE_UNITS = [
  ["box", "Box", "Boksi"],
  ["carton", "Carton", "Katoni"],
  ["pack", "Pack", "Pakiti"],
  ["bottle", "Bottle", "Chupa"],
  ["strip", "Strip", "Stripu"],
  ["tube", "Tube", "Tyubu"],
  ["sachet", "Sachet", "Kifuko"],
  ["vial", "Vial", "Kichupa cha dawa"],
  ["ampoule", "Ampoule", "Ampuli"],
  ["piece", "Single piece", "Moja moja"],
] as const;

export const SELLING_UNITS = [
  ["tablet", "Tablet", "Kidonge"],
  ["capsule", "Capsule", "Kapsuli"],
  ["bottle", "Bottle", "Chupa"],
  ["strip", "Strip", "Stripu"],
  ["pack", "Pack", "Pakiti"],
  ["sachet", "Sachet", "Kifuko"],
  ["tube", "Tube", "Tyubu"],
  ["vial", "Vial", "Kichupa cha dawa"],
  ["ampoule", "Ampoule", "Ampuli"],
  ["piece", "Piece", "Moja"],
  ["ml", "Millilitre (ml)", "Mililita (ml)"],
  ["gram", "Gram (g)", "Gramu (g)"],
] as const;

export const MAX_IMPORT_ROWS = 2000;

type ColumnKind = "text" | "money" | "count" | "yesno" | "date" | "purchaseUnit" | "sellingUnit";

export type ImportColumn = {
  key: keyof ImportRowInput;
  header: string;
  kind: ColumnKind;
  required?: boolean;
  width: number;
  note: string;
  example: string | number;
};

// Order here is the column order of the template. Headers ending in * are required.
export const IMPORT_COLUMNS: ImportColumn[] = [
  {
    key: "name",
    header: "Product name *",
    kind: "text",
    required: true,
    width: 28,
    note: "Name shown at the POS.",
    example: "Panadol",
  },
  {
    key: "genericName",
    header: "Generic name",
    kind: "text",
    width: 22,
    note: "Active ingredient.",
    example: "Paracetamol",
  },
  {
    key: "brand",
    header: "Brand / manufacturer",
    kind: "text",
    width: 22,
    note: "Optional.",
    example: "GSK",
  },
  {
    key: "category",
    header: "Category *",
    kind: "text",
    required: true,
    width: 20,
    note: "Pick from the list or type a new one.",
    example: "Painkillers",
  },
  {
    key: "dosageForm",
    header: "Dosage form",
    kind: "text",
    width: 16,
    note: "e.g. Tablet, Syrup, Injection.",
    example: "Tablet",
  },
  {
    key: "strength",
    header: "Strength",
    kind: "text",
    width: 14,
    note: "e.g. 500mg, 5mg/5ml.",
    example: "500mg",
  },
  {
    key: "barcode",
    header: "Barcode",
    kind: "text",
    width: 18,
    note: "Used to match photos and existing products. Format the column as Text so leading zeros are kept.",
    example: "6001234567890",
  },
  {
    key: "price",
    header: "Selling price (TZS) *",
    kind: "money",
    required: true,
    width: 18,
    note: "Whole shillings, per selling unit.",
    example: 200,
  },
  {
    key: "cost",
    header: "Cost price (TZS)",
    kind: "money",
    width: 16,
    note: "Whole shillings. Blank means 0 for new products.",
    example: 120,
  },
  {
    key: "purchaseUnit",
    header: "Purchase unit",
    kind: "purchaseUnit",
    width: 16,
    note: "How you buy it. Pick from the list.",
    example: "Box",
  },
  {
    key: "sellingUnit",
    header: "Selling unit",
    kind: "sellingUnit",
    width: 16,
    note: "How you sell it. Pick from the list.",
    example: "Tablet",
  },
  {
    key: "unitsPerPurchaseUnit",
    header: "Units per purchase unit",
    kind: "count",
    width: 14,
    note: "e.g. 100 tablets in a box.",
    example: 100,
  },
  {
    key: "reorder",
    header: "Reorder level",
    kind: "count",
    width: 12,
    note: "Warn when stock falls to this level.",
    example: 50,
  },
  {
    key: "requiresPrescription",
    header: "Requires prescription",
    kind: "yesno",
    width: 12,
    note: "Yes or No.",
    example: "No",
  },
  {
    key: "openingQuantity",
    header: "Opening stock quantity",
    kind: "count",
    width: 14,
    note: "New products only. Counted in selling units.",
    example: 300,
  },
  {
    key: "batchNumber",
    header: "Batch number",
    kind: "text",
    width: 14,
    note: "New products only. Optional.",
    example: "B2026-01",
  },
  {
    key: "expiryDate",
    header: "Expiry date",
    kind: "date",
    width: 14,
    note: "Required with opening stock. Use YYYY-MM-DD or DD/MM/YYYY.",
    example: "2027-06-30",
  },
];

const text = (max: number) => z.string().trim().min(1).max(max).optional();

export const importRowSchema = z.object({
  rowNumber: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  genericName: text(200),
  brand: text(100),
  category: z.string().trim().min(1).max(100),
  dosageForm: text(100),
  strength: text(100),
  barcode: text(100),
  price: z.number().int().min(0),
  cost: z.number().int().min(0).optional(),
  purchaseUnit: z.enum(PURCHASE_UNITS.map(([value]) => value) as [string, ...string[]]).optional(),
  sellingUnit: z.enum(SELLING_UNITS.map(([value]) => value) as [string, ...string[]]).optional(),
  unitsPerPurchaseUnit: z.number().int().positive().optional(),
  reorder: z.number().int().min(0).optional(),
  requiresPrescription: z.boolean().optional(),
  openingQuantity: z.number().int().positive().optional(),
  batchNumber: text(100),
  expiryDate: z.string().date().optional(),
});

export type ImportRowInput = z.infer<typeof importRowSchema>;

export type ParsedRow = {
  rowNumber: number;
  values: Partial<ImportRowInput>;
  errors: string[];
};

// ExcelJS hands back rich text, formulas and hyperlinks as objects; reduce them to plain values.
export function plainCell(value: unknown): unknown {
  if (value === null || value === undefined) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === "object") {
    const cell = value as Record<string, unknown>;
    if ("result" in cell) return plainCell(cell.result);
    if (Array.isArray(cell.richText))
      return (cell.richText as Array<{ text: string }>).map((part) => part.text).join("");
    if ("text" in cell) return plainCell(cell.text);
    if ("error" in cell) return undefined;
  }
  return value;
}

export function normalizeHeader(header: string) {
  return header.replace(/\*/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function parseWholeNumber(value: unknown, label: string, errors: string[]) {
  if (typeof value === "number") {
    if (!Number.isInteger(value)) errors.push(`${label} must be a whole number.`);
    return Math.round(value);
  }
  const cleaned = String(value).replace(/tzs|tsh|\/=|,|\s/gi, "");
  if (!/^-?\d+(\.0+)?$/.test(cleaned)) {
    errors.push(`${label} "${String(value).trim()}" is not a whole number.`);
    return undefined;
  }
  return Number.parseInt(cleaned, 10);
}

function toIsoDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return null;
  return date.toISOString().slice(0, 10);
}

function parseDate(value: unknown, label: string, errors: string[]) {
  if (value instanceof Date && !Number.isNaN(value.getTime()))
    return value.toISOString().slice(0, 10);
  if (typeof value === "number") {
    // Excel serial date (days since 1899-12-30).
    return new Date(Math.round((value - 25569) * 86400000)).toISOString().slice(0, 10);
  }
  const raw = String(value).trim();
  let iso: string | null = null;
  const ymd = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  const dmy = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (ymd) iso = toIsoDate(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]));
  else if (dmy) iso = toIsoDate(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));
  if (!iso) errors.push(`${label} "${raw}" is not a real date. Use YYYY-MM-DD or DD/MM/YYYY.`);
  return iso ?? undefined;
}

function parseUnit(
  value: unknown,
  units: ReadonlyArray<readonly [string, string, string]>,
  label: string,
  errors: string[],
) {
  const wanted = String(value).trim().toLowerCase();
  const match = units.find((unit) => unit.some((name) => name.toLowerCase() === wanted));
  if (!match) errors.push(`${label} "${String(value).trim()}" is not one of the listed units.`);
  return match?.[0];
}

function parseYesNo(value: unknown, label: string, errors: string[]) {
  if (typeof value === "boolean") return value;
  const wanted = String(value).trim().toLowerCase();
  if (["yes", "y", "ndiyo", "true", "1"].includes(wanted)) return true;
  if (["no", "n", "hapana", "false", "0"].includes(wanted)) return false;
  errors.push(`${label} must be Yes or No.`);
  return undefined;
}

export function parseRow(
  rowNumber: number,
  raw: Partial<Record<keyof ImportRowInput, unknown>>,
): ParsedRow {
  const errors: string[] = [];
  const values: Partial<ImportRowInput> = { rowNumber };
  for (const column of IMPORT_COLUMNS) {
    const cell = plainCell(raw[column.key]);
    const label = column.header.replace(" *", "");
    if (cell === undefined || (typeof cell === "string" && cell.trim() === "")) {
      if (column.required) errors.push(`${label} is missing.`);
      continue;
    }
    let parsed: unknown;
    switch (column.kind) {
      case "money":
      case "count":
        parsed = parseWholeNumber(cell, label, errors);
        if (typeof parsed === "number" && parsed < 0) {
          errors.push(`${label} cannot be negative.`);
          parsed = undefined;
        }
        break;
      case "date":
        parsed = parseDate(cell, label, errors);
        break;
      case "yesno":
        parsed = parseYesNo(cell, label, errors);
        break;
      case "purchaseUnit":
        parsed = parseUnit(cell, PURCHASE_UNITS, label, errors);
        break;
      case "sellingUnit":
        parsed = parseUnit(cell, SELLING_UNITS, label, errors);
        break;
      default:
        parsed = (cell instanceof Date ? cell.toISOString().slice(0, 10) : String(cell))
          .replace(/\s+/g, " ")
          .trim();
    }
    if (parsed !== undefined) (values as Record<string, unknown>)[column.key] = parsed;
  }
  if (values.openingQuantity === 0) delete values.openingQuantity;
  if (values.openingQuantity && !values.expiryDate)
    errors.push("Expiry date is required when opening stock is given.");
  if (!values.openingQuantity && (values.expiryDate || values.batchNumber))
    errors.push("Opening stock quantity is missing for the batch / expiry given.");
  return { rowNumber, values, errors };
}

// Same name + strength is treated as the same product when there is no barcode.
export function productKey(name: string, strength?: string | null) {
  const clean = (value?: string | null) => (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  return `${clean(name)}|${clean(strength)}`;
}

export function findDuplicateRows(
  rows: Array<Pick<ImportRowInput, "rowNumber" | "name" | "strength" | "barcode">>,
) {
  const errors = new Map<number, string[]>();
  const add = (row: number, message: string) =>
    errors.set(row, [...(errors.get(row) ?? []), message]);
  const byBarcode = new Map<string, number>();
  const byKey = new Map<string, number>();
  for (const row of rows) {
    if (row.barcode) {
      const first = byBarcode.get(row.barcode);
      if (first) add(row.rowNumber, `Barcode ${row.barcode} is also used on row ${first}.`);
      else byBarcode.set(row.barcode, row.rowNumber);
    }
    const key = productKey(row.name, row.strength);
    const first = byKey.get(key);
    if (first) add(row.rowNumber, `Same product name and strength as row ${first}.`);
    else byKey.set(key, row.rowNumber);
  }
  return errors;
}

export const unitLabel = (value: string, units: ReadonlyArray<readonly [string, string, string]>) =>
  units.find(([key]) => key === value)?.[1] ?? value;
