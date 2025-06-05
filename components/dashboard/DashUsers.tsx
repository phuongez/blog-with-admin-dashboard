"use client";

import { useEffect, useState, useTransition } from "react";
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
import { Trash, ShieldBan } from "lucide-react";
import Image from "next/image";

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: "ADMIN" | "AUTHOR" | "USER";
  createdAt: string;
};

const DashUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/admin/users?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setLoading(false);
    };

    fetchUsers();
  }, [page]);

  const handleBan = async (userId: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn ban user này?");
    if (!confirm) return;
    await fetch(`/api/admin/users/${userId}/ban`, { method: "POST" });
  };

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá user này?");
    if (!confirm) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== userId));
  };

  if (loading)
    return <p className="text-center mt-8">Đang tải người dùng...</p>;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                      )}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleBan(user.id)}
                        >
                          <ShieldBan size={16} className="mr-1" />
                          Ban
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash size={16} className="mr-1" />
                          Xoá
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="block md:hidden space-y-4 mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 shadow-sm bg-background"
              >
                <div className="flex gap-4 items-center">
                  <div className="min-w-[12%]">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={35}
                        height={35}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div className="w-[60%]">
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-xs text-muted-foreground mb-0">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vai trò: {user.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ngày tạo:{" "}
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleBan(user.id)}
                    >
                      <ShieldBan size={16} className="mr-1" />
                      Ban
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash size={16} className="mr-1" />
                      Xoá
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
    </div>
  );
};

export default DashUsers;
