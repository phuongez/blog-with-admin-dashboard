// app/api/comments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ comments: [] });

  const user = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!user) return NextResponse.json({ comments: [] });

  const isAdmin = user.role === "ADMIN";

  const whereClause = isAdmin
    ? {}
    : {
        article: {
          authorId: user.id,
        },
      };

  const comments = await prisma.comment.findMany({
    where: whereClause,
    include: {
      article: true,
      author: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ comments });
}
