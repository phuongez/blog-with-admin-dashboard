// app/api/sepay/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateSePayQR } from "@/lib/sepay";

export async function POST(req: NextRequest) {
  const { articleId, price, userId } = await req.json();

  const acc = process.env.SEPAY_ACCOUNT!;
  const bank = process.env.SEPAY_BANK!;

  const qrUrl = generateSePayQR({
    bank,
    acc,
    amount: price,
    articleId,
    userId,
  });

  return NextResponse.json({ qrUrl });
}
