import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const skip = (page - 1) * limit;

  // Lấy user có role là AUTHOR
  const authors = await prisma.user.findMany({
    where: {
      role: "AUTHOR",
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      articles: {
        orderBy: { createdAt: "desc" },
        take: 3, // 3 bài viết nổi bật
        include: {
          author: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  // Lấy socialLinks từ Clerk
  const enrichedAuthors = await Promise.all(
    authors.map(async (author) => {
      try {
        const clerkUser = await clerkClient.users.getUser(author.clerkUserId);
        const socialLinks = clerkUser.publicMetadata?.socialLinks || null;

        return {
          ...author,
          socialLinks,
        };
      } catch (error) {
        console.warn(`Không lấy được socialLinks cho ${author.clerkUserId}`);
        return { ...author, socialLinks: null };
      }
    })
  );

  const total = await prisma.user.count({ where: { role: "AUTHOR" } });

  return NextResponse.json({ authors: enrichedAuthors, total });
}
