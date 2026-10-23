// Browser-only Excel helpers for the product import. ExcelJS and JSZip are loaded on demand
// so they never weigh down the rest of the app.
import {
  IMPORT_COLUMNS,
  MAX_IMPORT_ROWS,
  PURCHASE_UNITS,
  SELLING_UNITS,
  normalizeHeader,
  plainCell,
  unitLabel,
  type ImportRowInput,
} from "./product-import";

const SHEET = "Products";
const BRAND = "FF1F9C88";

export type ExportableProduct = {
  name: string;
  genericName?: string | null;
  brand?: string | null;
  category: string;
  dosageForm?: string | null;
  strength?: string | null;
  barcode?: string | null;
  price: number;
  cost: number;
  purchaseUnit?: string | null;
  sellingUnit?: string | null;
  unitsPerPurchaseUnit?: number | null;
  reorder: number;
  requiresPrescription?: boolean | null;
};

function columnLetter(index: number) {
  let letter = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26))
    letter = String.fromCharCode(65 + ((n - 1) % 26)) + letter;
  return letter;
}

async function downloadWorkbook(
  workbook: { xlsx: { writeBuffer: () => Promise<ArrayBuffer> } },
  fileName: string,
) {
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const link = Object.assign(document.createElement("a"), { href: url, download: fileName });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Builds the import workbook: headers, dropdowns, formats and an instructions sheet.
// With products it becomes an export that can be edited and uploaded again.
export async function buildProductWorkbook(categories: string[], existing?: ExportableProduct[]) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DeveleERP";
  const sheet = workbook.addWorksheet(SHEET, { views: [{ state: "frozen", ySplit: 1 }] });
  const lists = workbook.addWorksheet("Lists", { state: "hidden" });
  const help = workbook.addWorksheet("Instructions");

  sheet.columns = IMPORT_COLUMNS.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width,
  }));
  const header = sheet.getRow(1);
  header.height = 30;
  header.eachCell((cell, index) => {
    const column = IMPORT_COLUMNS[index - 1];
    cell.font = { bold: true, color: { argb: column.required ? "FFFFFFFF" : "FF0F172A" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: column.required ? BRAND : "FFE2E8F0" },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.note = column.note;
  });

  // Dropdown sources live on a hidden sheet so the lists can be long.
  const listColumns: Array<[string, string[]]> = [
    ["Categories", [...new Set(categories)].sort()],
    ["Purchase units", PURCHASE_UNITS.map(([, en]) => en)],
    ["Selling units", SELLING_UNITS.map(([, en]) => en)],
    ["Yes/No", ["Yes", "No"]],
  ];
  listColumns.forEach(([title, values], index) => {
    lists.getCell(1, index + 1).value = title;
    values.forEach((value, row) => (lists.getCell(row + 2, index + 1).value = value));
  });
  const listRange = (index: number, count: number) =>
    `Lists!$${columnLetter(index)}$2:$${columnLetter(index)}$${Math.max(2, count + 1)}`;

  // ExcelJS supports range validations at runtime but its typings omit them.
  const validations = (
    sheet as unknown as {
      dataValidations: { add: (range: string, rule: Record<string, unknown>) => void };
    }
  ).dataValidations;
  const lastRow = MAX_IMPORT_ROWS + 1;
  IMPORT_COLUMNS.forEach((column, index) => {
    const letter = columnLetter(index);
    const range = `${letter}2:${letter}${lastRow}`;
    if (column.key === "barcode") sheet.getColumn(index + 1).numFmt = "@";
    if (column.kind === "money" || column.kind === "count")
      sheet.getColumn(index + 1).numFmt = "#,##0";
    if (column.kind === "date") sheet.getColumn(index + 1).numFmt = "yyyy-mm-dd";
    const list =
      column.key === "category"
        ? { formula: listRange(0, listColumns[0][1].length), strict: false }
        : column.kind === "purchaseUnit"
          ? { formula: listRange(1, PURCHASE_UNITS.length), strict: true }
          : column.kind === "sellingUnit"
            ? { formula: listRange(2, SELLING_UNITS.length), strict: true }
            : column.kind === "yesno"
              ? { formula: listRange(3, 2), strict: true }
              : null;
    if (list)
      validations.add(range, {
        type: "list",
        allowBlank: true,
        formulae: [list.formula],
        // Categories accept new names; the fixed lists reject anything else.
        showErrorMessage: list.strict,
        errorTitle: "Choose from the list",
        error: "Pick a value from the dropdown.",
      });
    if (column.kind === "date")
      validations.add(range, {
        type: "date",
        operator: "greaterThan",
        allowBlank: true,
        formulae: [new Date(Date.UTC(2000, 0, 1))],
        showErrorMessage: true,
        errorTitle: "Invalid date",
        error: "Enter a real date, for example 2027-06-30.",
      });
  });

  if (existing?.length) {
    for (const product of existing)
      sheet.addRow({
        name: product.name,
        genericName: product.genericName ?? undefined,
        brand: product.brand ?? undefined,
        category: product.category,
        dosageForm: product.dosageForm ?? undefined,
        strength: product.strength ?? undefined,
        barcode: product.barcode ?? undefined,
        price: product.price,
        cost: product.cost,
        purchaseUnit: unitLabel(product.purchaseUnit ?? "piece", PURCHASE_UNITS),
        sellingUnit: unitLabel(product.sellingUnit ?? "piece", SELLING_UNITS),
        unitsPerPurchaseUnit: product.unitsPerPurchaseUnit ?? 1,
        reorder: product.reorder,
        requiresPrescription: product.requiresPrescription ? "Yes" : "No",
      });
  }

  help.columns = [
    { header: "Column", key: "column", width: 26 },
    { header: "Required", key: "required", width: 10 },
    { header: "What to enter", key: "note", width: 70 },
    { header: "Example", key: "example", width: 18 },
  ];
  help.getRow(1).font = { bold: true };
  for (const column of IMPORT_COLUMNS)
    help.addRow({
      column: column.header.replace(" *", ""),
      required: column.required ? "Yes" : "",
      note: column.note,
      example: column.example,
    });
  help.addRow({});
  for (const line of [
    "Fill one product per row on the Products sheet. Green headers are required.",
    "Rows that match an existing product (same barcode, or same name and strength) update that product after you confirm the preview.",
    "Opening stock is only added for new products. Change stock of existing products with Stock Adjustment.",
    "Photos: put them in a ZIP file named by barcode (6001234567890.jpg) or by product name (Panadol 500mg.jpg) and upload it with this file.",
    `Up to ${MAX_IMPORT_ROWS} products per file.`,
  ])
    help.addRow({ column: line });

  return workbook;
}

