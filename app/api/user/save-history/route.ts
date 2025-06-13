import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId: clerkUserId,
      gender,
      weight,
      height,
      age,
      bodyfat,
      activity,
    } = body;

    // Tìm user theo Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const lastProfile = await prisma.userProfileHistory.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastProfile) {
      const now = new Date();
      const diffDays =
        (now.getTime() - new Date(lastProfile.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      if (diffDays < 7) {
        return NextResponse.json(
          { error: "Bạn chỉ có thể lưu thông tin mới sau 7 ngày." },
          { status: 400 }
        );
      }
    }

    // Tạo bản ghi lịch sử
    await prisma.userProfileHistory.create({
      data: {
        userId: user.id, // ID thực trong bảng User của Prisma
        gender,
        weight,
        height,
        age,
        bodyfat,
        activity,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SAVE-HISTORY ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
