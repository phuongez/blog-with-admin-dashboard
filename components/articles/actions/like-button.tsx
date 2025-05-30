"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Share2, ThumbsUp } from "lucide-react";
import React, { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/actions/like-toggle";
import type { Like } from "@prisma/client";
import FbShareButton from "./FbShareButton";

type LikeButtonProps = {
  articleId: string;
  likes: Like[];
  isLiked: boolean;
  isSignedIn: boolean;
  articleTitle: string;
  articleSlug: string;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  articleId,
  likes,
  isLiked,
  isSignedIn,
  articleTitle,
  articleSlug,
}) => {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes.length);
  const [isPending, startTransition] = useTransition();

  const handleLike = async () => {
    startTransition(async () => {
      try {
        setOptimisticLikes(isLiked ? optimisticLikes - 1 : optimisticLikes + 1);
        await toggleLike(articleId);
      } catch (error: any) {
        alert(error.message || "Đã có lỗi xảy ra");
      }
    });
  };

  const handleSaveArticle = async () => {
    console.log("Save article");
    if (!isSignedIn) {
      alert("Bạn cần đăng nhập để lưu bài viết");
      return;
    }
    const res = await fetch("/api/save-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    });
    if (res.ok) {
      alert("Bài viết đã lưu");
    }
  };

  const handleShareArticle = () => {
    console.log("Share article");
  };

  return (
    <div className="flex gap-4 mb-12 border-t pt-8">
      <form action={handleLike}>
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={handleLike}
          disabled={isPending}
        >
          <ThumbsUp className="h-5 w-5" />
          {optimisticLikes}
        </Button>
      </form>
      <Button variant="ghost" className="gap-2" onClick={handleSaveArticle}>
        <Bookmark className="h-5 w-5" /> Lưu lại
      </Button>
      <FbShareButton
        url={`https://your-domain.com/articles/${articleSlug}`}
        title={articleTitle}
      />
    </div>
  );
};

export default LikeButton;
