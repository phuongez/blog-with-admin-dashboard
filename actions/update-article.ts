"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { sub } from "date-fns";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const updateArticleSchema = z.object({
  title: z.string().min(3).max(100),
  subtitle: z.string().min(3),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
  isPaid: z.string().refine((val) => val === "paid" || val === "free", {
    message: "Bạn phải chọn loại bài viết",
  }),
  showToc: z
    .preprocess(
      (val) => val === "on" || val === "true" || val === true,
      z.boolean()
    )
    .optional(),
});

type UpdateArticleFormState = {
  errors: {
    title?: string[];
    slug?: string[];
    subtitle?: string[];
    category?: string[];
    content?: string[];
    isPaid?: string[];
    showToc?: string[];
    featuredImage?: string[];
    formErrors?: string[];
  };
};

export const updateArticles = async (
  articleId: string,
  prevState: UpdateArticleFormState,
  formData: FormData
): Promise<UpdateArticleFormState> => {
  const result = updateArticleSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    category: formData.get("category"),
    content: formData.get("content"),
    isPaid: formData.get("isPaid"),
    showToc: formData.get("showToc"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const isPaidBoolean = result.data.isPaid === "paid";

  const { userId } = await auth();
  if (!userId) {
    return {
      errors: { formErrors: ["You must be logged in to update an article."] },
    };
  }

  const existingArticle = await prisma.articles.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    return {
      errors: { formErrors: ["Article not found."] },
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || existingArticle.authorId !== user.id) {
    return {
      errors: { formErrors: ["You are not authorized to edit this article."] },
    };
  }

  let imageUrl = existingArticle.featuredImage;

  const imageFile = formData.get("featuredImage") as File | null;
  if (imageFile && imageFile.name !== "undefined") {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );

      if (uploadResult?.secure_url) {
        imageUrl = uploadResult.secure_url;
      } else {
        return {
          errors: {
            featuredImage: ["Failed to upload image. Please try again."],
          },
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          errors: { formErrors: [error.message] },
        };
      } else {
        return {
          errors: {
            formErrors: ["Error uploading image. Please try again."],
          },
        };
      }
    }
  }

  try {
    await prisma.articles.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        subtitle: result.data.subtitle,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageUrl,
        isPaid: isPaidBoolean,
        showToc: result.data.showToc,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: { formErrors: [error.message] },
      };
    } else {
      return {
        errors: {
          formErrors: ["Failed to update the article. Please try again."],
        },
      };
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
};
