"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "../ui/label";

const GROUPS = [
  "All",
  "Starch",
  "Meat",
  "Fruit",
  "Nuts & Seeds",
  "Greens",
  "Proteins",
  "Others",
];

export default function FoodManagerPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [group, setGroup] = useState("All");
  const [newFood, setNewFood] = useState({
    name: "",
    group: "Starch",
    unit: "100g",
    protein: "",
    carb: "",
    fat: "",
    fiber: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFood, setEditingFood] = useState<typeof newFood | null>(null);

  const fetchFoods = async () => {
    const res = await fetch("/api/foods");
    const data = await res.json();
    setFoods(data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleCreate = async () => {
    await fetch("/api/foods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newFood,
        protein: parseFloat(newFood.protein),
        carb: parseFloat(newFood.carb),
        fat: parseFloat(newFood.fat),
        fiber: parseFloat(newFood.fiber),
      }),
    });
    setNewFood({
      name: "",
      group: "Starch",
      unit: "100g",
      protein: "",
      carb: "",
      fat: "",
      fiber: "",
    });
    fetchFoods();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/foods/${id}`, { method: "DELETE" });
    fetchFoods();
  };

  const handleUpdate = async (id: string) => {
    if (!editingFood) return;
    await fetch(`/api/foods/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingFood,
        protein: parseFloat(editingFood.protein),
        carb: parseFloat(editingFood.carb),
        fat: parseFloat(editingFood.fat),
        fiber: parseFloat(editingFood.fiber),
      }),
    });
    setEditingId(null);
    fetchFoods();
  };

  const filteredFoods =
    group === "All" ? foods : foods.filter((f) => f.group === group);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quản lý Thực phẩm</h1>

      {/* Tạo thực phẩm mới */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label>Tên thực phẩm</Label>
          <Input
            placeholder="Tên"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Nhóm</Label>
          <select
            className="border rounded p-2"
            value={newFood.group}
            onChange={(e) => setNewFood({ ...newFood, group: e.target.value })}
          >
            {GROUPS.filter((g) => g !== "All").map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Lượng</Label>
          <select
            className="border rounded p-2"
            value={newFood.unit}
            onChange={(e) => setNewFood({ ...newFood, unit: e.target.value })}
          >
            <option value="100g">100g</option>
            <option value="1 phần ăn">1 phần ăn</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Mức protein</Label>
          <Input
            type="number"
            placeholder="Protein"
            value={newFood.protein}
            onChange={(e) =>
              setNewFood({ ...newFood, protein: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Mức carb</Label>
          <Input
            type="number"
            placeholder="Carb"
            value={newFood.carb}
            onChange={(e) => setNewFood({ ...newFood, carb: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Mức fat</Label>
          <Input
            type="number"
            placeholder="Fat"
            value={newFood.fat}
            onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Lượng xơ</Label>
          <Input
            type="number"
            placeholder="Fiber"
            value={newFood.fiber}
            onChange={(e) => setNewFood({ ...newFood, fiber: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Thêm vào</Label>
          <Button onClick={handleCreate}>Thêm</Button>
        </div>
      </div>

      {/* Tabs nhóm thực phẩm */}
      <Tabs
        defaultValue="All"
        onValueChange={setGroup}
        value={group}
        className="mb-4"
      >
        <TabsList className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <TabsTrigger key={g} value={g}>
              {g}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Danh sách thực phẩm */}
      <div className="space-y-2">
        {filteredFoods.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            {editingId === f.id ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                <Input
                  value={editingFood?.name}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, name: e.target.value })
                  }
                />
                <select
                  className="border rounded p-2"
                  value={editingFood?.group}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, group: e.target.value })
                  }
                >
                  {GROUPS.filter((g) => g !== "All").map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={editingFood?.protein}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, protein: e.target.value })
                  }
                />
                <Input
                  type="number"
                  value={editingFood?.carb}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, carb: e.target.value })
                  }
                />
                <Input
                  type="number"
                  value={editingFood?.fat}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, fat: e.target.value })
                  }
                />
                <Input
                  type="number"
                  value={editingFood?.fiber}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, fiber: e.target.value })
                  }
                />
                <select
                  className="border rounded p-2"
                  value={editingFood?.unit}
                  onChange={(e) =>
                    setEditingFood({ ...editingFood!, unit: e.target.value })
                  }
                >
                  <option value="100g">100g</option>
                  <option value="1 phần ăn">1 phần ăn</option>
                </select>
              </div>
            ) : (
              <div>
                <p className="font-semibold">
                  {f.name} ({f.unit})
                </p>
                <p className="text-sm text-gray-600">
                  Nhóm: {f.group} | Pro: {f.protein}g, Carb: {f.carb}g, Fat:{" "}
                  {f.fat}g, Xơ: {f.fiber}g
                </p>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === f.id ? (
                <>
                  <Button size="sm" onClick={() => handleUpdate(f.id)}>
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    Huỷ
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(f.id);
                    setEditingFood({
                      name: f.name,
                      group: f.group,
                      unit: f.unit,
                      protein: f.protein,
                      carb: f.carb,
                      fat: f.fat,
                      fiber: f.fiber,
                    });
                  }}
                >
                  Sửa
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(f.id)}
              >
                Xoá
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
