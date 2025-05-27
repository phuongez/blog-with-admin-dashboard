import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import Link from "next/link";

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
        <Card
          key={article.id}
          className="group relative overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="p-6">
            <Link href={`/articles/${article.slug}`}>
              {/* Image Container */}
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                <Image
                  src={article.featuredImage as string}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Article Content */}
              <h3 className="text-xl font-semibold text-foreground h-[4rem]">
                {article.title}
              </h3>
              <div className="flex justify-between items-center">
                <p className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {slugToCategory(article.category)}
                </p>
                <p className="text-primary text-sm">
                  {getReadingTime(article.content)} phút đọc
                </p>
              </div>

              {/* Author & Metadata */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author.imageUrl as string} />
                    <AvatarFallback>{article.author.name}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {article.author.name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Link>
          </div>
        </Card>
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
        No Results Found
      </h3>

      {/* Description */}
      <p className="mt-2 text-muted-foreground">
        We could not find any articles matching your search. Try a different
        keyword or phrase.
      </p>
    </div>
  );
}
