// Browser-only Excel template and reader for filling a purchase from a supplier invoice.
import { columnLetter, downloadWorkbook, withoutCellNotes } from "./product-excel";
import { plainCell } from "./product-import";
import {
  PURCHASE_COLUMNS,
  QUANTITY_IN,
  purchaseColumnForHeader,
  type CatalogProduct,
  type PurchaseColumnKey,
} from "./purchase-import";

type Lang = "en" | "sw";
const MAX_LINES = 500;
const SHEET = { en: "Purchase", sw: "Manunuzi" };
const LISTS = { en: "Lists", sw: "Orodha" };

export async function buildPurchaseTemplate(catalog: CatalogProduct[], lang: Lang) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DeveleERP";
  const sheet = workbook.addWorksheet(SHEET[lang], { views: [{ state: "frozen", ySplit: 1 }] });
  const lists = workbook.addWorksheet(LISTS[lang], { state: "hidden" });

  sheet.columns = PURCHASE_COLUMNS.map((column) => ({
    header: column[lang],
    key: column.key,
    width: column.width,
  }));
  sheet.getRow(1).height = 30;
  sheet.getRow(1).eachCell((cell, index) => {
    const column = PURCHASE_COLUMNS[index - 1];
    cell.font = { bold: true, color: { argb: column.required ? "FFFFFFFF" : "FF0F172A" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: column.required ? "FF1F9C88" : "FFE2E8F0" },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.note = lang === "en" ? column.noteEn : column.noteSw;
  });

  const names = [...new Set(catalog.map((product) => product.name))].sort((a, b) =>
    a.localeCompare(b),
  );
  const quantityIn = [QUANTITY_IN.purchase[lang], QUANTITY_IN.selling[lang]];
  names.forEach((name, index) => (lists.getCell(index + 1, 1).value = name));
  quantityIn.forEach((label, index) => (lists.getCell(index + 1, 2).value = label));

  // ExcelJS supports range validations at runtime but its typings omit them.
  const validations = (
    sheet as unknown as {
      dataValidations: { add: (range: string, rule: Record<string, unknown>) => void };
    }
  ).dataValidations;
  const range = (key: PurchaseColumnKey) => {
    const letter = columnLetter(PURCHASE_COLUMNS.findIndex((column) => column.key === key));
    return `${letter}2:${letter}${MAX_LINES + 1}`;
  };
  const listRef = (column: string, count: number) =>
    `'${LISTS[lang]}'!$${column}$1:$${column}$${Math.max(1, count)}`;
  if (names.length)
    validations.add(range("productName"), {
      type: "list",
      allowBlank: true,
      formulae: [listRef("A", names.length)],
      showErrorMessage: false,
    });
  validations.add(range("quantityIn"), {
    type: "list",
    allowBlank: true,
    formulae: [listRef("B", 2)],
    showErrorMessage: true,
    errorTitle: lang === "en" ? "Choose from the list" : "Chagua kwenye orodha",
    error: lang === "en" ? "Pick a value from the dropdown." : "Chagua thamani kwenye orodha.",
  });
  for (const key of ["quantity", "unitCost"] as const)
    sheet.getColumn(PURCHASE_COLUMNS.findIndex((column) => column.key === key) + 1).numFmt =
      "#,##0";
  sheet.getColumn(PURCHASE_COLUMNS.findIndex((column) => column.key === "barcode") + 1).numFmt =
    "@";
  sheet.getColumn(PURCHASE_COLUMNS.findIndex((column) => column.key === "expiryDate") + 1).numFmt =
    "yyyy-mm-dd";

  return workbook;
}

export async function downloadPurchaseTemplate(catalog: CatalogProduct[], lang: Lang) {
  const workbook = await buildPurchaseTemplate(catalog, lang);
  await downloadWorkbook(
    workbook,
    lang === "en" ? "develeerp-purchase-template.xlsx" : "develeerp-kiolezo-cha-manunuzi.xlsx",
  );
}

export type PurchaseSheetRead = {
  rows: Array<{ rowNumber: number; raw: Partial<Record<PurchaseColumnKey, unknown>> }>;
  problem?: string;
};

export async function readPurchaseWorkbook(file: File, lang: Lang): Promise<PurchaseSheetRead> {
  const en = lang === "en";
  const { default: ExcelJS } = await import("exceljs");
  const bytes = await file.arrayBuffer();
  let workbook = new ExcelJS.Workbook();
  try {
    try {
      await workbook.xlsx.load(bytes);
    } catch {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await withoutCellNotes(bytes));
    }
  } catch {
    return {
      rows: [],
      problem: en
        ? "This file could not be opened. Save it as an Excel workbook (.xlsx) and try again."
        : "Faili hili halikuweza kufunguliwa. Lihifadhi kama Excel (.xlsx) kisha ujaribu tena.",
    };
  }
  const sheet =
    workbook.getWorksheet(SHEET.en) ??
    workbook.getWorksheet(SHEET.sw) ??
    workbook.worksheets.find((candidate) => candidate.state !== "hidden");
  if (!sheet)
    return { rows: [], problem: en ? "The workbook has no sheets." : "Faili halina kurasa." };

  const columns = new Map<number, PurchaseColumnKey>();
  sheet.getRow(1).eachCell((cell, index) => {
    const column = purchaseColumnForHeader(String(plainCell(cell.value) ?? ""));
    if (column) columns.set(index, column.key);
  });
  const found = new Set(columns.values());
  const missing = PURCHASE_COLUMNS.filter((column) => column.required && !found.has(column.key));
  if (missing.length || (!found.has("barcode") && !found.has("productName")))
    return {
      rows: [],
      problem: en
        ? "The file does not have the purchase template columns. Download the template and copy your lines into it."
        : "Faili halina safu za kiolezo cha manunuzi. Pakua kiolezo na unakili mistari yako humo.",
    };

  const rows: PurchaseSheetRead["rows"] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const raw: Partial<Record<PurchaseColumnKey, unknown>> = {};
    let hasValue = false;
    columns.forEach((key, index) => {
      const value = plainCell(row.getCell(index).value);
      if (value !== undefined && String(value).trim() !== "") hasValue = true;
      raw[key] = value;
    });
    if (hasValue) rows.push({ rowNumber, raw });
  });
  if (!rows.length)
    return {
      rows,
      problem: en ? "The sheet has no purchase lines." : "Faili halina mistari ya manunuzi.",
    };
  if (rows.length > MAX_LINES)
    return {
      rows: [],
      problem: en
        ? `The file has ${rows.length} lines; the limit is ${MAX_LINES} per purchase.`
        : `Faili lina mistari ${rows.length}; kikomo ni ${MAX_LINES} kwa manunuzi moja.`,
    };
  return { rows };
}
