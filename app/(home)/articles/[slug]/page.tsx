import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { prisma } from "@/lib/prisma";
import React from "react";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

const page: React.FC<ArticlePageProps> = async ({ params }) => {
  const article = await prisma.articles.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
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
  return (
    <div>
      <ArticleDetailPage article={article} />
    </div>
  );
};

export default page;
