-- Migration: Add is_test_user boolean column to users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_test_user BOOLEAN DEFAULT FALSE NOT NULL,
    role VARCHAR(100) DEFAULT 'User' NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Ensure column exists if table was pre-existing
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_test_user BOOLEAN DEFAULT FALSE NOT NULL;
