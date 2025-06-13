// app/api/user/history/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clerkId = searchParams.get("userId");

  if (!clerkId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const profiles = await prisma.userProfileHistory.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(profiles);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing profile id" }, { status: 400 });
  }

  await prisma.userProfileHistory.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, gender, weight, height, age, bodyfat, activity } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing profile id" }, { status: 400 });
  }

  const updated = await prisma.userProfileHistory.update({
    where: { id },
    data: {
      gender,
      weight,
      height,
      age,
      bodyfat,
      activity,
    },
  });

  return NextResponse.json(updated);
}
