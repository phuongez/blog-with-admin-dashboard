"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(articleId: string) {
  const { userId } = await auth(); // Clerk's user ID
  if (!userId) {
    throw new Error("Bạn cần đăng nhập để thích bài viết");
  }

  // Ensure the user exists in the database
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("Không có người dùng này.");
  }

  // Check if the user has already liked the article
  const existingLike = await prisma.like.findFirst({
    where: { articleId, userId: user.id }, // Use `user.id`, not `clerkUserId`
  });

  if (existingLike) {
    // Unlike the article
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    // Like the article
    await prisma.like.create({
      data: { articleId, userId: user.id },
    });
  }

  // Return updated like count
  revalidatePath(`/article/${articleId}`);
}
