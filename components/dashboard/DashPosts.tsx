"use client";

import { useEffect, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteArticle } from "@/actions/delete-article";

type Article = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  featuredImage: string;
  authorId: string;
  _count: {
    likes: number;
  };
  comments?: { id: string }[];
};

const ITEMS_PER_PAGE = 10;

const DashPosts = () => {
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard/posts?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
      setLoading(false);
    };

    if (user?.id) {
      fetchArticles();
    }
  }, [user?.id, page]);

  //   const isEmpty = !articles || articles.length === 0;

  if (loading) return <p className="text-center mt-8">Đang tải dữ liệu...</p>;

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Lượt thích</TableHead>
                  <TableHead>Bình luận</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>{article._count.likes}</TableCell>
                    <TableCell>{article.comments?.length ?? 0}</TableCell>
                    <TableCell>
                      {new Date(article.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Button size="sm">Sửa</Button>
                        </Link>
                        <DeleteButton articleId={article.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="block md:hidden space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 shadow-sm bg-background"
              >
                <div className="flex gap-4">
                  <div className="w-[30%]">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      width={100}
                      height={75}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="w-[70%]">
                    <h3 className="font-semibold text-md">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-4 text-sm">
                    <span className="flex gap-1 items-center">
                      <Heart size={16} /> {article._count.likes}
                    </span>
                    <span className="flex gap-1 items-center">
                      <MessageCircle size={16} />
                      {article.comments?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      <Button size="sm">Sửa</Button>
                    </Link>
                    <DeleteButton articleId={article.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              ← Trước
            </Button>
            <Button variant="destructive" size={"sm"}>
              {page}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * ITEMS_PER_PAGE >= total}
            >
              Sau →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashPosts;

type DeleteButtonProps = {
  articleId: string;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ articleId }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        const confirm = window.confirm(
          "Bạn có chắc chắn muốn xoá bài viết này?"
        );
        if (!confirm) return;
        startTransition(async () => {
          await deleteArticle(articleId);
        });
      }}
    >
      <Button disabled={isPending} variant="ghost" size="sm" type="submit">
        {<Trash className="h-4 w-4" />}
      </Button>
    </form>
  );
};
