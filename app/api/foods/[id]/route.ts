import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: any }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing food ID" }, { status: 400 });
  }

  await prisma.food.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: { params: any }) {
  const { id } = params;
  const body = await req.json();

  if (!id || !body) {
    return NextResponse.json(
      { error: "Thiếu ID hoặc dữ liệu" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.food.update({
      where: { id },
      data: {
        name: body.name,
        group: body.group,
        unit: body.unit,
        protein: parseFloat(body.protein),
        carb: parseFloat(body.carb),
        fat: parseFloat(body.fat),
        fiber: parseFloat(body.fiber),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Cập nhật thất bại" }, { status: 500 });
  }
}
