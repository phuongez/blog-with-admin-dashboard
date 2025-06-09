import { useEffect, useState } from "react";

export function useCheckPurchase(articleId: string, userId: string) {
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (!articleId || !userId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/check-purchase?articleId=${articleId}&userId=${userId}`
        );
        const data = await res.json();
        setHasPurchased(data.hasPurchased);
      } catch (err) {
        console.error("Lỗi khi kiểm tra mua bài:", err);
      }
    };

    fetchData();
  }, [articleId, userId]);

  return hasPurchased;
}
