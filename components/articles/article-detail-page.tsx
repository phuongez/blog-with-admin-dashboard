import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Prisma } from "@prisma/client";
import CommentForm from "../comments/comment-form";
import CommentList from "../comments/comment-list";
import { prisma } from "@/lib/prisma";
import LikeButton from "./actions/like-button";
import { auth } from "@clerk/nextjs/server";
import "./articleDetail.css";

type ArticleDetailPageProps = {
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
};

type User = Prisma.UserGetPayload<{
  include: {
    articles: true;
    comments: true;
    likes: true;
    purchases: true;
  };
}>;

export async function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  let isLiked = false;
  let isSignedIn = false;
  let user: User | null;
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
      where: { clerkUserId: userId as string },
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

  // Tính thời gian đọc
  function getReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const numberOfWords = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(numberOfWords / wordsPerMinute);
    return minutes;
  }

  function stripInlineStyles(html: string) {
    return html.replace(/style="[^"]*"/g, "");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reuse your existing Navbar */}

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 ">
        <article className="mx-auto max-w-3xl">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                {slugToCategory(article.category)}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 leading-[1.5]">
              {article.title}
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

          {/* Article Content */}
          <section
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{
              __html: stripInlineStyles(article.content),
            }}
          />

          {/* Article Actions */}
          <LikeButton
            articleId={article.id}
            articleTitle={article.title}
            articleSlug={article.slug}
            likes={likes}
            isLiked={isLiked}
            isSignedIn={isSignedIn}
          />

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                {comments.length} Comments
              </h2>
            </div>

            {/* Comment Form */}
            {user && (
              <CommentForm
                articleId={article.id}
                isSignedIn={isSignedIn}
                userImage={user?.imageUrl || ""}
              />
            )}

            {/* Comments List */}
            <CommentList comments={comments} user={user} article={article} />
          </Card>
        </article>
      </main>
    </div>
  );
}
