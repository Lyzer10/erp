import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createServerOnlyFn } from "@tanstack/react-start";
import { SESSION_IDLE_MINUTES } from "./session";

export const getJwtSecret = createServerOnlyFn((): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
  }
  return secret;
});

export type AuthUser = {
  id: number | string;
  username: string;
  email: string;
  isTestUser: boolean;
  role: string;
  sessionId: string;
};

export { SESSION_IDLE_MINUTES };

export const generateToken = createServerOnlyFn((user: Partial<AuthUser>): string => {
  const secret = getJwtSecret();
  const sessionId = user.sessionId || crypto.randomUUID();
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      isTestUser: user.isTestUser,
      role: user.role,
      sessionId,
    },
    secret,
    { expiresIn: `${SESSION_IDLE_MINUTES}m` },
  );
});

export const authenticateRequest = createServerOnlyFn(
  async (req: Request): Promise<AuthUser | null> => {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie") || "";
    const headerSessionId = req.headers.get("x-session-id");

    let token: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookieHeader.includes("auth_token=")) {
      token = cookieHeader.split("auth_token=")[1]?.split(";")[0] || null;
    }

    if (!token) {
      return null;
    }

    try {
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret);
      if (typeof decoded === "string") return null;
      const sessionId =
        decoded.sessionId || headerSessionId || `session-${decoded.username}-${decoded.id}`;

      const dbUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(decoded.id)))
        .limit(1);

      if (dbUsers.length > 0) {
        const dbUser = dbUsers[0];
        if (dbUser.status !== "Active") return null;
        return {
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          isTestUser: Boolean(dbUser.isTestUser),
          role: dbUser.role,
          sessionId,
        };
      }

      // A signed token is not enough: the account must still exist in the
      // database so deleted or disabled credentials cannot retain access.
      return null;
    } catch {
      return null;
    }
  },
);
