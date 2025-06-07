import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAGE_SIZE = 6;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "all";

  const whereClause = {
    authorId: params.id,
    ...(category !== "all" ? { category } : {}), // nếu không phải "all", thêm điều kiện lọc category
  };

  const [articles, total] = await Promise.all([
    prisma.articles.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        author: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
    }),
    prisma.articles.count({ where: whereClause }),
  ]);

  return NextResponse.json({ articles, total });
}
