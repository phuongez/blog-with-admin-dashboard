"use client";

import React, { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { deleteArticle } from "@/actions/delete-article";
import { Heart, MessageCircle, Trash } from "lucide-react";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  featuredImage: string;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
    purchases: number;
  };
  comments: {
    id: string;
    authorId: string;
    createdAt: string;
    body: string;
    articleId: string;
  }[];
};

type RecentArticlesProps = {
  articles: Article[];
};

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles }) => {
  return (
    <Card className="mb-8 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg p-0">Bài viết mới</CardTitle>
          <Link href="/articles">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Xem tất cả →
            </Button>
          </Link>
        </div>
      </CardHeader>
      {!articles || !articles.length ? (
        <CardContent>Không có bài viết.</CardContent>
      ) : (
        <CardContent>
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
                {articles.slice(0, 10).map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>{article._count.likes}</TableCell>
                    <TableCell>{article.comments?.length ?? 0}</TableCell>
                    <TableCell>
                      {new Date(article.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
          {/* Danh sách dạng card cho mobile */}
          <div className="block md:hidden space-y-4">
            {articles.slice(0, 5).map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 shadow-sm bg-background"
              >
                <div className="flex gap-4 relative">
                  <div className="w-[30%] h-[75px] overflow-hidden flex items-center justify-center rounded-md">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      width={100}
                      height={75}
                    />
                  </div>
                  <div className="w-[70%]">
                    <h3 className="font-semibold text-md">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 justify-between items-center">
                  <div className="flex justify-between mt-2 text-sm gap-4">
                    <span className="flex gap-2">
                      <Heart size={18} /> {article._count.likes}
                    </span>
                    <span className="flex gap-2">
                      <MessageCircle size={18} />{" "}
                      {article.comments?.length ?? 0}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      <Button size="sm">Sửa</Button>
                    </Link>
                    <DeleteButton articleId={article.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RecentArticles;

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
