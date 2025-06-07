"use client";

import { useEffect, useState } from "react";
import { useCheckPurchase } from "@/hooks/useCheckPurchase";
import Image from "next/image";

type Props = {
  article: {
    id: string;
    title: string;
    content: string;
    isPaid: boolean;
    price?: number;
  };
  canView: boolean;
  userId: string | null;
};

export default function ArticleContent({ article, canView, userId }: Props) {
  const hasPurchased = useCheckPurchase(article.id, userId || "");
  const [showModal, setShowModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  // Hiện modal ngay khi bài viết load
  useEffect(() => {
    if (article.isPaid && !canView && !hasPurchased) {
      setShowModal(true);
    }
  }, [article.isPaid, canView, hasPurchased]);

  // Tạo link QR code
  useEffect(() => {
    if (showModal && userId) {
      const createQR = async () => {
        const res = await fetch("/api/sepay/checkout", {
          method: "POST",
          body: JSON.stringify({
            articleId: article.id,
            price: article.price || 20000,
            userId,
          }),
        });
        const data = await res.json();
        setQrUrl(data.qrUrl);
      };
      createQR();
    }
  }, [showModal, userId, article.id, article.price]);

  const shouldShowLoginModal = article.isPaid && !userId;

  return (
    <>
      <div
        className={`relative ${
          showModal ? "blur-sm opacity-10 pointer-events-none select-none" : ""
        }`}
      >
        <article
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Modal: Yêu cầu đăng nhập */}
      {shouldShowLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              Bạn cần đăng nhập thành viên
            </h2>
            <p className="mb-6">
              Vui lòng đăng nhập để xem nội dung bài viết trả phí.
            </p>
            <button
              onClick={() => (window.location.href = "/sign-in")}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      )}

      {/* Modal: Thanh toán QR */}
      {userId && showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full relative flex flex-wrap gap-6 shadow-lg">
            {/* Bên trái: Thông tin thanh toán */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Bài viết trả phí</h2>
              <p className="mb-4">
                Giá: <strong>20.000đ</strong>
              </p>
              <p className="text-sm mb-2">Thông tin chuyển khoản:</p>
              <ul className="text-sm mb-4 list-disc list-inside">
                <li>Ngân hàng: BIDV</li>
                <li>Số tài khoản: 8870436905</li>
                <li>Chủ tài khoản: Vũ Anh Tú</li>
                <li>
                  Nội dung: BLOG-{article.id}-{userId}
                </li>
              </ul>
              <button
                onClick={() => {
                  if (userId) setShowModal(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                Mua bài viết này
              </button>
            </div>
            {/* Bên phải: QR code */}
            <div className="flex-1 flex items-center justify-center">
              {qrUrl ? (
                <Image
                  src={qrUrl}
                  alt="QR thanh toán"
                  width={200}
                  height={200}
                />
              ) : (
                <p className="text-center text-sm">Đang tạo mã QR...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
