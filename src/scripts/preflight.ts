import "dotenv/config";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters.");
}

const client = new pg.Client({ connectionString });

async function preflight() {
  await client.connect();
  const requiredTables = [
    "users",
    "products",
    "product_batches",
    "customers",
    "suppliers",
    "purchase_orders",
    "purchase_order_items",
    "sales",
    "sale_items",
    "sale_payments",
    "inventory_movements",
    "audit_logs",
    "business_settings",
  ];
  const tables = await client.query<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
  );
  const present = new Set(tables.rows.map((row) => row.table_name));
  const missing = requiredTables.filter((name) => !present.has(name));
  if (missing.length) throw new Error(`Missing tables: ${missing.join(", ")}`);

  const [admins, settings, invalidProducts, invalidBatches, inconsistentStock] = await Promise.all([
    client.query(
      "SELECT 1 FROM users WHERE role IN ('SuperAdmin', 'Admin') AND status = 'Active' LIMIT 1",
    ),
    client.query("SELECT 1 FROM business_settings LIMIT 1"),
    client.query("SELECT id FROM products WHERE stock < 0 OR price < 0 OR cost < 0 LIMIT 1"),
    client.query(
      "SELECT id FROM product_batches WHERE quantity < 0 OR expiry_date IS NULL LIMIT 1",
    ),
    client.query(`
      SELECT p.id
      FROM products p
      WHERE EXISTS (SELECT 1 FROM product_batches b WHERE b.product_id = p.id)
        AND p.stock <> (SELECT COALESCE(SUM(b.quantity), 0) FROM product_batches b WHERE b.product_id = p.id)
      LIMIT 1
    `),
  ]);
  if (!admins.rowCount) throw new Error("No active administrator exists; run npm run seed.");
  if (!settings.rowCount) throw new Error("Business settings are missing; run npm run seed.");
  if (invalidProducts.rowCount) throw new Error("Invalid product totals detected.");
  if (invalidBatches.rowCount) throw new Error("Invalid batch data detected.");
  if (inconsistentStock.rowCount) throw new Error("Product and batch stock totals do not agree.");

  console.log("Production preflight passed.");
}

preflight().finally(() => client.end());
