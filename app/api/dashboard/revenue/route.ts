import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const now = new Date();
  const from = startOfMonth(now);
  const to = endOfMonth(now);

  // Tổng doanh thu trong tháng
  const totalRevenue = await prisma.articlePurchase.aggregate({
    _sum: {
      priceAtPurchase: true,
    },
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });

  // Doanh thu theo tác giả
  const authors = await prisma.user.findMany({
    where: {
      role: {
        in: ["AUTHOR", "ADMIN"], // ← Lấy cả AUTHOR và ADMIN
      },
    },
    select: {
      id: true,
      name: true,
      articles: {
        select: {
          title: true,
          purchases: {
            where: {
              createdAt: {
                gte: from,
                lte: to,
              },
            },
            select: {
              priceAtPurchase: true,
            },
          },
        },
      },
    },
  });

  const authorStats = authors.map((author) => {
    const totalSold = author.articles.reduce(
      (sum, article) => sum + article.purchases.length,
      0
    );

    const totalRevenue = author.articles.reduce(
      (sum, article) =>
        sum + article.purchases.reduce((a, p) => a + p.priceAtPurchase, 0),
      0
    );

    return {
      authorId: author.id,
      authorName: author.name,
      totalSold,
      totalRevenue,
    };
  });

  return Response.json({
    totalRevenue: totalRevenue._sum.priceAtPurchase || 0,
    authorStats,
  });
}
