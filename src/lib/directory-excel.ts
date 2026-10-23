export type DirectoryKind = "customer" | "supplier";
export type DirectoryImportRow = {
  rowNumber: number;
  code?: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  status: "Active" | "Inactive";
};

type Lang = "en" | "sw";
const headers = {
  en: ["Code", "Name *", "Contact person", "Phone", "Email", "Status"],
  sw: ["Namba", "Jina *", "Mtu wa mawasiliano", "Simu", "Barua pepe", "Hali"],
};
const keys = ["code", "name", "contact", "phone", "email", "status"] as const;

async function save(workbook: { xlsx: { writeBuffer: () => Promise<ArrayBuffer> } }, name: string) {
  const bytes = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  Object.assign(document.createElement("a"), { href: url, download: name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadDirectoryWorkbook(kind: DirectoryKind, rows: Array<Record<string, unknown>>, lang: Lang, template = false) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DeveleERP";
  const title = kind === "customer" ? (lang === "en" ? "Customers" : "Wateja") : (lang === "en" ? "Suppliers" : "Wasambazaji");
  const sheet = workbook.addWorksheet(title, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = headers[lang].map((header, index) => ({ header, key: keys[index], width: [20, 28, 25, 18, 30, 14][index] }));
  sheet.getRow(1).height = 28;
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F9C88" } };
    cell.alignment = { vertical: "middle" };
  });
  for (const row of rows) sheet.addRow({ code: row.code, name: row.name, contact: row.contact, phone: row.phone, email: row.email, status: row.status ?? "Active" });
  for (let row = 2; row <= 1001; row++) sheet.getCell(`F${row}`).dataValidation = { type: "list", allowBlank: false, formulae: ['"Active,Inactive"'] };
  const help = workbook.addWorksheet(lang === "en" ? "Instructions" : "Maelekezo");
  help.getColumn(1).width = 100;
  help.addRow([lang === "en" ? "Enter one record per row. Name is required. Code may be left blank for a new record. Status must be Active or Inactive." : "Weka taarifa moja kwa kila mstari. Jina ni lazima. Namba inaweza kuachwa wazi kwa taarifa mpya. Hali iwe Active au Inactive."]);
  help.addRow([lang === "en" ? "Existing records are matched by code. Duplicate email addresses or phone numbers are rejected before anything is saved." : "Taarifa zilizopo zinalinganishwa kwa namba. Barua pepe au simu zinazojirudia zitakataliwa kabla ya kuhifadhi."]);
  const suffix = template ? "template" : new Date().toISOString().slice(0, 10);
  await save(workbook, `develeerp-${kind}s-${suffix}.xlsx`);
}

const cellValue = (value: unknown) => {
  if (value && typeof value === "object" && "text" in value) return String((value as { text: unknown }).text);
  return value == null ? "" : String(value).trim();
};

export async function readDirectoryWorkbook(file: File): Promise<{ rows: DirectoryImportRow[]; errors: string[] }> {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  try { await workbook.xlsx.load(await file.arrayBuffer()); } catch { return { rows: [], errors: ["The Excel file could not be opened."] }; }
  const sheet = workbook.worksheets[0];
  if (!sheet) return { rows: [], errors: ["The workbook has no sheet."] };
  const found = new Map<number, typeof keys[number]>();
  sheet.getRow(1).eachCell((cell, index) => {
    const text = cellValue(cell.value).toLowerCase().replace(" *", "");
    const aliases: Record<string, typeof keys[number]> = { code: "code", namba: "code", name: "name", jina: "name", "contact person": "contact", "mtu wa mawasiliano": "contact", phone: "phone", simu: "phone", email: "email", "barua pepe": "email", status: "status", hali: "status" };
    if (aliases[text]) found.set(index, aliases[text]);
  });
  if (![...found.values()].includes("name")) return { rows: [], errors: ["The required Name column is missing."] };
  const rows: DirectoryImportRow[] = [];
  const errors: string[] = [];
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const values: Record<string, string> = {};
    found.forEach((key, index) => { values[key] = cellValue(row.getCell(index).value); });
    if (!Object.values(values).some(Boolean)) return;
    if (!values.name) errors.push(`Row ${rowNumber}: name is required.`);
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errors.push(`Row ${rowNumber}: email is not valid.`);
    const status = values.status || "Active";
    if (!['Active', 'Inactive'].includes(status)) errors.push(`Row ${rowNumber}: status must be Active or Inactive.`);
    rows.push({ rowNumber, code: values.code || undefined, name: values.name, contact: values.contact || undefined, phone: values.phone || undefined, email: values.email?.toLowerCase() || undefined, status: status as "Active" | "Inactive" });
  });
  if (!rows.length) errors.push("The workbook has no data rows.");
  if (rows.length > 1000) errors.push("A file can contain at most 1,000 rows.");
  return { rows, errors };
}
