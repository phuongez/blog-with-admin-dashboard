import { fetchSavedArticles } from "@/lib/query/fetch-saved-articles";
import React, { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArticleSearchInput from "@/components/articles/article-search-input";
import { AllSavedArticles } from "@/components/articles/AllSavedArticles";

const ITEMS_PER_PAGE = 6;

type SearchPageProps = {
  searchParams: { page?: string };
};

const MyArticles: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const { userId } = await auth();
  if (!userId) return [];
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId as string },
  });

  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchSavedArticles(user, skip, take);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Các bài viết đã lưu
          </h1>
          <Suspense>
            <ArticleSearchInput />
          </Suspense>
        </div>

        {/* All Articles */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllSavedArticles articles={articles} />
        </Suspense>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          {/* Prev Button */}
          <Link href={`?page=${currentPage - 1}`} passHref>
            <Button variant="ghost" size="sm" disabled={currentPage === 1}>
              ← Trước
            </Button>
          </Link>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <Link key={pageNum} href={`?page=${pageNum}`} passHref>
                <Button
                  variant={currentPage === pageNum ? "destructive" : "ghost"}
                  size="sm"
                  disabled={currentPage === pageNum}
                >
                  {pageNum}
                </Button>
              </Link>
            );
          })}

          {/* Next Button */}
          <Link href={`?page=${currentPage + 1}`} passHref>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
            >
              Sau →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MyArticles;

export function AllArticlesPageSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="p-6">
            <Skeleton className="mb-4 h-48 w-full rounded-xl bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-1/2 rounded-lg" />
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-lg " />
              </div>
              <Skeleton className="h-4 w-24 rounded-lg " />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
