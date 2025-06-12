// components/MealCard.tsx
import { useState } from "react";
import FoodSelector from "./FoodSelector";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

const FOOD_GROUPS = [
  "All",
  "Starch",
  "Meat",
  "Fruit",
  "Nuts & Seeds",
  "Greens",
  "Proteins",
  "Others",
];

type Food = {
  id: string;
  name: string;
  group: string;
  unit: string;
  protein: number;
  carb: number;
  fat: number;
  fiber: number;
  calories: number;
};

type MealItem = {
  id: string;
  foodId: string;
  quantity: number;
};

type Meal = {
  title: string;
  items: MealItem[];
  note?: string;
};

type Props = {
  meal: Meal;
  onUpdate: (items: MealItem[]) => void;
  foodList: Food[];
};

export default function MealCard({ meal, onUpdate, foodList }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState<string>(meal.note || "");
  const [showSelector, setShowSelector] = useState(false);

  const updateItem = (id: string, newItem: Partial<MealItem>) => {
    onUpdate(
      meal.items.map((item) =>
        item.id === id ? { ...item, ...newItem } : item
      )
    );
  };

  const removeItem = (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xoá món ăn này không?"
    );
    if (confirmed) {
      onUpdate(meal.items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="border p-4 rounded-md bg-white shadow">
      <h2 className="text-xl font-bold mb-2">{meal.title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nhóm</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Lượng</TableHead>
            <TableHead>Protein</TableHead>
            <TableHead>Carb</TableHead>
            <TableHead>Fat</TableHead>
            <TableHead>Calories</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meal.items.map((item) => {
            const food = foodList.find((f) => f.id === item.foodId);
            if (!food) return null;
            const ratio = item.quantity / (food.unit === "100g" ? 100 : 1);

            return (
              <TableRow key={item.id}>
                {editingId === item.id ? (
                  <>
                    <TableCell>
                      <select
                        value={food.group}
                        onChange={(e) =>
                          updateItem(item.id, {
                            foodId:
                              foodList.find((f) => f.group === e.target.value)
                                ?.id || item.foodId,
                          })
                        }
                        className="border p-1"
                      >
                        {FOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        value={item.foodId}
                        onChange={(e) =>
                          updateItem(item.id, { foodId: e.target.value })
                        }
                        className="border p-1"
                      >
                        {foodList.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: parseInt(e.target.value),
                          })
                        }
                        className="border p-1 w-20"
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{food.group}</TableCell>
                    <TableCell>{food.name}</TableCell>
                    <TableCell>
                      {item.quantity}
                      {food.unit === "100g" ? "g" : " phần"}
                    </TableCell>
                  </>
                )}
                <TableCell>{(food.protein * ratio).toFixed(1)}</TableCell>
                <TableCell>{(food.carb * ratio).toFixed(1)}</TableCell>
                <TableCell>{(food.fat * ratio).toFixed(1)}</TableCell>
                <TableCell>{(food.calories * ratio).toFixed(0)}</TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-green-600 text-sm"
                    >
                      Lưu
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="text-blue-600 text-sm mr-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 text-sm"
                      >
                        Xoá
                      </button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {!showSelector && (
        <button
          onClick={() => setShowSelector(true)}
          className="text-sm text-blue-600 mt-2"
        >
          + Thêm món ăn
        </button>
      )}
      {showSelector && (
        <FoodSelector
          index={0}
          onAdd={(item) => {
            if (item.quantity > 0) {
              onUpdate([...meal.items, item]);
            }
            setShowSelector(false);
          }}
        />
      )}

      {/* Gợi ý chế biến nếu có */}
      {meal.note && (
        <div className="mt-4 text-sm italic text-gray-600">
          Gợi ý chế biến: {meal.note}
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú / Gợi ý chế biến (thêm thủ công)
        </label>
        <textarea
          className="border rounded w-full p-2"
          rows={3}
          placeholder="Ví dụ: Xào rau với dầu ô liu, hấp thịt gà với gừng..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}
