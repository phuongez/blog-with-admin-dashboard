"use client";

import { useEffect, useState } from "react";
import { FileText, MessageCircle, PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecentArticles from "./recent-articles";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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

export function BlogDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<any>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [monthlyArticles, setMonthlyArticles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [monthlyUsers, setMonthlyUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);
      const res = await fetch("/api/dashboard/overview");
      const data = await res.json();

      setArticles(data.recentArticles || []);
      setTotalArticles(data.totalArticles || 0);
      setMonthlyArticles(data.articlesThisMonth || 0);
      setTotalUsers(data.totalUsers || 0);
      setMonthlyUsers(data.usersThisMonth || 0);
      setTotalComments(data.totalComments || 0);
      setUsers(data.recentUsers || []);
      setLoading(false);
    };

    loadOverview();
  }, []);

  if (loading) return <p className="text-center mt-8">Đang tải dữ liệu...</p>;

  return (
    <main className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-center md:text-left">
            Blog Dashboard
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Quản lý nội dung và phân tích chỉ số
          </p>
        </div>
        <Link href={"/dashboard/articles/create"}>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Bài viết mới
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số bài viết
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{monthlyArticles} trong tháng này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng bình luận
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cập nhật liên tục
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{monthlyUsers} trong tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="md:flex gap-4">
        {/* Người đăng kí mới */}

        <div className="md:w-[30%] rounded-xl border bg-card text-card-foreground shadow p-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Người dùng mới</h2>
            <Button asChild>
              <Link href="/dashboard?tab=users">Xem tất cả</Link>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh đại diện</TableHead>
                <TableHead>Tên người dùng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.slice(0, 10).map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Recent Articles */}
        {Array.isArray(articles) && articles.length > 0 && (
          <RecentArticles articles={articles} />
        )}
      </div>
    </main>
  );
}
