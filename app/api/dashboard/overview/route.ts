import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    usersThisMonth,
    totalArticles,
    articlesThisMonth,
    recentUsers,
    recentArticles,
    totalComments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.articles.count(),
    prisma.articles.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        createdAt: true,
      },
    }),
    prisma.articles.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        content: true,
        category: true,
        comments: true,
        featuredImage: true,
        authorId: true,
        createdAt: true,
        isPaid: true,
        price: true,
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            purchases: true,
          },
        },
      },
    }),
    prisma.comment.count(),
  ]);

  return NextResponse.json({
    totalUsers,
    usersThisMonth,
    totalArticles,
    articlesThisMonth,
    totalComments,
    recentUsers,
    recentArticles,
  });
}
