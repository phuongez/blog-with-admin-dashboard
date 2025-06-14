"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type UserProfileHistory = {
  id: string;
  weight: number;
  bodyfat: number;
  createdAt: string;
};

export default function UserProfileChart() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState<UserProfileHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/history?userId=${user?.id}`);
        const json = await res.json();

        if (!Array.isArray(json)) return;

        const sorted = json
          .slice(0, 10)
          .sort(
            (a: UserProfileHistory, b: UserProfileHistory) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        setData(sorted);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu lịch sử", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user, router]);

  if (!user || loading)
    return <p className="text-center">Đang tải dữ liệu...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biến động cân nặng & tỷ lệ mỡ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: 500 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="createdAt"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })
                  }
                  interval="preserveStartEnd"
                  minTickGap={20}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Kg",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "% Mỡ",
                    angle: -90,
                    position: "insideRight",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  name="Cân nặng (kg)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bodyfat"
                  stroke="#82ca9d"
                  name="Tỷ lệ mỡ (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
