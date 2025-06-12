import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing food ID" }, { status: 400 });
  }

  await prisma.food.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
