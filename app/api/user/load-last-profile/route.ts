import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const profile = await prisma.userProfileHistory.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ profile });
}
