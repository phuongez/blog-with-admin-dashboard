// app/api/sepay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = `Apikey ${process.env.SEPAY_API_KEY}`;

  if (authHeader !== expectedKey) {
    console.error("Không đúng key");
    return NextResponse.json({ success: false });
  }
  try {
    const body = await req.json();
    const { content, transferAmount: amount, id: transactionId } = body;

    // Kiểm tra dữ liệu cơ bản
    if (!content || !amount || !transactionId) {
      console.error("Thiếu dữ liệu webhook");
      return NextResponse.json({ success: false });
    }

    // Đã có giao dịch này rồi?
    const exists = await prisma.transactionLog.findUnique({
      where: { id: transactionId.toString() },
    });
    if (exists) return NextResponse.json({ success: true });

    // Phân tích content: "BLOG-{articleId}-{userId}"
    const match = content.match(/BLOGAXC(.+)UXC(.+)/);
    if (!match) {
      console.error(
        "Content không đúng định dạng BLOGAXC{articleId}UXC{userId}",
        content
      );
      return NextResponse.json({ success: false });
    }

    const [, articleId, userId] = match;

    // Lấy giá gốc từ bài viết
    const article = await prisma.articles.findUnique({
      where: { id: articleId },
      select: { price: true },
    });

    if (!article || article.price === null) {
      console.error("Không tìm thấy bài viết hoặc chưa có giá", articleId);
      return NextResponse.json({ success: false });
    }

    const price = article.price;

    // Tạo ArticlePurchase nếu chưa tồn tại
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
        priceAtPurchase: price,
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
    console.error("Lỗi xử lý webhook:", error);
    return NextResponse.json({ success: false });
  }
}
