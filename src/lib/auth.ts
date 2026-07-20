import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable must be set.");
  }
  return secret;
}

export type AuthUser = {
  id: number | string;
  username: string;
  email: string;
  isTestUser: boolean;
  role: string;
  sessionId: string;
};

export function generateToken(user: Partial<AuthUser>): string {
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
    { expiresIn: "7d" }
  );
}

export async function authenticateRequest(req: Request): Promise<AuthUser | null> {
  const secret = getJwtSecret();
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
    const decoded = jwt.verify(token, secret) as any;
    const sessionId = decoded.sessionId || headerSessionId || `session-${decoded.username}-${decoded.id}`;

    const dbUsers = await db.select().from(users).where(eq(users.username, decoded.username)).limit(1).catch(() => []);
    
    if (dbUsers.length > 0) {
      const dbUser = dbUsers[0];
      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        isTestUser: Boolean(dbUser.isTestUser),
        role: dbUser.role,
        sessionId,
      };
    }

    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      isTestUser: Boolean(decoded.isTestUser),
      role: decoded.role || "User",
      sessionId,
    };
  } catch (err) {
    return null;
  }
}
