ALTER TABLE products ADD COLUMN IF NOT EXISTS generic_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dosage_form TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS strength TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS purchase_unit TEXT NOT NULL DEFAULT 'piece';
ALTER TABLE products ADD COLUMN IF NOT EXISTS selling_unit TEXT NOT NULL DEFAULT 'piece';
ALTER TABLE products ADD COLUMN IF NOT EXISTS units_per_purchase_unit INTEGER NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS requires_prescription BOOLEAN NOT NULL DEFAULT FALSE;
CREATE UNIQUE INDEX IF NOT EXISTS products_barcode_unique ON products (barcode) WHERE barcode IS NOT NULL;

CREATE TABLE IF NOT EXISTS product_batches (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  batch_number TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit_cost INTEGER NOT NULL CHECK (unit_cost >= 0),
  received_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, batch_number)
);
CREATE INDEX IF NOT EXISTS product_batches_product_expiry_idx ON product_batches (product_id, expiry_date);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  customer_id INTEGER REFERENCES customers(id),
  cashier_id INTEGER NOT NULL REFERENCES users(id),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  tax INTEGER NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'Completed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES sales(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  batch_id INTEGER REFERENCES product_batches(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE IF NOT EXISTS sale_payments (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES sales(id),
  method TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  reference TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  batch_id INTEGER REFERENCES product_batches(id),
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id INTEGER NOT NULL,
  performed_by INTEGER NOT NULL REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS inventory_movements_product_created_idx ON inventory_movements (product_id, created_at);