export async function downloadProductWorkbook(
  categories: string[],
  existing?: ExportableProduct[],
) {
  const workbook = await buildProductWorkbook(categories, existing);
  const date = new Date().toISOString().slice(0, 10);
  await downloadWorkbook(
    workbook,
    existing ? `develeerp-products-${date}.xlsx` : "develeerp-product-import-template.xlsx",
  );
}

export type ReadResult = {
  rows: Array<{ rowNumber: number; raw: Record<string, unknown> }>;
  problems: string[];
};

export async function readProductWorkbook(file: File): Promise<ReadResult> {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(await file.arrayBuffer());
  } catch {
    return {
      rows: [],
      problems: [
        "This file could not be opened. Save it as an Excel workbook (.xlsx) and try again.",
      ],
    };
  }
  const sheet = workbook.getWorksheet(SHEET) ?? workbook.worksheets[0];
  if (!sheet) return { rows: [], problems: ["The workbook has no sheets."] };

  const byHeader = new Map(
    IMPORT_COLUMNS.map((column) => [normalizeHeader(column.header), column.key]),
  );
  const columnKeys = new Map<number, keyof ImportRowInput>();
  sheet.getRow(1).eachCell((cell, index) => {
    const key = byHeader.get(normalizeHeader(String(plainCell(cell.value) ?? "")));
    if (key) columnKeys.set(index, key);
  });
  const missing = IMPORT_COLUMNS.filter(
    (column) => column.required && ![...columnKeys.values()].includes(column.key),
  );
  if (missing.length)
    return {
      rows: [],
      problems: [
        `These columns are missing: ${missing.map((column) => column.header.replace(" *", "")).join(", ")}. Download a fresh template and copy your data into it.`,
      ],
    };

  const rows: ReadResult["rows"] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const raw: Record<string, unknown> = {};
    let hasValue = false;
    columnKeys.forEach((key, index) => {
      const value = plainCell(row.getCell(index).value);
      if (value !== undefined && String(value).trim() !== "") hasValue = true;
      raw[key] = value;
    });
    if (hasValue) rows.push({ rowNumber, raw });
  });
  if (!rows.length) return { rows, problems: ["The Products sheet has no product rows."] };
  if (rows.length > MAX_IMPORT_ROWS)
    return {
      rows: [],
      problems: [`The file has ${rows.length} products; the limit is ${MAX_IMPORT_ROWS} per file.`],
    };
  return { rows, problems: [] };
}

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Photo key: the file name without extension, lower-cased, so it can match a barcode or product name.
export const photoKey = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();

export async function readPhotoZip(file: File) {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(file);
  const photos = new Map<string, { name: string; blob: Blob }>();
  const skipped: string[] = [];
  const entries = Object.values(zip.files).filter(
    (entry) => !entry.dir && !entry.name.startsWith("__MACOSX") && !/(^|\/)\./.test(entry.name),
  );
  for (const entry of entries) {
    const name = entry.name.split("/").pop()!;
    const extension = name.split(".").pop()?.toLowerCase() ?? "";
    const type = IMAGE_TYPES[extension];
    if (!type) {
      skipped.push(name);
      continue;
    }
    const blob = new Blob([await entry.async("arraybuffer")], { type });
    photos.set(photoKey(name.replace(/\.[^.]+$/, "")), { name, blob });
  }
  return { photos, skipped };
}
