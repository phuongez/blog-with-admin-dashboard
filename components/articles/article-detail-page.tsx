// components/articles/article-detail-page.tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Prisma } from "@prisma/client";
import CommentForm from "../comments/comment-form";
import CommentList from "../comments/comment-list";
import { prisma } from "@/lib/prisma";
import LikeButton from "./actions/like-button";
import "./articleDetail.css";
import ArticleContent from "./ArticleContent";
import { auth } from "@clerk/nextjs/server";

export type ArticleDetailPageProps = {
  article: Prisma.ArticlesGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
  canView: boolean;
};

type User = Prisma.UserGetPayload<{
  include: {
    articles: true;
    comments: true;
    likes: true;
    purchases: true;
  };
}>;

export async function ArticleDetailPage({
  article,
  canView,
}: ArticleDetailPageProps) {
  let isLiked = false;
  let isSignedIn = false;
  let user: User | null = null;
  const comments = await prisma.comment.findMany({
    where: {
      articleId: article.id,
    },
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

  const likes = await prisma.like.findMany({
    where: { articleId: article.id },
  });

  const { userId } = await auth();
  if (userId) {
    user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        articles: true,
        comments: true,
        likes: true,
        purchases: true,
      },
    });
    isLiked = likes.some((like) => like.userId === user?.id);
    isSignedIn = true;
  }

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
    return Math.ceil(numberOfWords / wordsPerMinute);
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 ">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {slugToCategory(article.category)}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 leading-[1.5]">
              {article.title}
              {article.isPaid && (
                <span className="px-3" title="Bài viết trả phí">
                  🔒
                </span>
              )}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author.imageUrl as string} />
                <AvatarFallback>{article.id}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {article.author.name}
                </p>
                <p className="text-sm">
                  {new Date(article.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {getReadingTime(article.content)} phút đọc
                </p>
              </div>
            </div>
          </header>

          <ArticleContent
            article={article}
            canView={canView}
            userId={user?.id || null}
          />

          <LikeButton
            articleId={article.id}
            articleTitle={article.title}
            articleSlug={article.slug}
            likes={likes}
            isLiked={false}
            isSignedIn={false}
          />

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                {comments.length} Comments
              </h2>
            </div>

            <CommentForm
              articleId={article.id}
              isSignedIn={isSignedIn}
              userImage={user?.imageUrl as string}
            />
            <CommentList comments={comments} user={user} article={article} />
          </Card>
        </article>
      </main>
    </div>
  );
}
