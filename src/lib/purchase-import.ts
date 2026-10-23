// Client-safe rules for filling a purchase from an Excel sheet. Rows are matched to catalogue
// products and converted to selling units, then shown on the purchase form for review.
import {
  PURCHASE_UNITS,
  SELLING_UNITS,
  normalizeHeader,
  parseDate,
  parseWholeNumber,
  plainCell,
  productKey,
} from "./product-import";

type Lang = "en" | "sw";

export type PurchaseColumnKey =
  | "barcode"
  | "productName"
  | "strength"
  | "quantity"
  | "quantityIn"
  | "unitCost"
  | "batchNumber"
  | "expiryDate";

export const PURCHASE_COLUMNS: Array<{
  key: PurchaseColumnKey;
  en: string;
  sw: string;
  noteEn: string;
  noteSw: string;
  width: number;
  required?: boolean;
}> = [
  {
    key: "barcode",
    en: "Barcode",
    sw: "Barcode",
    width: 18,
    noteEn: "Best way to find the product. Leave blank to match by name.",
    noteSw: "Njia bora ya kupata bidhaa. Acha wazi ili kulinganisha kwa jina.",
  },
  {
    key: "productName",
    en: "Product name",
    sw: "Jina la bidhaa",
    width: 28,
    noteEn: "Needed when there is no barcode. Must already be in the catalog.",
    noteSw: "Inahitajika kama hakuna barcode. Lazima iwe tayari kwenye orodha ya bidhaa.",
  },
  {
    key: "strength",
    en: "Strength",
    sw: "Nguvu ya dawa",
    width: 14,
    noteEn: "Helps tell apart products with the same name, e.g. 500mg.",
    noteSw: "Husaidia kutofautisha bidhaa zenye jina moja, mf. 500mg.",
  },
  {
    key: "quantity",
    en: "Quantity *",
    sw: "Idadi *",
    width: 12,
    required: true,
    noteEn: "Whole number.",
    noteSw: "Namba kamili.",
  },
  {
    key: "quantityIn",
    en: "Quantity in",
    sw: "Idadi kwa",
    width: 26,
    noteEn: "Purchase unit (e.g. boxes) or selling unit (e.g. tablets). Blank means selling unit.",
    noteSw:
      "Kipimo cha kununua (mf. maboksi) au cha kuuza (mf. vidonge). Ikiachwa wazi ni kipimo cha kuuza.",
  },
  {
    key: "unitCost",
    en: "Unit cost (TZS) *",
    sw: "Gharama kwa kipimo (TZS) *",
    width: 18,
    required: true,
    noteEn: "Cost of ONE unit in the 'Quantity in' column, in whole shillings.",
    noteSw: "Gharama ya kipimo KIMOJA cha safu ya 'Idadi kwa', kwa shilingi kamili.",
  },
  {
    key: "batchNumber",
    en: "Batch number *",
    sw: "Namba ya batch *",
    width: 16,
    required: true,
    noteEn: "As printed on the pack.",
    noteSw: "Kama ilivyochapishwa kwenye pakiti.",
  },
  {
    key: "expiryDate",
    en: "Expiry date *",
    sw: "Tarehe ya kuisha muda *",
    width: 16,
    required: true,
    noteEn: "YYYY-MM-DD or DD/MM/YYYY.",
    noteSw: "YYYY-MM-DD au DD/MM/YYYY.",
  },
];

export const QUANTITY_IN = {
  purchase: { en: "Purchase unit (e.g. box)", sw: "Kipimo cha kununua (mf. boksi)" },
  selling: { en: "Selling unit (e.g. tablet)", sw: "Kipimo cha kuuza (mf. kidonge)" },
} as const;

export function purchaseColumnForHeader(header: string) {
  const wanted = normalizeHeader(header);
  return PURCHASE_COLUMNS.find(
    (column) => normalizeHeader(column.en) === wanted || normalizeHeader(column.sw) === wanted,
  );
}

export const purchaseHeader = (key: PurchaseColumnKey, lang: Lang) =>
  PURCHASE_COLUMNS.find((column) => column.key === key)![lang];

export type CatalogProduct = {
  id: number;
  name: string;
  strength?: string | null;
  barcode?: string | null;
  purchaseUnit?: string | null;
  sellingUnit?: string | null;
  unitsPerPurchaseUnit?: number | null;
};

export type ImportedPurchaseLine = {
  rowNumber: number;
  productId: number | "";
  label: string;
  quantity: number;
  unitCost: number;
  batchNumber: string;
  expiryDate: string;
  errors: string[];
  warnings: string[];
};

const unitNames = (unit: string | null | undefined) => {
  const all = [...PURCHASE_UNITS, ...SELLING_UNITS].filter(([key]) => key === unit);
  return new Set(all.flatMap((names) => names.map((name) => name.toLowerCase())));
};

