CREATE TABLE IF NOT EXISTS role_module_permissions (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  module TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT role_module_permissions_role_module_unique UNIQUE (role, module)
);

CREATE TABLE IF NOT EXISTS user_module_permissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  module TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_module_permissions_user_module_unique UNIQUE (user_id, module)
);
