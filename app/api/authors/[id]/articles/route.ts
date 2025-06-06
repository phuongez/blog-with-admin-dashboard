import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAGE_SIZE = 6;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");

  const [articles, total] = await Promise.all([
    prisma.articles.findMany({
      where: { authorId: params.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
    }),
    prisma.articles.count({ where: { authorId: params.id } }),
  ]);

  return NextResponse.json({ articles, total });
}