// Decides whether the quantity is in the product's purchase unit (box) or selling unit (tablet).
function readQuantityIn(
  value: unknown,
  product: CatalogProduct | undefined,
): "purchase" | "selling" | null {
  const wanted = String(plainCell(value) ?? "")
    .trim()
    .toLowerCase();
  if (!wanted) return "selling";
  if (
    [QUANTITY_IN.purchase.en, QUANTITY_IN.purchase.sw].some(
      (label) => label.toLowerCase() === wanted,
    )
  )
    return "purchase";
  if (
    [QUANTITY_IN.selling.en, QUANTITY_IN.selling.sw].some((label) => label.toLowerCase() === wanted)
  )
    return "selling";
  if (product) {
    // A unit name such as "Box" or "Kidonge" works too, when it is unambiguous for this product.
    const isPurchase = unitNames(product.purchaseUnit).has(wanted);
    const isSelling = unitNames(product.sellingUnit).has(wanted);
    if (isPurchase && !isSelling) return "purchase";
    if (isSelling && !isPurchase) return "selling";
    if (isPurchase && isSelling) return "selling";
  }
  return null;
}

export function matchPurchaseRows(
  rows: Array<{ rowNumber: number; raw: Partial<Record<PurchaseColumnKey, unknown>> }>,
  catalog: CatalogProduct[],
  today = new Date().toISOString().slice(0, 10),
): ImportedPurchaseLine[] {
  const byBarcode = new Map(catalog.filter((p) => p.barcode).map((p) => [p.barcode!.trim(), p]));
  const byKey = new Map(catalog.map((p) => [productKey(p.name, p.strength), p]));
  const seen = new Map<string, number>();

  return rows.map(({ rowNumber, raw }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const text = (key: PurchaseColumnKey) => {
      const value = plainCell(raw[key]);
      if (value === undefined) return "";
      return (value instanceof Date ? value.toISOString().slice(0, 10) : String(value))
        .replace(/\s+/g, " ")
        .trim();
    };
    const barcode = text("barcode");
    const name = text("productName");
    const strength = text("strength");

    let product: CatalogProduct | undefined;
    if (barcode) {
      product = byBarcode.get(barcode);
      if (!product) errors.push(`Barcode ${barcode} is not in the catalog. Add the product first.`);
    } else if (name) {
      product = byKey.get(productKey(name, strength));
      if (!product && !strength) {
        const sameName = catalog.filter((p) => productKey(p.name, "") === productKey(name, ""));
        if (sameName.length === 1) product = sameName[0];
        else if (sameName.length > 1)
          errors.push(
            `"${name}" exists in ${sameName.length} strengths. Add the strength or barcode.`,
          );
      }
      if (!product && !errors.length)
        errors.push(
          `"${[name, strength].filter(Boolean).join(" ")}" is not in the catalog. Add the product first.`,
        );
    } else errors.push("Barcode or product name is missing.");

    const number = (key: PurchaseColumnKey, label: string, min: number) => {
      const value = plainCell(raw[key]);
      if (value === undefined || String(value).trim() === "") {
        errors.push(`${label} is missing.`);
        return 0;
      }
      const parsed = parseWholeNumber(value, label, errors) ?? 0;
      if (parsed < min) errors.push(`${label} must be at least ${min}.`);
      return parsed;
    };
    let quantity = number("quantity", "Quantity", 1);
    let unitCost = number("unitCost", "Unit cost", 0);
    const batchNumber = text("batchNumber");
    if (!batchNumber) errors.push("Batch number is missing.");

    let expiryDate = "";
    const expiryRaw = plainCell(raw.expiryDate);
    if (expiryRaw === undefined || String(expiryRaw).trim() === "")
      errors.push("Expiry date is missing.");
    else {
      expiryDate = parseDate(expiryRaw, "Expiry date", errors) ?? "";
      if (expiryDate && expiryDate <= today)
        errors.push(
          `Expiry date ${expiryDate} has already passed; expired stock cannot be received.`,
        );
    }

    const quantityIn = readQuantityIn(raw.quantityIn, product);
    if (!quantityIn) errors.push(`"Quantity in" must be the purchase unit or the selling unit.`);
    if (product && quantityIn === "purchase") {
      // Stock is kept in selling units, so 5 boxes of 100 tablets become 500 tablets.
      const perPack = Math.max(1, product.unitsPerPurchaseUnit ?? 1);
      const packCost = unitCost;
      quantity *= perPack;
      unitCost = Math.round(packCost / perPack);
      if (unitCost * perPack !== packCost)
        warnings.push(
          `Cost per ${product.sellingUnit ?? "unit"} rounded from ${(packCost / perPack).toFixed(2)} to ${unitCost}; line total differs from the invoice by TZS ${Math.abs(unitCost * perPack - packCost) * (quantity / perPack)}.`,
        );
    }

    if (product && batchNumber) {
      const key = `${product.id}|${batchNumber.toLowerCase()}`;
      const first = seen.get(key);
      if (first) errors.push(`Same product and batch as row ${first}.`);
      else seen.set(key, rowNumber);
    }

    return {
      rowNumber,
      productId: product?.id ?? "",
      label: product ? [product.name, product.strength].filter(Boolean).join(" ") : name || barcode,
      quantity,
      unitCost,
      batchNumber,
      expiryDate,
      errors,
      warnings,
    };
  });
}
