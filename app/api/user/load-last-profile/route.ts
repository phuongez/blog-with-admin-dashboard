import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return NextResponse.json(
      { error: "Missing clerk userId" },
      { status: 400 }
    );

  // Lấy user trong bảng User theo clerkUserId
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user)
    return NextResponse.json({ error: "Db user not found" }, { status: 404 });

  // ✅ Lấy profile gần nhất theo user.id <== đúng field là userId
  const profile = await prisma.userProfileHistory.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ profile });
}
