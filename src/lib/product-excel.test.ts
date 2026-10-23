import assert from "node:assert/strict";
import test from "node:test";
import { buildProductWorkbook, readProductWorkbook } from "./product-excel";
import { parseRow } from "./product-import";

test("an exported workbook reads back into the same validated products", async () => {
  const workbook = await buildProductWorkbook(
    ["Painkillers"],
    [
      {
        name: "Panadol",
        genericName: "Paracetamol",
        category: "Painkillers",
        strength: "500mg",
        barcode: "0601234567890",
        price: 1500,
        cost: 900,
        purchaseUnit: "box",
        sellingUnit: "tablet",
        unitsPerPurchaseUnit: 100,
        reorder: 50,
        requiresPrescription: false,
      },
    ],
  );
  const buffer = await workbook.xlsx.writeBuffer();
  const { rows, problems } = await readProductWorkbook(new File([buffer], "products.xlsx"));
  assert.deepEqual(problems, []);
  assert.equal(rows.length, 1);
  const { values, errors } = parseRow(rows[0].rowNumber, rows[0].raw);
  assert.deepEqual(errors, []);
  assert.equal(rows[0].rowNumber, 2);
  assert.equal(values.barcode, "0601234567890");
  assert.equal(values.price, 1500);
  assert.equal(values.purchaseUnit, "box");
  assert.equal(values.sellingUnit, "tablet");
  assert.equal(values.requiresPrescription, false);
});

test("an empty template reports that there are no product rows", async () => {
  const workbook = await buildProductWorkbook([]);
  const buffer = await workbook.xlsx.writeBuffer();
  const { problems } = await readProductWorkbook(new File([buffer], "template.xlsx"));
  assert.deepEqual(problems, ["The Products sheet has no product rows."]);
});

test("a Swahili export uses Swahili words and imports back to the same values", async () => {
  const workbook = await buildProductWorkbook(
    ["Antibiotics"],
    [
      {
        name: "Amoxyl",
        category: "Antibiotics",
        strength: "250mg",
        price: 500,
        cost: 300,
        purchaseUnit: "box",
        sellingUnit: "capsule",
        unitsPerPurchaseUnit: 100,
        reorder: 20,
        requiresPrescription: true,
      },
    ],
    "sw",
  );
  const sheet = workbook.getWorksheet("Bidhaa")!;
  assert.equal(sheet.getCell("A1").value, "Jina la bidhaa *");
  assert.equal(sheet.getCell("D2").value, "Viuavijasumu");
  assert.equal(sheet.getCell("J2").value, "Boksi");
  assert.equal(sheet.getCell("N2").value, "Ndiyo");

  const buffer = await workbook.xlsx.writeBuffer();
  const { rows, problems } = await readProductWorkbook(new File([buffer], "bidhaa.xlsx"));
  assert.deepEqual(problems, []);
  const { values, errors } = parseRow(rows[0].rowNumber, rows[0].raw);
  assert.deepEqual(errors, []);
  assert.equal(values.category, "Antibiotics");
  assert.equal(values.purchaseUnit, "box");
  assert.equal(values.sellingUnit, "capsule");
  assert.equal(values.requiresPrescription, true);
});

test("reads files whose cell notes were saved by other tools such as openpyxl", async () => {
  const { default: JSZip } = await import("jszip");
  const workbook = await buildProductWorkbook(
    [],
    [{ name: "Panadol", category: "Pain & fever", price: 200, cost: 100, reorder: 10 }],
  );
  // openpyxl points to notes with absolute paths, which ExcelJS cannot follow.
  const zip = await JSZip.loadAsync(await workbook.xlsx.writeBuffer());
  for (const name of Object.keys(zip.files).filter(
    (n) => n.endsWith(".xml.rels") && n.includes("worksheets/_rels/"),
  )) {
    const xml = await zip.file(name)!.async("string");
    zip.file(name, xml.replace(/Target="\.\.\//g, 'Target="/xl/'));
  }
  const bytes = await zip.generateAsync({ type: "arraybuffer" });
  const { rows, problems } = await readProductWorkbook(new File([bytes], "openpyxl.xlsx"));
  assert.deepEqual(problems, []);
  assert.equal(rows.length, 1);
});
