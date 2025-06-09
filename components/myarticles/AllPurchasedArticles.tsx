import ArticleCard from "../ArticleCard";
import { Prisma } from "@prisma/client";

type ArticleWithAuthor = Prisma.ArticlesGetPayload<{
  include: { author: true };
}>;

type Props = {
  articles: ArticleWithAuthor[];
};

export function AllPurchasedArticles({ articles }: Props) {
  if (articles.length === 0)
    return (
      <p className="text-center text-muted-foreground">
        Không có bài viết đã mua
      </p>
    );

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
