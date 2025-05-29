import BlogFooter from "@/components/home/blog-footer";
import { Navbar } from "@/components/home/header/navbar";
import SearchInput from "@/components/home/header/search-input";
import HeroSection from "@/components/home/hero-section";
import RightMenu from "@/components/home/RightMenu";
import { TopArticles } from "@/components/home/top-articles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";

const page = async () => {
  return (
    <main>
      <div className="flex flex-wrap gap-4 lg:hidden px-4 md:px-24 py-8 mx-auto justify-center">
        <Link
          href="/articles"
          className="bg-black text-white w-fit px-4 py-2 rounded-md"
        >
          Tất cả
        </Link>
        <Link
          href="/articles?category=dinhduong"
          className="bg-gray-100 hover:bg-gray-200 text-black w-fit px-4 py-2 rounded-md"
        >
          Dinh dưỡng
        </Link>
        <Link
          href="/articles?category=luyentap"
          className="bg-gray-100 hover:bg-gray-200 text-black w-fit px-4 py-2 rounded-md"
        >
          Luyện tập
        </Link>
        <Link
          href="/articles?category=loisong"
          className="bg-gray-100 hover:bg-gray-200 text-black w-fit px-4 py-2 rounded-md"
        >
          Lối sống
        </Link>
        <Link
          href="/articles?category=khac"
          className="bg-gray-100 hover:bg-gray-200 text-black w-fit px-4 py-2 rounded-md"
        >
          Khác
        </Link>
      </div>
      <div className="md:hidden px-8 sm:px-36 mb-4">
        <SearchInput />
      </div>
      <section className="relative px-4 md:px-24 xl:px-32 py-4 lg:py-24 flex gap-16">
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
              <Button className="rounded-md px-8 py-6 text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900">
                Xem Tất Cả Bài Viết
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-[35%] hidden lg:block">
          <RightMenu />
        </div>
      </section>
      <BlogFooter />
    </main>
  );
};

export default page;
