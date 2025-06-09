// app/api/sepay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = `Apikey ${process.env.SEPAY_API_KEY}`;

  // Bỏ qua kiểm tra trong quá trình dev nếu muốn
  if (authHeader !== expectedKey) {
    return NextResponse.json({
      success: false,
      error: "Invalid API key",
    });
  }

  try {
    const body = await req.json();

    const { content, transferAmount: amount, id: transactionId } = body;

    if (!content || !amount || !transactionId) {
      return NextResponse.json({
        success: false,
        error: "Missing content, amount or transactionId",
      });
    }

    // Kiểm tra đã có log giao dịch chưa
    const exists = await prisma.transactionLog.findUnique({
      where: { id: transactionId.toString() },
    });
    if (exists) {
      console.log("✅ Giao dịch đã tồn tại:", transactionId);
      return NextResponse.json({ success: true });
    }

    // Tìm và tách articleId + userId
    const match = content.match(/BLOGAXC([a-z0-9]+)UXC([a-z0-9]+)/i);
    if (!match) {
      return NextResponse.json({
        success: false,
        error: "Invalid content format",
      });
    }

    const [, articleId, userId] = match;
    console.log("✅ articleId:", articleId);
    console.log("✅ userId:", userId);

    // Kiểm tra bài viết tồn tại
    const article = await prisma.articles.findUnique({
      where: { id: articleId },
      select: { price: true },
    });

    if (!article) {
      return NextResponse.json({
        success: false,
        error: "Article not found",
      });
    }

    // Ghi ArticlePurchase nếu chưa có
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
        priceAtPurchase: amount,
      },
    });

    // Ghi log giao dịch
    await prisma.transactionLog.create({
      data: {
        id: transactionId.toString(),
        content,
        amount,
        articleId,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Lỗi xử lý webhook:", error);
    return NextResponse.json({
      success: false,
      error: "Unexpected server error",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
