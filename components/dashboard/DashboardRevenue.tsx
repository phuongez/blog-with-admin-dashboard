"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type AuthorStat = {
  authorId: string;
  authorName: string;
  totalSold: number;
  totalRevenue: number;
};

type DashboardData = {
  totalRevenue: number;
  authorStats: AuthorStat[];
};

export default function DashboardRevenue() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/revenue")
      .then((res) => res.json())
      .then((data: DashboardData) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê doanh thu tháng này</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm">
            <strong>Tổng doanh thu:</strong>{" "}
            {data?.totalRevenue.toLocaleString()} VNĐ
          </p>

          {/* Bảng */}
          <Table className="w-full text-left text-sm">
            <TableHeader>
              <TableRow className="">
                <TableHead className="p-2">Tác giả</TableHead>
                <TableHead className="p-2">Bài viết đã bán</TableHead>
                <TableHead className="p-2">Doanh thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.authorStats.map((author) => (
                <TableRow key={author.authorId} className="border-t">
                  <TableCell className="p-2">{author.authorName}</TableCell>
                  <TableCell className="p-2">{author.totalSold}</TableCell>
                  <TableCell className="p-2">
                    {author.totalRevenue.toLocaleString()} VNĐ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Biểu đồ */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.authorStats || []}
                margin={{ top: 40, right: 20, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="authorName"
                  angle={-20}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                  label={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} label={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="totalRevenue"
                  fill="#8884d8"
                  name="Doanh thu"
                  barSize={40}
                  minPointSize={5}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
