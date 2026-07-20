import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq, or } from "drizzle-orm";
import { generateToken, authenticateRequest } from "../auth";
import { sessionStoreManager } from "../mock";

// In-memory user fallback store when Postgres is offline/empty
// Demo user password hash is updated upon seedDatabase() execution
export const seededUserStore: Record<string, { id: number; username: string; email: string; passwordHash: string; isTestUser: boolean; role: string }> = {};

export async function loginUserInternal({ username, password }: { username: string; password: string }) {
  // 1. Check Postgres database first
  try {
    const dbUsers = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1);

    if (dbUsers.length > 0) {
      const user = dbUsers[0];
      // Compare password against stored bcrypt hash (NO hardcoded password string)
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        const authUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          isTestUser: Boolean(user.isTestUser),
          role: user.role,
        };
        const token = generateToken(authUser);
        return {
          success: true,
          token,
          user: authUser,
          message: `Logged in successfully as ${user.isTestUser ? "DEMO" : "REAL"} user`,
        };
      } else {
        return {
          success: false,
          token: null,
          user: null,
          message: "Invalid password for user",
        };
      }
    }
  } catch (e) {
    // Postgres database unreachable or offline
  }

  // 2. Fallback check against seeded in-memory user store (strict bcrypt comparison)
  const fallbackUser = seededUserStore[username.toLowerCase()] || seededUserStore[username];
  if (fallbackUser) {
    const isMatch = await bcrypt.compare(password, fallbackUser.passwordHash);
    if (isMatch) {
      const authUser = {
        id: fallbackUser.id,
        username: fallbackUser.username,
        email: fallbackUser.email,
        isTestUser: fallbackUser.isTestUser,
        role: fallbackUser.role,
      };
      const token = generateToken(authUser);
      return {
        success: true,
        token,
        user: authUser,
        message: `Logged in successfully as ${fallbackUser.isTestUser ? "DEMO" : "REAL"} user`,
      };
    } else {
      return {
        success: false,
        token: null,
        user: null,
        message: "Invalid password for user",
      };
    }
  }

  return {
    success: false,
    token: null,
    user: null,
    message: "User account not found",
  };
}

export const loginUserFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    return loginUserInternal(data);
  });

export const logoutUserFn = createServerFn({ method: "POST" }).handler(async ({ request }) => {
  const authUser = await authenticateRequest(request);
  if (authUser && authUser.isTestUser && authUser.sessionId) {
    sessionStoreManager.destroyStore(authUser.sessionId);
    return { success: true, message: `Demo session ${authUser.sessionId} evicted on logout.` };
  }
  return { success: true, message: "Logged out successfully." };
});
