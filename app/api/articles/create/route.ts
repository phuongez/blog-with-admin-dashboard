// app/api/articles/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      subtitle,
      content,
      category,
      isPaid,
      imageUrl,
      clerkUserId,
    } = body;

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await prisma.articles.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug này đã tồn tại" },
        { status: 400 }
      );
    }

    const article = await prisma.articles.create({
      data: {
        title,
        subtitle,
        content,
        category,
        slug,
        featuredImage: imageUrl,
        isPaid: isPaid === "paid",
        authorId: user.id,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
