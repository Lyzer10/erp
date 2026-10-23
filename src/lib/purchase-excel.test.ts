import assert from "node:assert/strict";
import test from "node:test";
import { buildPurchaseTemplate, readPurchaseWorkbook } from "./purchase-excel";
import { matchPurchaseRows } from "./purchase-import";

const catalog = [
  {
    id: 7,
    name: "Panadol",
    strength: "500mg",
    barcode: "0600111",
    purchaseUnit: "box",
    sellingUnit: "tablet",
    unitsPerPurchaseUnit: 100,
  },
];

test("a filled Swahili purchase template reads back into a converted line", async () => {
  const workbook = await buildPurchaseTemplate(catalog, "sw");
  const sheet = workbook.getWorksheet("Manunuzi")!;
  assert.equal(sheet.getCell("D1").value, "Idadi *");
  sheet.addRow({
    barcode: "0600111",
    quantity: 4,
    quantityIn: "Kipimo cha kununua (mf. boksi)",
    unitCost: 3000,
    batchNumber: "PX-1",
    expiryDate: new Date(Date.UTC(2028, 4, 31)),
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const read = await readPurchaseWorkbook(new File([buffer], "manunuzi.xlsx"), "sw");
  assert.equal(read.problem, undefined);
  const [line] = matchPurchaseRows(read.rows, catalog, "2026-10-23");
  assert.deepEqual(line.errors, []);
  assert.equal(line.productId, 7);
  assert.equal(line.quantity, 400);
  assert.equal(line.unitCost, 30);
  assert.equal(line.expiryDate, "2028-05-31");
});

test("a file without the purchase columns is rejected with a clear message", async () => {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet("Sheet1").addRow(["Name", "Price"]);
  const buffer = await workbook.xlsx.writeBuffer();
  const read = await readPurchaseWorkbook(new File([buffer], "other.xlsx"), "en");
  assert.match(read.problem ?? "", /does not have the purchase template columns/);
});
