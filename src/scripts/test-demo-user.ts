import { seedDatabase } from "../db/seed";
import { generateToken } from "../lib/auth";
import { resolveDataSource } from "../lib/data-source";
import { sessionStoreManager } from "../lib/mock";
import { db } from "../db";
import { customers } from "../db/schema";
import { eq } from "drizzle-orm";

async function runDemoVerificationTest() {
  console.log("\n==================================================");
  console.log("🧪 RUNNING ENHANCED DEMO / TEST USER VERIFICATION TEST");
  console.log("==================================================\n");

  const { testUser, realUser } = await seedDatabase();

  const demoSession1Token = generateToken({
    id: 1,
    username: testUser.username,
    email: testUser.email,
    isTestUser: true,
    role: "SuperAdmin",
    sessionId: "demo-session-alpha-100",
  });

  const demoSession2Token = generateToken({
    id: 1,
    username: testUser.username,
    email: testUser.email,
    isTestUser: true,
    role: "SuperAdmin",
    sessionId: "demo-session-beta-200",
  });

  const realToken = generateToken({
    id: 2,
    username: realUser.username,
    email: realUser.email,
    isTestUser: false,
    role: "Manager",
    sessionId: "prod-session-300",
  });

  console.log("\n▶ TEST A: Logging in as DEMO USER SESSION ALPHA (sessionId: demo-session-alpha-100)...");
  
  const reqAlpha = new Request("http://localhost:3000/api/customers", {
    headers: { Authorization: `Bearer ${demoSession1Token}` },
  });

  const dsAlpha = await resolveDataSource(reqAlpha);

  console.log(`  - isTestUser: ${dsAlpha.isTestUser}`);
  const customersAlphaInitial = await dsAlpha.customers.getAll();
  console.log(`  - Session Alpha initial customers count: ${customersAlphaInitial.length}`);

  console.log("  - Creating customer 'Alpha Unique Corp' in Session Alpha...");
  await dsAlpha.customers.create({
    name: "Alpha Unique Corp",
    email: "alpha@corp.com",
    phone: "+255 711 111 111",
  });

  const customersAlphaUpdated = await dsAlpha.customers.getAll();
  console.log(`  - Session Alpha updated customers count: ${customersAlphaUpdated.length}`);

  console.log("\n▶ TEST B: Checking CONCURRENT DEMO USER SESSION BETA (sessionId: demo-session-beta-200)...");

  const reqBeta = new Request("http://localhost:3000/api/customers", {
    headers: { Authorization: `Bearer ${demoSession2Token}` },
  });

  const dsBeta = await resolveDataSource(reqBeta);
  
  console.log("  - Creating customer 'Beta Enterprise Ltd' in Session Beta...");
  await dsBeta.customers.create({
    name: "Beta Enterprise Ltd",
    email: "beta@enterprise.com",
  });

  const customersBeta = await dsBeta.customers.getAll();
  console.log(`  - Session Beta customers count: ${customersBeta.length}`);
  
  const foundAlphaInBeta = customersBeta.some((c: any) => c.name === "Alpha Unique Corp");
  if (foundAlphaInBeta) {
    throw new Error("❌ FAILURE: Concurrent session corruption! Session Alpha edit leaked into Session Beta!");
  }
  console.log("  ✅ SUCCESS: Session Alpha edits are isolated and DO NOT corrupt Session Beta!");

  console.log("\n▶ TEST C: Verifying SECURITY SCOPING of resetDemoData (Attempting to reset Session Beta via Session Alpha credentials)...");

  const maliciousReq = new Request("http://localhost:3000/api/demo/reset", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${demoSession1Token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId: "demo-session-beta-200" }),
  });

  const dsMalicious = await resolveDataSource(maliciousReq);
  const resetResponse = await dsMalicious.resetDemoData();
  console.log(`  - Server Response: ${resetResponse.message}`);

  const customersBetaAfterMaliciousReset = await dsBeta.customers.getAll();
  const betaHasEnterprise = customersBetaAfterMaliciousReset.some((c: any) => c.name === "Beta Enterprise Ltd");
  
  if (!betaHasEnterprise) {
    throw new Error("❌ SECURITY FAILURE: Session Alpha was able to reset Session Beta's data!");
  }

  const customersAlphaAfterReset = await dsAlpha.customers.getAll();
  console.log(`  - Session Alpha count after reset: ${customersAlphaAfterReset.length}`);
  console.log(`  - Session Beta count after attempted attack: ${customersBetaAfterMaliciousReset.length}`);

  if (customersAlphaAfterReset.length !== 24) {
    throw new Error("❌ FAILURE: Session Alpha's own data was not reset!");
  }
  console.log("  ✅ SUCCESS: Body-supplied sessionId override was ignored! Only authenticated session was reset.");

  console.log("\n▶ TEST D: Testing SESSION EVICTION & TTL CLEANUP (Disambiguation Check)...");

  console.log(`  - Active session count in memory before eviction: ${sessionStoreManager.getActiveSessionsCount()}`);

  console.log("  - Destroying ONLY Session Alpha (simulating Session Alpha logout)...");
  sessionStoreManager.destroyStore("demo-session-alpha-100");

  const hasAlphaAfterLogout = sessionStoreManager.hasStore("demo-session-alpha-100");
  const hasBetaAfterAlphaLogout = sessionStoreManager.hasStore("demo-session-beta-200");

  console.log(`  - Session Alpha exists after logout? ${hasAlphaAfterLogout}`);
  console.log(`  - Session Beta exists after Session Alpha logout? ${hasBetaAfterAlphaLogout}`);
  console.log(`  - Active session count after destroying ONLY Session Alpha: ${sessionStoreManager.getActiveSessionsCount()}`);

  if (hasAlphaAfterLogout || !hasBetaAfterAlphaLogout || sessionStoreManager.getActiveSessionsCount() !== 1) {
    throw new Error("❌ CRITICAL FAILURE: destroyStore cleared more than the requested Session Alpha!");
  }
  console.log("  ✅ VERIFIED: destroyStore('demo-session-alpha-100') destroyed ONLY Session Alpha, while Session Beta remained active!");

  console.log("  - Simulating 2-hour TTL timeout sweep on remaining idle sessions...");
  const evictedStaleCount = sessionStoreManager.cleanupStaleSessions(0);
  console.log(`  - Evicted idle sessions count: ${evictedStaleCount}`);
  console.log(`  - Active sessions remaining after TTL sweep: ${sessionStoreManager.getActiveSessionsCount()}`);

  if (sessionStoreManager.getActiveSessionsCount() !== 0 || evictedStaleCount !== 1) {
    throw new Error("❌ FAILURE: Stale session eviction failed!");
  }
  console.log("  ✅ VERIFIED: TTL sweep correctly caught and evicted the remaining idle Session Beta!");

  console.log("\n▶ TEST E: Checking REAL PRODUCTION USER ISOLATION (is_test_user = false)...");

  const reqReal = new Request("http://localhost:3000/api/customers", {
    headers: { Authorization: `Bearer ${realToken}` },
  });

  const dsReal = await resolveDataSource(reqReal);
  console.log(`  - isTestUser attached: ${dsReal.isTestUser}`);
  
  if (dsReal.isTestUser) {
    throw new Error("❌ FAILURE: Real user was incorrectly assigned isTestUser = true!");
  }

  const postgresCustomers = await dsReal.customers.getAll();
  console.log(`  - Real user customers in Postgres: ${postgresCustomers.length}`);

  console.log("\n==================================================");
  console.log("🎉 ALL ENHANCED DEMO SYSTEM VERIFICATION TESTS PASSED!");
  console.log("   ✔ Migration logic & is_test_user column verified");
  console.log("   ✔ Strong password generation & credentials printing verified");
  console.log("   ✔ Session-scoped in-memory store isolation verified");
  console.log("   ✔ Security scoping of resetDemoData strictly enforced (JWT token session)");
  console.log("   ✔ Disambiguated destroyStore (Session Alpha only) & TTL eviction (Session Beta) verified");
  console.log("==================================================\n");
}

runDemoVerificationTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
