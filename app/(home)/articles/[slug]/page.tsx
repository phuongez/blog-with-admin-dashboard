import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await prisma.articles.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    return {
      title: "Bài viết không tồn tại",
      description: "Không tìm thấy bài viết yêu cầu.",
    };
  }

  return {
    title: article.title,
    description: article.subtitle || article.title,
    openGraph: {
      title: article.title,
      description: article.subtitle || article.title,
      url: `https://your-domain.com/articles/${article.slug}`,
      type: "article",
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

const page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const article = await prisma.articles.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!article) {
    return <h1>Article not found.</h1>;
  }

  const { userId: clerkUserId } = await auth();

  // Nếu chưa đăng nhập, không được xem nếu bài viết trả phí
  if (!clerkUserId && article.isPaid) {
    return redirect("/login");
  }

  const user = clerkUserId
    ? await prisma.user.findUnique({ where: { clerkUserId } })
    : null;

  const isAuthor = user?.id === article.author.id;
  const isAdmin = user?.role === "ADMIN";
  const isFree = article.isPaid === false;

  let hasPurchased = false;

  if (user && article.isPaid) {
    const purchase = await prisma.articlePurchase.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId: article.id,
        },
      },
    });

    hasPurchased = !!purchase;
  }

  const canView = isFree || isAuthor || isAdmin || hasPurchased;

  if (!canView) {
    return redirect("/paywall");
  }

  return (
    <div>
      <ArticleDetailPage article={article} />
    </div>
  );
};

export default page;
