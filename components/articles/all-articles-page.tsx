import { Search } from "lucide-react";
import { Prisma } from "@prisma/client";
import ArticleCard from "../ArticleCard";

type SearchPageProps = {
  articles: Prisma.ArticlesGetPayload<{
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
};

export function AllArticlesPage({ articles }: SearchPageProps) {
  function slugToCategory(slug: string): string {
    const map: Record<string, string> = {
      dinhduong: "Dinh dưỡng",
      luyentap: "Luyện tập",
      loisong: "Lối sống",
      khac: "Khác",
    };

    return map[slug] ?? slug;
  }

  function getReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const numberOfWords = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(numberOfWords / wordsPerMinute);
    return minutes;
  }

  if (articles.length === 0) return <NoSearchResults />;

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground">
        Không tìm thấy kết quả
      </h3>

      {/* Description */}
      <p className="mt-2 text-muted-foreground">
        Chúng tôi không tìm thấy bài viết nào có chứa từ khoá tìm kiếm. Hãy thử
        tìm kiếm bằng từ khoá khác.
      </p>
    </div>
  );
}
