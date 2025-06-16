import React from "react";
import { Card } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ArticleCard = ({ article }: any) => {
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
  return (
    <Card className="group relative overflow-hidden transition-all shadow-none hover:shadow-lg">
      {article.isPaid && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded z-10">
          Trả phí
        </div>
      )}

      <div className="p-6">
        {/* Image Container */}
        <Link href={`/articles/${article.slug}`} className="block">
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
            <Image
              src={article.featuredImage as string}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </Link>

        {/* Article Title */}
        <Link href={`/articles/${article.slug}`} className="block">
          <h1 className="text-xl font-semibold text-foreground mb-2 hover:text-primary">
            {article.title}
          </h1>
        </Link>
        <h2 className="relative mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
          {article.subtitle}
          <Link href={`/articles/${article.slug}`}>
            <span className="font-bold pl-2 mb-0 text-sm sm:text-base text-primary">
              Xem tiếp
            </span>
          </Link>
        </h2>

        {/* Category & Read time */}
        <div className="flex justify-between items-center mt-4">
          <p className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {slugToCategory(article.category)}
          </p>
          <p className="text-primary text-sm">
            {getReadingTime(article.content)} phút đọc
          </p>
        </div>

        {/* Author & Metadata */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author.imageUrl as string} />
              <AvatarFallback>{article.author.name}</AvatarFallback>
            </Avatar>
            <Link href={`/authors/${article.author.id}`}>
              <span className="text-sm text-muted-foreground hover:text-primary">
                {article.author.name}
              </span>
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date(article.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
