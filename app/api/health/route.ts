import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const env = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    ADMIN_JWT_SECRET: !!process.env.ADMIN_JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV ?? "unknown",
  };

  let database = "disconnected";
  try {
    await prisma.siteSettings.findFirst();
    database = "connected";
  } catch (err) {
    database = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({
    ok: database === "connected",
    env,
    database,
    timestamp: new Date().toISOString(),
  });
}
