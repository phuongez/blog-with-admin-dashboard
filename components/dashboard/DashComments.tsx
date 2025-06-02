"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const ITEMS_PER_PAGE = 10;

type CommentWithArticle = {
  id: string;
  body: string;
  createdAt: string;
  article: {
    id: string;
    title: string;
    featuredImage: string;
    authorId: string;
    slug: string;
  };
  author: {
    name: string;
    email: string;
  };
};

export default function DashComments() {
  const { user } = useUser();
  const [comments, setComments] = useState<CommentWithArticle[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const isAdmin = user?.publicMetadata.role === "ADMIN";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `/api/dashboard/comments?page=${page}&limit=${ITEMS_PER_PAGE}`
        );

        if (!res.ok) {
          throw new Error("Lỗi khi lấy danh sách bình luận");
        }

        const data = await res.json();
        setComments(data.comments);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [page]);

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Bình luận người dùng</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bài viết</TableHead>
                  <TableHead>Người bình luận</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((cmt) => (
                  <TableRow key={cmt.id}>
                    <TableCell>
                      {cmt.article.slug && (
                        <Link
                          href={`/articles/${cmt.article.slug}`}
                          className="text-blue-600"
                        >
                          {cmt.article.title}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      {cmt.author.name}
                      {cmt.article.authorId === user?.id && (
                        <span className="ml-2 text-xs text-primary font-semibold">
                          (Tác giả)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{cmt.body}</TableCell>
                    <TableCell>
                      {new Date(cmt.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="block md:hidden space-y-4">
            {comments.map((cmt) => (
              <div
                key={cmt.id}
                className="border rounded-lg p-4 shadow-sm bg-background"
              >
                <Link href={`/articles/${cmt.article.slug}`}>
                  <div className="flex gap-4">
                    <div className="w-[30%]">
                      <Image
                        src={cmt.article.featuredImage}
                        alt={cmt.article.title}
                        width={100}
                        height={75}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="w-[70%]">
                      <h3 className="font-semibold text-md">
                        {cmt.article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(cmt.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">
                      {cmt.author.name}:
                    </span>{" "}
                    <span className="text-sm">{cmt.body}</span>
                  </div>
                </Link>
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
            <Button variant="destructive" size="sm">
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
}
