import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      bio: true,
      clerkUserId: true,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  return NextResponse.json(user);
}
