import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  let database = "disconnected";
  try {
    await prisma.siteSettings.findFirst();
    database = "connected";
  } catch {
    database = "error";
  }

  return NextResponse.json({
    ok: database === "connected",
    database,
    timestamp: new Date().toISOString(),
  });
}
