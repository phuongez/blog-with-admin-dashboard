import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ dùng đúng SDK server

export async function GET(_: Request, { params }: any) {
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

  let socialLinks = null;
  try {
    const clerkUser = await clerkClient.users.getUser(user.clerkUserId);
    socialLinks = clerkUser.publicMetadata?.socialLinks || null;
  } catch (error) {
    console.warn("Không thể lấy dữ liệu từ Clerk:", error);
  }

  return NextResponse.json({
    ...user,
    socialLinks,
  });
}
