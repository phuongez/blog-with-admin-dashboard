// app/api/save-article/route.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
    }

    // Tìm user trong DB dựa vào clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kiểm tra đã lưu chưa
    const existing = await prisma.savedArticle.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Bài viết đã lưu" }, { status: 200 });
    }

    // Lưu bài viết
    await prisma.savedArticle.create({
      data: {
        userId: user.id,
        articleId,
      },
    });

    return NextResponse.json({ message: "Article saved successfully" });
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
