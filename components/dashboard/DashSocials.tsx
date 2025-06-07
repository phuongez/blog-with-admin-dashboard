"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SocialLinksPage() {
  const { user } = useUser();
  const [links, setLinks] = useState({
    gmail: "",
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
  });

  useEffect(() => {
    const metadata = user?.publicMetadata?.socialLinks as any;
    if (metadata) {
      setLinks((prev) => ({
        ...prev,
        ...metadata,
      }));
    }
  }, [user?.publicMetadata]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/social-links", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ socialLinks: links }),
      });

      if (!res.ok) throw new Error("Lỗi khi lưu dữ liệu");

      alert("Đã lưu liên kết xã hội!");
    } catch (err) {
      console.error(err);
      alert("Không thể lưu dữ liệu");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Liên kết xã hội</h2>
      {["gmail", "facebook", "instagram", "youtube", "tiktok"].map((key) => (
        <div key={key} className="mb-4">
          <label className="block mb-1 capitalize">{key}</label>
          <Input
            value={links[key as keyof typeof links]}
            onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
            placeholder={`Nhập ${key}`}
          />
        </div>
      ))}
      <Button onClick={handleSave}>Lưu thay đổi</Button>
    </div>
  );
}
