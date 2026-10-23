import assert from "node:assert/strict";
import test from "node:test";
import { matchPurchaseRows, type CatalogProduct } from "./purchase-import";

const catalog: CatalogProduct[] = [
  {
    id: 1,
    name: "Panadol",
    strength: "500mg",
    barcode: "600111",
    purchaseUnit: "box",
    sellingUnit: "tablet",
    unitsPerPurchaseUnit: 100,
  },
  {
    id: 2,
    name: "Amoxil",
    strength: "250mg",
    purchaseUnit: "box",
    sellingUnit: "capsule",
    unitsPerPurchaseUnit: 30,
  },
  {
    id: 3,
    name: "Amoxil",
    strength: "500mg",
    purchaseUnit: "box",
    sellingUnit: "capsule",
    unitsPerPurchaseUnit: 30,
  },
  {
    id: 4,
    name: "Brufen",
    strength: "400mg",
    purchaseUnit: "bottle",
    sellingUnit: "bottle",
    unitsPerPurchaseUnit: 1,
  },
];
const today = "2026-10-23";
const row = (rowNumber: number, raw: Record<string, unknown>) => ({ rowNumber, raw });

test("matches by barcode and converts boxes to selling units", () => {
  const [line] = matchPurchaseRows(
    [
      row(2, {
        barcode: "600111",
        quantity: 5,
        quantityIn: "Purchase unit (e.g. box)",
        unitCost: 2500,
        batchNumber: "B1",
        expiryDate: "2028-01-31",
      }),
    ],
    catalog,
    today,
  );
  assert.deepEqual(line.errors, []);
  assert.equal(line.productId, 1);
  assert.equal(line.quantity, 500);
  assert.equal(line.unitCost, 25);
  assert.deepEqual(line.warnings, []);
});

test("accepts a unit name or the Swahili label for 'Quantity in'", () => {
  const lines = matchPurchaseRows(
    [
      row(2, {
        barcode: "600111",
        quantity: 2,
        quantityIn: "Boksi",
        unitCost: 2500,
        batchNumber: "B1",
        expiryDate: "2028-01-31",
      }),
      row(3, {
        barcode: "600111",
        quantity: 40,
        quantityIn: "Kipimo cha kuuza (mf. kidonge)",
        unitCost: 25,
        batchNumber: "B2",
        expiryDate: "31/01/2028",
      }),
    ],
    catalog,
    today,
  );
  assert.equal(lines[0].quantity, 200);
  assert.equal(lines[1].quantity, 40);
  assert.equal(lines[1].expiryDate, "2028-01-31");
});

test("matches by name and strength, and warns when a pack cost does not divide evenly", () => {
  const [line] = matchPurchaseRows(
    [
      row(2, {
        productName: "amoxil",
        strength: "500MG",
        quantity: 3,
        quantityIn: "Box",
        unitCost: 1000,
        batchNumber: "A9",
        expiryDate: "2028-06-30",
      }),
    ],
    catalog,
    today,
  );
  assert.deepEqual(line.errors, []);
  assert.equal(line.productId, 3);
  assert.equal(line.quantity, 90);
  assert.equal(line.unitCost, 33);
  assert.equal(line.warnings.length, 1);
  assert.match(line.warnings[0], /rounded from 33\.33 to 33/);
});

test("blocks unknown, ambiguous, expired and duplicate lines", () => {
  const lines = matchPurchaseRows(
    [
      row(2, {
        productName: "Panadoll",
        quantity: 1,
        unitCost: 10,
        batchNumber: "X",
        expiryDate: "2028-01-01",
      }),
      row(3, {
        productName: "Amoxil",
        quantity: 1,
        unitCost: 10,
        batchNumber: "X",
        expiryDate: "2028-01-01",
      }),
      row(4, {
        barcode: "600111",
        quantity: 1,
        unitCost: 10,
        batchNumber: "Old",
        expiryDate: "2026-01-01",
      }),
      row(5, {
        productName: "Brufen",
        quantity: 1,
        unitCost: 10,
        batchNumber: "D1",
        expiryDate: "2028-01-01",
      }),
      row(6, {
        productName: "Brufen",
        quantity: 2,
        unitCost: 10,
        batchNumber: "d1",
        expiryDate: "2028-01-01",
      }),
      row(7, {
        barcode: "999",
        quantity: 0,
        unitCost: 10,
        batchNumber: "Z",
        expiryDate: "2028-01-01",
      }),
    ],
    catalog,
    today,
  );
  assert.deepEqual(lines[0].errors, ['"Panadoll" is not in the catalog. Add the product first.']);
  assert.deepEqual(lines[1].errors, [
    '"Amoxil" exists in 2 strengths. Add the strength or barcode.',
  ]);
  assert.match(lines[2].errors[0], /has already passed/);
  assert.deepEqual(lines[3].errors, []);
  assert.deepEqual(lines[4].errors, ["Same product and batch as row 5."]);
  assert.ok(lines[5].errors.includes("Barcode 999 is not in the catalog. Add the product first."));
  assert.ok(lines[5].errors.includes("Quantity must be at least 1."));
});
