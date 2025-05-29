import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Lấy thông tin user để xác định vai trò
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN";

    const whereCondition = isAdmin
      ? {}
      : {
          authorId: user.id,
        };

    const [articles, total] = await Promise.all([
      prisma.articles.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          featuredImage: true,
          authorId: true,
          _count: {
            select: {
              likes: true,
            },
          },
          comments: {
            select: { id: true },
          },
        },
      }),
      prisma.articles.count({
        where: whereCondition,
      }),
    ]);

    return NextResponse.json({ articles, total });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
