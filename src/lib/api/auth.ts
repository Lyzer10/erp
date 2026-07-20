import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { generateToken, authenticateRequest } from "../auth";
import { sessionStoreManager } from "../mock";

export const loginUserFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const { username, password } = data;

    if (username === "erick" || username === "demo@devele.co") {
      const isMatch = password === "123456" || (await bcrypt.compare(password, await bcrypt.hash("123456", 10)));
      if (isMatch) {
        const testUser = {
          id: 1,
          username: "erick",
          email: "demo@devele.co",
          isTestUser: true,
          role: "SuperAdmin",
        };
        const token = generateToken(testUser);
        return {
          success: true,
          token,
          user: testUser,
          message: "Logged in as DEMO test user (in-memory mock mode)",
        };
      }
    }

    try {
      const foundUsers = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (foundUsers.length > 0) {
        const user = foundUsers[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          const authUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            isTestUser: user.isTestUser,
            role: user.role,
          };
          const token = generateToken(authUser);
          return {
            success: true,
            token,
            user: authUser,
            message: `Logged in as ${user.isTestUser ? "DEMO" : "REAL"} user`,
          };
        }
      }
    } catch (e) {
      // In-memory fallback
    }

    return {
      success: false,
      token: null,
      user: null,
      message: "Invalid username or password",
    };
  });

export const logoutUserFn = createServerFn({ method: "POST" }).handler(async ({ request }) => {
  const authUser = await authenticateRequest(request);
  if (authUser && authUser.isTestUser && authUser.sessionId) {
    sessionStoreManager.destroyStore(authUser.sessionId);
    return { success: true, message: `Demo session ${authUser.sessionId} evicted on logout.` };
  }
  return { success: true, message: "Logged out successfully." };
});
