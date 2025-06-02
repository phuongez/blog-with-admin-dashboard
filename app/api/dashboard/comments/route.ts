import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user role and ID from Prisma
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { articles: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isAdmin = user.role === "ADMIN";

  // Pagination
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  // Filter condition
  const whereCondition = isAdmin
    ? {} // admin sees all comments
    : {
        article: {
          authorId: user.id, // only comments on their articles
        },
      };

  // Get comments with article and author
  const comments = await prisma.comment.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          featuredImage: true,
          authorId: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.comment.count({
    where: whereCondition,
  });

  return NextResponse.json({ comments, total });
}
