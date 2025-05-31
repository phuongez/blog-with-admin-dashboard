import { useEffect, useState } from "react";

export function useCheckPurchase(articleId: string, userId: string) {
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/check-purchase?articleId=${articleId}&userId=${userId}`
      );
      const { hasPurchased } = await res.json();
      if (hasPurchased) {
        setPaid(true);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [articleId, userId]);

  return paid;
}
