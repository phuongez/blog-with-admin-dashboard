"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCommentSchema = z.object({
  body: z.string().min(1),
  parentId: z.string().optional().nullable(),
});

type CreateCommentFormState = {
  errors: {
    body?: string[];
    formErrors?: string[];
  };
};

export const createComments = async (
  articleId: string,
  prevState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> => {
  const result = createCommentSchema.safeParse({
    body: formData.get("body") as string,
    parentId: formData.get("parentId") as string | null,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You have to login first"],
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!existingUser) {
    return {
      errors: {
        formErrors: ["User not found. Please register before adding comment."],
      },
    };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        body: result.data.body,
        authorId: existingUser.id,
        articleId,
        parentId: result.data.parentId || null,
      },
    });

    // Lấy thông tin bài viết
    const article = await prisma.articles.findUnique({
      where: { id: articleId },
      select: { authorId: true },
    });

    if (result.data.parentId) {
      // Là trả lời bình luận → gửi cho tác giả comment gốc
      const parentComment = await prisma.comment.findUnique({
        where: { id: result.data.parentId },
        select: { authorId: true },
      });

      if (
        parentComment &&
        parentComment.authorId !== existingUser.id // tránh tự gửi thông báo
      ) {
        await prisma.notification.create({
          data: {
            type: "reply",
            userId: parentComment.authorId,
            articleId,
            commentId: comment.id,
          },
        });
      }
    } else {
      // Là bình luận mới → gửi thông báo cho tác giả bài viết
      if (
        article?.authorId &&
        article.authorId !== existingUser.id // tránh tự gửi thông báo
      ) {
        await prisma.notification.create({
          data: {
            type: "comment",
            userId: article.authorId,
            articleId,
            commentId: comment.id,
          },
        });
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error while creating comment"],
        },
      };
    }
  }

  revalidatePath(`/articles/${articleId}`);
  return { errors: {} };
};
