import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: any) {
  const { id } = params;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xoá user thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Không thể xoá user" }, { status: 500 });
  }
}
