// lib/sepay.ts
export function generateSePayQR({
  bank,
  acc,
  amount,
  description,
}: {
  bank: string;
  acc: string;
  amount: number;
  description: string;
}) {
  const base = "https://qr.sepay.vn/img";
  const url = `${base}?bank=${bank}&acc=${acc}&amount=${amount}&des=${encodeURIComponent(
    description
  )}&template=compact`;
  return url;
}
