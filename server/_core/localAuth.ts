import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const.js";
import { parse as parseCookieHeader } from "cookie";
import type { Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";

const SALT_ROUNDS = 10;

export type LocalSessionPayload = {
  userId: number;
  email: string;
  type: "local";
};

function getSessionSecret() {
  const secret = process.env.JWT_SECRET ?? "mtec-estoque-secret";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createLocalSession(
  userId: number,
  email: string,
  res: Response,
  req: Request
): Promise<string> {
  const payload: LocalSessionPayload = { userId, email, type: "local" };
  const secret = getSessionSecret();
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(secret);

  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
  return token;
}

export async function verifyLocalSession(
  cookieValue: string | undefined | null
): Promise<LocalSessionPayload | null> {
  if (!cookieValue) return null;
  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(cookieValue, secret, { algorithms: ["HS256"] });
    const { userId, email, type } = payload as Record<string, unknown>;
    if (
      type === "local" &&
      typeof userId === "number" &&
      typeof email === "string"
    ) {
      return { userId, email, type: "local" };
    }
  } catch {
    // Invalid token
  }
  return null;
}
