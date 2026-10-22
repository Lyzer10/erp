import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const { DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
if (!DATABASE_URL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error("DATABASE_URL, ADMIN_USERNAME, and ADMIN_PASSWORD are required.");
}

const databaseUrl = DATABASE_URL;
const adminUsername = ADMIN_USERNAME;
const adminPassword = ADMIN_PASSWORD;
const client = new pg.Client({ connectionString: databaseUrl });

async function verifyLogin() {
  await client.connect();
  const result = await client.query<{
    username: string;
    role: string;
    status: string;
    password_hash: string;
  }>("SELECT username, role, status, password_hash FROM users WHERE username = $1", [
    adminUsername,
  ]);
  const user = result.rows[0];
  const passwordMatches =
    Boolean(user) && (await bcrypt.compare(adminPassword, user.password_hash));
  if (!user || user.status !== "Active" || !passwordMatches) {
    throw new Error("The configured administrator login is not valid.");
  }
  console.log(`Login verified for ${user.username} (${user.role}).`);
}

verifyLogin().finally(() => client.end());
