"use client";

import React, { useActionState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComments } from "@/actions/create-comment";

type CommentFormProps = {
  articleId: string;
  isSignedIn: boolean;
  userImage: string;
  parentId?: string; // dùng nếu là reply
};

const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  isSignedIn,
  userImage,
  parentId,
}) => {
  const [formState, action, isPending] = useActionState(
    createComments.bind(null, articleId),
    { errors: {} }
  );

  return (
    <form action={action} className="mb-8">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userImage} />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Input
            placeholder={
              parentId
                ? "Trả lời bình luận này..."
                : "Để lại bình luận của bạn..."
            }
            name="body"
            className="py-6 text-base"
          />

          {/* Hidden input nếu là reply */}
          {parentId && <input type="hidden" name="parentId" value={parentId} />}

          {/* Hiển thị lỗi */}
          {formState.errors.body && (
            <p className="text-red-600 text-sm font-medium mt-2">
              {formState.errors.body}
            </p>
          )}
          {formState.errors.formErrors && (
            <div className="p-2 border border-red-600 bg-red-100 mt-2 text-sm">
              {formState.errors.formErrors[0]}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              disabled={isPending || !isSignedIn}
              type="submit"
              className="px-6"
            >
              {isPending ? "Đang gửi..." : parentId ? "Trả lời" : "Bình luận"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
