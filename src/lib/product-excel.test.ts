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
