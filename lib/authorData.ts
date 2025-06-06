import { prisma } from "@/lib/prisma";

export async function getAuthorById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      bio: true,
      clerkUserId: true,
      articles: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          content: true,
          featuredImage: true,
          isPaid: true,
          category: true,
          author: {
            select: {
              name: true,
              imageUrl: true,
              id: true,
            },
          },
        },
      },
    },
  });
}
