import assert from "node:assert/strict";
import test from "node:test";
import { findDuplicateRows, parseRow, plainCell, productKey } from "./product-import";

const base = { name: "Panadol", category: "Painkillers", price: 200 };

test("parses a complete row and normalises units, money and dates", () => {
  const { values, errors } = parseRow(2, {
    ...base,
    price: "1,500",
    cost: "TZS 900",
    purchaseUnit: "box",
    sellingUnit: "Kidonge",
    requiresPrescription: "Ndiyo",
    openingQuantity: 300,
    expiryDate: "30/06/2027",
  });
  assert.deepEqual(errors, []);
  assert.equal(values.price, 1500);
  assert.equal(values.cost, 900);
  assert.equal(values.purchaseUnit, "box");
  assert.equal(values.sellingUnit, "tablet");
  assert.equal(values.requiresPrescription, true);
  assert.equal(values.expiryDate, "2027-06-30");
});

test("reports missing required fields and invalid values in plain language", () => {
  const { errors } = parseRow(5, {
    name: " ",
    category: "Painkillers",
    price: "12.5",
    expiryDate: "31/13/2026",
    sellingUnit: "bucket",
    requiresPrescription: "maybe",
  });
  assert.ok(errors.includes("Product name is missing."));
  assert.ok(errors.some((error) => error.includes('"12.5" is not a whole number')));
  assert.ok(errors.some((error) => error.includes("is not a real date")));
  assert.ok(errors.some((error) => error.includes('"bucket" is not one of the listed units')));
  assert.ok(errors.includes("Requires prescription must be Yes or No."));
});

test("requires an opening quantity when a batch or expiry is given", () => {
  const { errors } = parseRow(4, { ...base, batchNumber: "B1", expiryDate: "2027-01-01" });
  assert.deepEqual(errors, ["Opening stock quantity is missing for the batch / expiry given."]);
});

test("requires an expiry date with opening stock", () => {
  const { errors } = parseRow(3, { ...base, openingQuantity: 10 });
  assert.deepEqual(errors, ["Expiry date is required when opening stock is given."]);
});

test("reads Excel dates, serial dates and formula results", () => {
  assert.equal(
    parseRow(2, { ...base, openingQuantity: 1, expiryDate: new Date(Date.UTC(2027, 0, 15)) }).values
      .expiryDate,
    "2027-01-15",
  );
  assert.equal(
    parseRow(2, { ...base, openingQuantity: 1, expiryDate: 46402 }).values.expiryDate,
    "2027-01-15",
  );
  assert.equal(plainCell({ formula: "A1*2", result: 400 }), 400);
  assert.equal(plainCell({ richText: [{ text: "Pana" }, { text: "dol" }] }), "Panadol");
});

test("flags duplicate barcodes and duplicate name + strength inside the file", () => {
  const duplicates = findDuplicateRows([
    { rowNumber: 2, name: "Panadol", strength: "500mg", barcode: "111" },
    { rowNumber: 3, name: "panadol ", strength: "500MG", barcode: undefined },
    { rowNumber: 4, name: "Brufen", strength: "400mg", barcode: "111" },
  ]);
  assert.deepEqual(duplicates.get(3), ["Same product name and strength as row 2."]);
  assert.deepEqual(duplicates.get(4), ["Barcode 111 is also used on row 2."]);
  assert.equal(productKey("  Panadol  Extra", "500mg"), "panadol extra|500mg");
});
