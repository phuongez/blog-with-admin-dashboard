// lib/sepay.ts

export function generateSePayQR({
  bank,
  acc,
  amount,
  articleId,
  userId,
}: {
  bank: string;
  acc: string;
  amount: number;
  articleId: string;
  userId: string;
}) {
  const description = `BLOG.${articleId}.${userId}`;
  const base = "https://qr.sepay.vn/img";

  const url = `${base}?bank=${bank}&acc=${acc}&amount=${amount}&des=${encodeURIComponent(
    description
  )}&template=compact`;

  return url;
}
