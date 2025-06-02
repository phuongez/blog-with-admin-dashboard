import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("articleId");
  const userId = searchParams.get("userId");

  if (!articleId || !userId) return NextResponse.json({ hasPurchased: false });

  const purchase = await prisma.articlePurchase.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });

  return NextResponse.json({ hasPurchased: !!purchase });
}
