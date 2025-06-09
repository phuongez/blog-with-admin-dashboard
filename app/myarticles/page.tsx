import { fetchSavedArticles } from "@/lib/query/fetch-saved-articles";
import { fetchPurchasedArticles } from "@/lib/query/fetch-purchased-articles";
import { MyArticlesTabs } from "@/components/myarticles/MyArticlesTabs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 6;

export default async function Page({ searchParams }: any) {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  const tab = searchParams.tab || "saved";
  const page = parseInt(searchParams.page) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const saved = await fetchSavedArticles(user, skip, ITEMS_PER_PAGE);
  const purchased = await fetchPurchasedArticles(user, skip, ITEMS_PER_PAGE);

  const savedPagination = (
    <Pagination total={saved.total} currentPage={page} tab="saved" />
  );
  const purchasedPagination = (
    <Pagination total={purchased.total} currentPage={page} tab="purchased" />
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Bài viết của tôi</h1>
      <MyArticlesTabs
        saved={{ articles: saved.articles, pagination: savedPagination }}
        purchased={{
          articles: purchased.articles,
          pagination: purchasedPagination,
        }}
      />
    </div>
  );
}

function Pagination({
  total,
  currentPage,
  tab,
}: {
  total: number;
  currentPage: number;
  tab: string;
}) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  return (
    <div className="mt-8 flex justify-center gap-2">
      <Link href={`?tab=${tab}&page=${currentPage - 1}`}>
        <Button variant="ghost" size="sm" disabled={currentPage === 1}>
          ← Trước
        </Button>
      </Link>

      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <Link key={pageNum} href={`?tab=${tab}&page=${pageNum}`}>
            <Button
              variant={pageNum === currentPage ? "destructive" : "ghost"}
              size="sm"
            >
              {pageNum}
            </Button>
          </Link>
        );
      })}

      <Link href={`?tab=${tab}&page=${currentPage + 1}`}>
        <Button variant="ghost" size="sm" disabled={currentPage === totalPages}>
          Sau →
        </Button>
      </Link>
    </div>
  );
}
