import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import { businessSettings, users } from "./schema";

async function seed() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !email || !password || password.length < 12) {
    throw new Error(
      "Set ADMIN_USERNAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters before seeding.",
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  if (existing.length) {
    await db
      .update(users)
      .set({ email, passwordHash, role: "SuperAdmin", status: "Active", isTestUser: false })
      .where(eq(users.id, existing[0].id));
  } else {
    await db.insert(users).values({
      username,
      email,
      passwordHash,
      role: "SuperAdmin",
      status: "Active",
      isTestUser: false,
      department: "Administration",
    });
  }
  const settings = await db.select({ id: businessSettings.id }).from(businessSettings).limit(1);
  if (!settings.length)
    await db.insert(businessSettings).values({
      businessName: process.env.BUSINESS_NAME?.trim() || "Pharmacy",
      currency: "TZS",
      taxRateBasisPoints: 0,
    });
  console.log("Production administrator and base settings are ready.");
}

seed().finally(() => pool.end());
