import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, gender, weight, height, age, bodyfat, activity } = body;

  await prisma.userProfileHistory.create({
    data: { userId, gender, weight, height, age, bodyfat, activity },
  });

  return NextResponse.json({ success: true });
}
