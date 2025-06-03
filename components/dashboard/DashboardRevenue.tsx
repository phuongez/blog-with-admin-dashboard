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
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Thống kê doanh thu tháng này</h2>

      <p className="text-lg">
        <strong>Tổng doanh thu:</strong> {data?.totalRevenue.toLocaleString()}{" "}
        VNĐ
      </p>

      {/* Bảng */}
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Tác giả</th>
            <th className="p-2">Bài viết đã bán</th>
            <th className="p-2">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {data?.authorStats.map((author) => (
            <tr key={author.authorId} className="border-t">
              <td className="p-2">{author.authorName}</td>
              <td className="p-2">{author.totalSold}</td>
              <td className="p-2">
                {author.totalRevenue.toLocaleString()} VNĐ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Biểu đồ */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data?.authorStats || []}
            margin={{ top: 20, right: 20, left: 10, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="authorName" angle={-20} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalRevenue" fill="#8884d8" name="Doanh thu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
