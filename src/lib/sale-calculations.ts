export function calculateSaleTotals(
  subtotal: number,
  discount: number,
  taxRateBasisPoints: number,
) {
  if (![subtotal, discount, taxRateBasisPoints].every(Number.isSafeInteger))
    throw new Error("Sale totals require integer values.");
  if (subtotal < 0 || discount < 0 || discount > subtotal)
    throw new Error("Invalid sale subtotal or discount.");
  if (taxRateBasisPoints < 0 || taxRateBasisPoints > 10000) throw new Error("Invalid tax rate.");
  const taxable = subtotal - discount;
  const tax = Math.round((taxable * taxRateBasisPoints) / 10000);
  return { subtotal, discount, taxable, tax, total: taxable + tax };
}

export function allocateFefo<T extends { id: number; expiryDate: string; quantity: number }>(
  batches: T[],
  requested: number,
  today: string,
) {
  if (!Number.isSafeInteger(requested) || requested <= 0)
    throw new Error("Requested quantity must be a positive integer.");
  const available = batches
    .filter((batch) => batch.quantity > 0 && batch.expiryDate >= today)
    .sort((left, right) => left.expiryDate.localeCompare(right.expiryDate) || left.id - right.id);
  let remaining = requested;
  const allocations: Array<{ batchId: number; quantity: number }> = [];
  for (const batch of available) {
    if (!remaining) break;
    const quantity = Math.min(remaining, batch.quantity);
    allocations.push({ batchId: batch.id, quantity });
    remaining -= quantity;
  }
  if (remaining) throw new Error("Insufficient unexpired batch stock.");
  return allocations;
}
