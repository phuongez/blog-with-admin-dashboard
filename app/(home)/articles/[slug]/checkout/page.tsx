"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    async function fetchQR() {
      const res = await fetch("/api/sepay/checkout", {
        method: "POST",
        body: JSON.stringify({
          articleId: params.slug,
          price: 20000, // lấy từ DB trong thực tế
          userId: "user-123", // TODO: lấy từ auth
        }),
      });
      const data = await res.json();
      setQrUrl(data.qrUrl);
    }

    fetchQR();
  }, [params.slug]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold mb-4">Quét mã để thanh toán</h2>
      {qrUrl && (
        <Image
          src={qrUrl}
          width={300}
          height={300}
          alt="QR SePay"
          className="mx-auto"
        />
      )}
    </div>
  );
}
