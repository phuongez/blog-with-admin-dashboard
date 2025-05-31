// app/api/sepay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, transferAmount: amount, id: transactionId } = body;

  if (!content || !amount || !transactionId) {
    return NextResponse.json({ success: false });
  }

  const exists = await prisma.transactionLog.findUnique({
    where: { id: transactionId.toString() },
  });
  if (exists) return NextResponse.json({ success: true });

  await prisma.transactionLog.create({
    data: {
      id: transactionId.toString(),
      content,
      amount,
    },
  });

  const match = content.match(/BLOG-(.+)-(.+)/);
  if (!match) return NextResponse.json({ success: false });

  const [_, articleId, userId] = match;

  await prisma.articlePurchase.upsert({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
    update: {},
    create: {
      userId,
      articleId,
    },
  });

  return NextResponse.json({ success: true });
}
