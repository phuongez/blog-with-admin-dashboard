import { prisma } from "@/lib/prisma";

export async function fetchPurchasedArticles(
  user: any,
  skip: number,
  take: number
) {
  const purchases = await prisma.articlePurchase.findMany({
    where: { userId: user.id },
    select: { articleId: true },
  });

  const articleIds = purchases.map((p) => p.articleId);

  const articles = await prisma.articles.findMany({
    where: { id: { in: articleIds } },
    skip,
    take,
    include: { author: true },
  });

  const total = articleIds.length;

  return { articles, total };
}
