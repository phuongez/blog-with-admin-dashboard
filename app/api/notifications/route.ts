import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json([], { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
  });

  if (!user) return NextResponse.json([], { status: 404 });

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { comment: { include: { author: true } }, article: true },
  });

  return NextResponse.json(notifications);
}
