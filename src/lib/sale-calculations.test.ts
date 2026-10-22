import assert from "node:assert/strict";
import test from "node:test";
import { allocateFefo, calculateSaleTotals } from "./sale-calculations";

test("calculates integer TZS totals and basis-point tax", () => {
  assert.deepEqual(calculateSaleTotals(10000, 1000, 1800), {
    subtotal: 10000,
    discount: 1000,
    taxable: 9000,
    tax: 1620,
    total: 10620,
  });
});

test("rejects a discount larger than the subtotal", () => {
  assert.throws(() => calculateSaleTotals(1000, 1001, 0), /Invalid sale/);
});

test("allocates earliest-expiring unexpired batches first", () => {
  assert.deepEqual(
    allocateFefo(
      [
        { id: 1, expiryDate: "2027-06-01", quantity: 5 },
        { id: 2, expiryDate: "2026-01-01", quantity: 50 },
        { id: 3, expiryDate: "2027-01-01", quantity: 3 },
      ],
      6,
      "2026-10-21",
    ),
    [
      { batchId: 3, quantity: 3 },
      { batchId: 1, quantity: 3 },
    ],
  );
});

test("rejects a request that cannot be filled from unexpired batches", () => {
  assert.throws(
    () => allocateFefo([{ id: 1, expiryDate: "2025-01-01", quantity: 10 }], 1, "2026-10-21"),
    /Insufficient/,
  );
});
