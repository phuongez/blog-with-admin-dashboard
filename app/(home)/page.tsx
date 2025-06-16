import CategoriesTabs from "@/components/articles/CategoriesTabs";
import BlogFooter from "@/components/home/blog-footer";
import SearchInput from "@/components/home/header/search-input";
import RightMenu from "@/components/home/RightMenu";
import { TopArticles } from "@/components/home/top-articles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";

const page = async () => {
  return (
    <main>
      <CategoriesTabs />
      <div className="md:hidden px-8 sm:px-36 mb-4">
        <SearchInput />
      </div>
      <section className="relative px-4 md:px-24 xl:px-32 py-4 lg:py-4 flex gap-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Bài viết mới nhất
            </h2>
          </div>

          {/* Top Articles */}
          <Suspense fallback={<h1>Loading....</h1>}>
            <TopArticles />
          </Suspense>

          <div className="mt-12 text-center">
            <Link href={"/articles"}>
              <Button className="rounded-md px-8 py-6 text-lg">
                Xem Tất Cả Bài Viết
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-[35%] hidden lg:block">
          <RightMenu />
        </div>
      </section>
    </main>
  );
};

export default page;
