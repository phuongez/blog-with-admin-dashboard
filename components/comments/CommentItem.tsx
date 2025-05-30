"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createGmailLink } from "@/lib/utils"; // helper function được tạo riêng (xem bên dưới)

type Comment = {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    name: string;
    email: string;
    imageUrl?: string | null;
  };
};

type Props = {
  comment: Comment;
  articleTitle: string;
  isAuthor: boolean;
  isAdmin: boolean;
};

export default function CommentItem({
  comment,
  articleTitle,
  isAuthor,
  isAdmin,
}: Props) {
  const gmailLink = createGmailLink({
    to: comment.author.email,
    subject: `Phản hồi bình luận trên bài viết: ${articleTitle}`,
    body: `Chào ${comment.author.name},\n\nTôi muốn phản hồi bình luận của bạn: "${comment.body}"\n\nTrân trọng,`,
  });

  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex gap-4 items-center">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.imageUrl || ""} />
          <AvatarFallback>
            {comment.author.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-2">
            <span className="font-medium text-foreground">
              {comment.author.name}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              {new Date(comment.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>
          <p className="text-muted-foreground">{comment.body}</p>
        </div>

        {(isAuthor || isAdmin) && (
          <div className="mt-2">
            <a
              href={gmailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Trả lời qua Gmail
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
