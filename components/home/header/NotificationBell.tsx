"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  type: string;
  articleId: string;
  commentId: string;
  comment: {
    author: {
      name: string;
    };
  };
  article: {
    title: string;
  };
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const handleClick = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
      >
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              Không có thông báo mới
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={`/articles/${n.articleId}#comment-${n.commentId}`}
                onClick={() => handleClick(n.id)}
              >
                <div className="hover:bg-gray-100 px-4 py-2 border-t text-sm text-gray-800 cursor-pointer">
                  Người dùng{" "}
                  <span className="font-semibold">{n.comment.author.name}</span>{" "}
                  đã{" "}
                  {n.type === "comment"
                    ? "bình luận vào"
                    : "trả lời bình luận trong"}{" "}
                  bài viết{" "}
                  <span className="font-semibold">"{n.article.title}"</span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
