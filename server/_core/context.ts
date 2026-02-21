import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME } from "../../shared/const.js";
import { sdk } from "./sdk";
import { verifyLocalSession } from "./localAuth";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  // Try local auth first (email/password)
  const cookies = parseCookieHeader(opts.req.headers.cookie ?? "");
  const sessionCookie = cookies[COOKIE_NAME];
  const localSession = await verifyLocalSession(sessionCookie);
  if (localSession) {
    user = await db.getUserById(localSession.userId);
  }

  // Fallback to OAuth
  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
