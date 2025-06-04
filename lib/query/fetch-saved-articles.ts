import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ArticleWithAuthor = Prisma.ArticlesGetPayload<{
  include: {
    author: true; // hoặc dùng select: { ...đầy đủ như trên... }
  };
}>;

type FetchSavedArticlesResult = {
  articles: ArticleWithAuthor[];
  total: number;
};

export async function fetchSavedArticles(
  user: any,
  skip: number,
  take: number
): Promise<FetchSavedArticlesResult> {
  const [savedArticles, total] = await prisma.$transaction([
    prisma.savedArticle.findMany({
      where: {
        userId: user.id,
      },
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                clerkUserId: true,
                role: true,
                createdAt: true,
                name: true,
                imageUrl: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    }),
    prisma.savedArticle.count({ where: { userId: user.id } }),
  ]);

  // Trích xuất chỉ phần article ra
  const articles = savedArticles.map((item) => item.article);

  return { articles, total };
}
