import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export async function TopArticles() {
  const articles = await prisma.articles.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
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
    <div className="flex flex-col gap-8 ">
      {articles.slice(0, 3).map((article) => (
        <Card
          key={article.id}
          className={cn(
            "group relative overflow-hidden transition-all hover:scale-[1.02]",
            "border border-gray-200/50 dark:border-white/10",
            "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg"
          )}
        >
          {article.isPaid && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-semibold px-2 py-1 rounded z-10">
              Trả phí
            </div>
          )}
          <div className="p-6 flex flex-col lg:flex-row items-center gap-8">
            {/* Image Container */}
            <Link
              href={`/articles/${article.slug}`}
              className="relative mb-4 w-full lg:w-[50%] aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={article.featuredImage as string}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </Link>
            <div className="w-full lg:w-[50%]">
              {/* Author Info */}
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.author.imageUrl as string} />
                  <AvatarFallback>
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/authors/${article.author.id}`}>
                  <span className="text-sm text-muted-foreground hover:underline">
                    {article.author.name}
                  </span>
                </Link>
                <span className="font-bold mb-0 text-sm text-primary">
                  {slugToCategory(article.category)}
                </span>
              </div>

              {/* Article Title */}
              <Link href={`/articles/${article.slug}`}>
                <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {article.title}
                </h1>
              </Link>
              <h2 className="relative mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
                {article.subtitle}
                <Link href={`/articles/${article.slug}`}>
                  <span className="font-bold pl-2 mb-0 text-sm sm:text-base text-primary">
                    Xem tiếp
                  </span>
                </Link>
              </h2>

              {/* Article Meta Info */}
              <div className="mt-6 flex gap-3 items-center text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {new Date(article.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-primary">
                  {getReadingTime(article.content)} phút đọc
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
