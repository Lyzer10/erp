// Browser-only Excel helpers for the product import. ExcelJS and JSZip are loaded on demand
// so they never weigh down the rest of the app.
import {
  IMPORT_COLUMNS,
  MAX_IMPORT_ROWS,
  PURCHASE_UNITS,
  SELLING_UNITS,
  columnForHeader,
  columnText,
  plainCell,
  type ImportRowInput,
} from "./product-import";
import { categoryLabel, categoryOptions } from "./product-categories";

type Lang = "en" | "sw";

// Every visible word in the workbook, so the file follows the language chosen in the system.
const COPY = {
  en: {
    sheet: "Products",
    lists: "Lists",
    help: "Instructions",
    yes: "Yes",
    no: "No",
    listTitles: ["Categories", "Purchase units", "Selling units", "Yes/No"],
    listErrorTitle: "Choose from the list",
    listError: "Pick a value from the dropdown.",
    dateErrorTitle: "Invalid date",
    dateError: "Enter a real date, for example 2027-06-30.",
    helpHeaders: ["Column", "Required", "What to enter", "Example"],
    helpLines: [
      "Fill one product per row on the Products sheet. Green headers are required.",
      "Rows that match an existing product (same barcode, or same name and strength) update that product after you confirm the preview.",
      "Opening stock is only added for new products. Change stock of existing products with Stock Adjustment.",
      "Photos: put them in a ZIP file named by barcode (6001234567890.jpg) or by product name (Panadol 500mg.jpg) and upload it with this file.",
      `Up to ${MAX_IMPORT_ROWS} products per file.`,
    ],
    templateFile: "develeerp-product-import-template.xlsx",
    exportFile: (date: string) => `develeerp-products-${date}.xlsx`,
  },
  sw: {
    sheet: "Bidhaa",
    lists: "Orodha",
    help: "Maelekezo",
    yes: "Ndiyo",
    no: "Hapana",
    listTitles: ["Makundi", "Vipimo vya kununua", "Vipimo vya kuuza", "Ndiyo/Hapana"],
    listErrorTitle: "Chagua kwenye orodha",
    listError: "Chagua thamani kwenye orodha.",
    dateErrorTitle: "Tarehe si sahihi",
    dateError: "Weka tarehe halisi, mfano 2027-06-30.",
    helpHeaders: ["Safu", "Lazima", "Cha kuandika", "Mfano"],
    helpLines: [
      "Jaza bidhaa moja kwa kila mstari kwenye ukurasa wa Bidhaa. Vichwa vya kijani ni lazima.",
      "Mstari unaolingana na bidhaa iliyopo (barcode ileile, au jina na nguvu ya dawa ileile) utasasisha bidhaa hiyo baada ya kuthibitisha.",
      "Stoo ya kuanzia huongezwa kwa bidhaa mpya tu. Badilisha stoo ya bidhaa zilizopo kupitia Marekebisho ya Stoo.",
      "Picha: ziweke kwenye faili la ZIP zikiwa na jina la barcode (6001234567890.jpg) au la bidhaa (Panadol 500mg.jpg) na uipakie pamoja na faili hili.",
      `Hadi bidhaa ${MAX_IMPORT_ROWS} kwa faili moja.`,
    ],
    templateFile: "develeerp-kiolezo-cha-bidhaa.xlsx",
    exportFile: (date: string) => `develeerp-bidhaa-${date}.xlsx`,
  },
} satisfies Record<Lang, unknown>;

