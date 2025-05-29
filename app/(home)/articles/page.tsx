import { AllArticlesPage } from "@/components/articles/all-articles-page";
import ArticleSearchInput from "@/components/articles/article-search-input";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import Link from "next/link";

type SearchPageProps = {
  searchParams: { search?: string; category?: string; page?: string };
};

const ITEMS_PER_PAGE = 3;

const page: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const searchText = searchParams.search || "";
  const category = searchParams.category || "";
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(
    searchText,
    skip,
    take,
    category // ✅ Truyền category vào
  );

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Tất cả bài viết
          </h1>
          <Suspense>
            <ArticleSearchInput />
          </Suspense>
        </div>

        {/* All Articles */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          {/* Prev Button */}
          <Link
            href={`?search=${searchText}&category=${category}&page=${
              currentPage - 1
            }`}
            passHref
          >
            <Button variant="ghost" size="sm" disabled={currentPage === 1}>
              ← Trước
            </Button>
          </Link>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            return (
              <Link
                key={pageNum}
                href={`?search=${searchText}&category=${category}&page=${pageNum}`}
                passHref
              >
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
          <Link
            href={`?search=${searchText}&category=${category}&page=${
              currentPage + 1
            }`}
            passHref
          >
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

export default page;

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
