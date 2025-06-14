// components/UserProfileHistoryTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { FilePenLine, Trash } from "lucide-react";

interface Profile {
  id: string;
  gender: string;
  weight: number;
  height: number;
  age: number;
  bodyfat: number;
  activity: number;
  createdAt: string;
}

export default function UserProfileHistoryTable() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editing, setEditing] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/user/history?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfiles(data || []));
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Bạn có chắc muốn xoá lần lưu này?");
    if (!confirmed) return;
    await fetch(`/api/user/history?id=${id}`, { method: "DELETE" });
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await fetch("/api/user/history", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    const res = await fetch(`/api/user/history?userId=${user?.id}`);
    const data = await res.json();
    setProfiles(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-lg md:text-xl font-semibold mb-2">
        Lịch sử hồ sơ đã lưu
      </h2>
      <Table>
        <TableHeader>
          <TableRow className="text-xs md:text-sm">
            <TableHead>Cân nặng</TableHead>
            <TableHead>Chiều cao</TableHead>

            <TableHead>% Mỡ</TableHead>

            <TableHead>Thời gian</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((p) => (
            <TableRow key={p.id} className="text-xs md:text-sm">
              <TableCell>{p.weight} kg</TableCell>
              <TableCell>{p.height} cm</TableCell>

              <TableCell>{p.bodyfat}%</TableCell>

              <TableCell>
                {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </TableCell>
              <TableCell className="grid grid-cols-2 gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(p)}
                >
                  <FilePenLine className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[90%] max-w-md">
            <h3 className="font-bold mb-2">Sửa hồ sơ</h3>

            <label className="block">Giới tính</label>
            <select
              value={editing.gender}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  gender: e.target.value as "male" | "female",
                })
              }
              className="border p-1 w-full mb-2"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>

            <label className="block">Cân nặng (kg)</label>
            <input
              type="number"
              value={editing.weight}
              onChange={(e) =>
                setEditing({ ...editing, weight: parseFloat(e.target.value) })
              }
              className="border p-1 w-full mb-2"
            />

            <label className="block">Chiều cao (cm)</label>
            <input
              type="number"
              value={editing.height}
              onChange={(e) =>
                setEditing({ ...editing, height: parseFloat(e.target.value) })
              }
              className="border p-1 w-full mb-2"
            />

            <label className="block">Tuổi</label>
            <input
              type="number"
              value={editing.age}
              onChange={(e) =>
                setEditing({ ...editing, age: parseInt(e.target.value) })
              }
              className="border p-1 w-full mb-2"
            />

            <label className="block">Tỷ lệ mỡ cơ thể (%)</label>
            <input
              type="number"
              value={editing.bodyfat}
              onChange={(e) =>
                setEditing({ ...editing, bodyfat: parseFloat(e.target.value) })
              }
              className="border p-1 w-full mb-2"
            />

            <label className="block">Hệ số vận động</label>
            <select
              value={editing.activity}
              onChange={(e) =>
                setEditing({ ...editing, activity: parseFloat(e.target.value) })
              }
              className="border p-1 w-full mb-4"
            >
              <option value="1.2">Ít vận động</option>
              <option value="1.375">Vận động nhẹ</option>
              <option value="1.55">Vận động trung bình</option>
              <option value="1.725">Vận động nhiều</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Hủy
              </Button>
              <Button onClick={handleUpdate}>Lưu</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
