"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const [qrUrl, setQrUrl] = useState("");
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    async function fetchQR() {
      if (!isSignedIn || !user) return;

      // Gọi API để lấy Prisma User ID từ Clerk ID
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
          articleId: params.slug,
          price: 20000,
          userId: prismaUserId,
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
