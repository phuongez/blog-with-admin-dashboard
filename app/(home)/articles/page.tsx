import { AllArticlesPage } from "@/components/articles/all-articles-page";
import ArticleSearchInput from "@/components/articles/article-search-input";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { fetchArticleByQuery } from "@/lib/query/fetch-articles";
import Link from "next/link";
import AllArticlesPageSkeleton from "@/components/articles/AllArticlesPageSkeleton";
import CategoriesTabs from "@/components/articles/CategoriesTabs";

const ITEMS_PER_PAGE = 6;

export default async function Page({ searchParams }: { searchParams?: any }) {
  const searchText = (await searchParams?.search) || "";
  const category = (await searchParams?.category) || "";
  const currentPage = (await Number(searchParams?.page)) || 1;
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
      <main className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8">
        <CategoriesTabs />
        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Tất cả bài viết
          </h1>
          <Suspense>
            <ArticleSearchInput />
          </Suspense>
        </div>

        {/* Pagination */}
        <div className="mt-12 mb-4 flex justify-center gap-2">
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
        {/* All Articles */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>
      </main>
    </div>
  );
}
