import { prisma } from "@/lib/prisma";

export async function fetchArticleByQuery(
  searchText: string,
  skip: number,
  take: number,
  category?: string // 👈 Thêm category
) {
  const whereClause: any = {
    AND: [
      {
        OR: [
          { title: { contains: searchText, mode: "insensitive" } },
          { category: { contains: searchText, mode: "insensitive" } },
        ],
      },
    ],
  };

  if (category && category !== "all") {
    whereClause.AND.push({
      category: { equals: category, mode: "insensitive" },
    });
  }

  const [articles, total] = await prisma.$transaction([
    prisma.articles.findMany({
      where: whereClause,
      include: {
        author: {
          select: { name: true, imageUrl: true, email: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    }),
    prisma.articles.count({ where: whereClause }),
  ]);

  return { articles, total };
}