const unitName = (
  value: string,
  units: ReadonlyArray<readonly [string, string, string]>,
  lang: Lang,
) => {
  const unit = units.find(([key]) => key === value);
  return unit ? unit[lang === "en" ? 1 : 2] : value;
};
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
export async function buildProductWorkbook(
  categories: string[],
  existing?: ExportableProduct[],
  lang: Lang = "en",
) {
  const copy = COPY[lang];
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DeveleERP";
  const sheet = workbook.addWorksheet(copy.sheet, { views: [{ state: "frozen", ySplit: 1 }] });
  const lists = workbook.addWorksheet(copy.lists, { state: "hidden" });
  const help = workbook.addWorksheet(copy.help);

  sheet.columns = IMPORT_COLUMNS.map((column) => ({
    header: columnText(column, lang).header,
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
    cell.note = columnText(column, lang).note;
  });

  // Dropdown sources live on a hidden sheet so the lists can be long.
  const listValues: string[][] = [
    categoryOptions(categories).map((category) => categoryLabel(category, lang)),
    PURCHASE_UNITS.map(([key]) => unitName(key, PURCHASE_UNITS, lang)),
    SELLING_UNITS.map(([key]) => unitName(key, SELLING_UNITS, lang)),
    [copy.yes, copy.no],
  ];
  const listColumns = listValues.map((values, index) => [copy.listTitles[index], values] as const);
  listColumns.forEach(([title, values], index) => {
    lists.getCell(1, index + 1).value = title;
    values.forEach((value, row) => (lists.getCell(row + 2, index + 1).value = value));
  });
  const listRange = (index: number, count: number) =>
    `'${copy.lists}'!${columnLetter(index)}$2:${columnLetter(index)}${Math.max(2, count + 1)}`;

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
        errorTitle: copy.listErrorTitle,
        error: copy.listError,
      });
    if (column.kind === "date")
      validations.add(range, {
        type: "date",
        operator: "greaterThan",
        allowBlank: true,
        formulae: [new Date(Date.UTC(2000, 0, 1))],
        showErrorMessage: true,
        errorTitle: copy.dateErrorTitle,
        error: copy.dateError,
      });
  });

  if (existing?.length) {
    for (const product of existing)
      sheet.addRow({
        name: product.name,
        genericName: product.genericName ?? undefined,
        brand: product.brand ?? undefined,
        category: categoryLabel(product.category, lang),
        dosageForm: product.dosageForm ?? undefined,
        strength: product.strength ?? undefined,
        barcode: product.barcode ?? undefined,
        price: product.price,
        cost: product.cost,
        purchaseUnit: unitName(product.purchaseUnit ?? "piece", PURCHASE_UNITS, lang),
        sellingUnit: unitName(product.sellingUnit ?? "piece", SELLING_UNITS, lang),
        unitsPerPurchaseUnit: product.unitsPerPurchaseUnit ?? 1,
        reorder: product.reorder,
        requiresPrescription: product.requiresPrescription ? copy.yes : copy.no,
      });
  }

  help.columns = [
    { header: copy.helpHeaders[0], key: "column", width: 28 },
    { header: copy.helpHeaders[1], key: "required", width: 10 },
    { header: copy.helpHeaders[2], key: "note", width: 70 },
    { header: copy.helpHeaders[3], key: "example", width: 18 },
  ];
  help.getRow(1).font = { bold: true };
  for (const column of IMPORT_COLUMNS)
    help.addRow({
      column: columnText(column, lang).header.replace(" *", ""),
      required: column.required ? copy.yes : "",
      note: columnText(column, lang).note,
      example: column.example,
    });
  help.addRow({});
  for (const line of copy.helpLines) help.addRow({ column: line });

  return workbook;
}

export async function downloadProductWorkbook(
  categories: string[],
  existing: ExportableProduct[] | undefined,
  lang: Lang,
) {
  const workbook = await buildProductWorkbook(categories, existing, lang);
  const date = new Date().toISOString().slice(0, 10);
  await downloadWorkbook(
    workbook,
    existing ? COPY[lang].exportFile(date) : COPY[lang].templateFile,
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
  const sheet =
    workbook.getWorksheet(COPY.en.sheet) ??
    workbook.getWorksheet(COPY.sw.sheet) ??
    workbook.worksheets.find((candidate) => candidate.state !== "hidden");
  if (!sheet) return { rows: [], problems: ["The workbook has no sheets."] };

  const columnKeys = new Map<number, keyof ImportRowInput>();
  sheet.getRow(1).eachCell((cell, index) => {
    const column = columnForHeader(String(plainCell(cell.value) ?? ""));
    if (column) columnKeys.set(index, column.key);
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
