// app/api/sepay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("📡 Webhook handler đã chạy!");
  const authHeader = req.headers.get("authorization");
  console.log("⚠️ Tạm bỏ qua kiểm tra API Key. Header nhận được:", authHeader);
  const expectedKey = `Apikey ${process.env.SEPAY_API_KEY}`;
  console.log("SePay gửi:", authHeader);
  console.log("Backend mong đợi:", expectedKey);

  if (authHeader !== expectedKey) {
    console.error("Không đúng key");
    return NextResponse.json({ success: false });
  }
  try {
    const body = await req.json();
    console.log("📥 Dữ liệu webhook nhận:", body);
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
    const parts: string[] = content.split(".");
    const cleanContent = parts.find((part) => part.includes("BLOGAXC"));
    if (!cleanContent) {
      console.error(
        "Không tìm thấy chuỗi có chứa BLOGAXC trong content:",
        content
      );
      return NextResponse.json({ success: false });
    }
    const match = cleanContent.match(/BLOGAXC(.+)UXC(.+)/);
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
