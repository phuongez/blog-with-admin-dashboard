"use client";

import type { Prisma } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentItem from "./CommentItem";

type CommentListProps = {
  comments: Prisma.CommentGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>[];
  user: any;
  article: any;
};
const CommentList: React.FC<CommentListProps> = ({
  comments,
  user,
  article,
}) => {
  const isAuthor = user?.userid === article.authorId;
  const isAdmin = user?.role === "ADMIN";
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          articleTitle={article.title}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};

export default CommentList;
