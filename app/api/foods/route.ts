// /app/api/foods/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");

  const whereClause = group && group !== "All" ? { group } : {};

  const foods = await prisma.food.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      group: true,
      unit: true,
      protein: true,
      carb: true,
      fat: true,
      fiber: true,
      calories: true,
    },
  });

  return NextResponse.json(foods);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, group, unit, protein, carb, fat, fiber } = body;

  if (!name || !group || !unit) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const calories = protein * 4 + carb * 4 + fat * 9;

  const newFood = await prisma.food.create({
    data: {
      name,
      group,
      unit,
      protein,
      carb,
      fat,
      fiber,
      calories,
    },
  });

  return NextResponse.json(newFood);
}
