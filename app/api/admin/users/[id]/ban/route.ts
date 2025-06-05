import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.user.update({
      where: { id },
      data: { role: "BANNED" }, // Hoặc thêm trường `banned: true` nếu bạn không dùng enum
    });

    return NextResponse.json({ message: "User đã bị ban" });
  } catch (error) {
    return NextResponse.json({ error: "Không thể ban user" }, { status: 500 });
  }
}
