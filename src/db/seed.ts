import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { db, pool } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export function generateStrongPassword(prefix = "DeveleERP"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
  const randomBuf = crypto.randomBytes(8);
  let randomStr = "";
  for (let i = 0; i < 8; i++) {
    randomStr += chars[randomBuf[i] % chars.length];
  }
  return `${prefix}-${randomStr}`;
}

export async function seedDatabase() {
  console.log("--------------------------------------------------");
  console.log("🌱 SEEDING EVELE ERP DATABASE & USERS SYSTEM...");
  console.log("--------------------------------------------------");

  const demoPlainPassword = process.env.DEMO_USER_PASSWORD || generateStrongPassword("DemoAdmin");
  const realPlainPassword = process.env.REAL_USER_PASSWORD || generateStrongPassword("ProdUser");

  const testUserPasswordHash = await bcrypt.hash(demoPlainPassword, 10);
  const realUserPasswordHash = await bcrypt.hash(realPlainPassword, 10);

  const existingTestUser = await db
    .select()
    .from(users)
    .where(eq(users.username, "erick"))
    .limit(1)
    .catch(() => []);

  if (existingTestUser.length === 0) {
    await db
      .insert(users)
      .values({
        username: "erick",
        email: "demo@devele.co",
        passwordHash: testUserPasswordHash,
        isTestUser: true,
        role: "SuperAdmin",
        department: "All",
      })
      .catch((err) => console.log("Notice: In-memory fallback mode or DB warning:", err.message));
  } else {
    await db
      .update(users)
      .set({ passwordHash: testUserPasswordHash })
      .where(eq(users.username, "erick"))
      .catch(() => {});
  }

  const existingRealUser = await db
    .select()
    .from(users)
    .where(eq(users.username, "realuser"))
    .limit(1)
    .catch(() => []);

  if (existingRealUser.length === 0) {
    await db
      .insert(users)
      .values({
        username: "realuser",
        email: "admin@devele.co",
        passwordHash: realUserPasswordHash,
        isTestUser: false,
        role: "Manager",
        department: "Operations",
      })
      .catch((err) => console.log("Notice: In-memory fallback mode or DB warning:", err.message));
  } else {
    await db
      .update(users)
      .set({ passwordHash: realUserPasswordHash })
      .where(eq(users.username, "realuser"))
      .catch(() => {});
  }

  console.log("\n==================================================");
  console.log("🔒 SECURE CREDENTIALS GENERATED FOR THIS DEPLOYMENT:");
  console.log("==================================================");
  console.log("🔑 DEMO / TEST USER (is_test_user = true):");
  console.log(`   Username:    erick`);
  console.log(`   Email:       demo@devele.co`);
  console.log(`   Password:    ${demoPlainPassword}`);
  console.log(`   isTestUser:  true`);
  console.log(`   Permissions: Full Access (Finance, HR, Sales, Stock, POS)`);
  console.log("--------------------------------------------------");
  console.log("🔑 REAL PRODUCTION USER (is_test_user = false):");
  console.log(`   Username:    realuser`);
  console.log(`   Email:       admin@devele.co`);
  console.log(`   Password:    ${realPlainPassword}`);
  console.log(`   isTestUser:  false`);
  console.log("==================================================\n");

  return {
    testUser: { username: "erick", email: "demo@devele.co", password: demoPlainPassword, isTestUser: true },
    realUser: { username: "realuser", email: "admin@devele.co", password: realPlainPassword, isTestUser: false },
  };
}

if (process.argv[1]?.includes("seed")) {
  seedDatabase().finally(() => pool.end().catch(() => {}));
}
