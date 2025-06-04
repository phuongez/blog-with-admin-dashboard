"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const [qrUrl, setQrUrl] = useState("");
  const { user, isSignedIn } = useUser();
  const params = useParams(); // Lấy params từ hook client-side

  const slug = params?.slug as string; // Có thể là string | string[] tùy cấu hình router

  useEffect(() => {
    async function fetchQR() {
      if (!isSignedIn || !user || !slug) return;

      const userRes = await fetch("/api/get-user-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId: user.id }),
      });
      const { prismaUserId } = await userRes.json();

      const res = await fetch("/api/sepay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: slug,
          price: 20000,
          userId: prismaUserId,
        }),
      });

      const data = await res.json();
      setQrUrl(data.qrUrl);
    }

    fetchQR();
  }, [slug]);

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
