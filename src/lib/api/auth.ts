import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setCookie, deleteCookie, getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq, or } from "drizzle-orm";
import { SESSION_IDLE_MINUTES, generateToken, authenticateRequest } from "../auth";
import { getEffectiveModules } from "../permissions";

export const loginUserInternal = createServerOnlyFn(
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const dbUsers = await db
        .select()
        .from(users)
        .where(or(eq(users.username, username), eq(users.email, username)))
        .limit(1);

      if (dbUsers.length > 0) {
        const user = dbUsers[0];
        if (user.isTestUser) {
          return {
            success: false,
            token: null,
            user: null,
            message: "Invalid username or password.",
          };
        }
        if (user.status !== "Active") {
          return {
            success: false,
            token: null,
            user: null,
            message: "Invalid username or password.",
          };
        }
        // Compare password against stored bcrypt hash (NO hardcoded password string)
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          const authUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            isTestUser: false,
            role: user.role,
          };
          const token = generateToken(authUser);
          return {
            success: true,
            token,
            user: authUser,
            message: "Logged in successfully",
          };
        }
      }
    } catch (error) {
      console.error("Login database error", error);
      return { success: false, token: null, user: null, message: "Login service is unavailable." };
    }

    return {
      success: false,
      token: null,
      user: null,
      message: "Invalid username or password.",
    };
  },
);

export const loginUserFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const res = await loginUserInternal(data);
    if (res.success && res.token) setSessionCookies(res.token, Boolean(res.user?.isTestUser));
    return res;
  });

function setSessionCookies(token: string, isTestUser: boolean) {
  const options = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_IDLE_MINUTES * 60,
  };
  try {
    setCookie("auth_token", token, { ...options, httpOnly: true });
    setCookie("is_test_user", isTestUser ? "true" : "false", { ...options, httpOnly: false });
  } catch {
    // Fallback when invoked outside HTTP context
  }
}

// Called by the client while the user is active, sliding the idle expiry forward.
export const refreshSessionFn = createServerFn({ method: "POST" }).handler(async () => {
  const user = await authenticateRequest(getRequest());
  if (!user) return { success: false };
  setSessionCookies(generateToken(user), user.isTestUser);
  return { success: true };
});

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  const user = await authenticateRequest(req);
  return user
    ? {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isTestUser: user.isTestUser,
        modules: await getEffectiveModules(user),
      }
    : null;
});

export const logoutUserFn = createServerFn({ method: "POST" }).handler(async () => {
  try {
    deleteCookie("auth_token", { path: "/" });
    deleteCookie("is_test_user", { path: "/" });
  } catch {
    // Ignore context error
  }

  return { success: true, message: "Logged out successfully." };
});
