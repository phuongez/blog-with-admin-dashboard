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
    <Card className="group relative transition-all hover:shadow-lg min-w-60 max-w-60 flex-1 p-4 md:p-6">
      {article.isPaid && (
        <div className="absolute -top-2 right-2 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded z-10">
          Trả phí
        </div>
      )}

      <div className="flex gap-4">
        <div className="block w-[65%]">
          {/* Image Container */}
          <Link href={`/articles/${article.slug}`}>
            <div className="relative mb-4 w-full h-20 overflow-hidden ">
              <Image
                src={article.featuredImage as string}
                alt={article.title}
                fill
                sizes="max-width: 100% max-height: 100%"
                className="object-cover rounded-xl"
              />
            </div>
          </Link>
        </div>
        {/* Category & Read time */}
        <div className="flex flex-col items-center gap-2">
          <p className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
            {slugToCategory(article.category)}
          </p>
          <p className="text-primary text-xs">
            {getReadingTime(article.content)} phút đọc
          </p>
          <div className="text-xs text-muted-foreground">
            {new Date(article.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Article Title */}
      <div className="">
        <Link href={`/articles/${article.slug}`} className="block">
          <h1 className="text-sm md:text-base font-semibold text-foreground hover:underline">
            {article.title}
          </h1>
        </Link>
      </div>
    </Card>
  );
};

export default ArticleCard;
