import { useEffect, useState } from "react";
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
};

const fetchFoods = async (group: string): Promise<Food[]> => {
  const res = await fetch(`/api/foods?group=${group}`);
  const data = await res.json();
  return data;
};

function FoodSelector({
  index,
  onAdd,
}: {
  index: number;
  onAdd: (item: MealItem) => void;
}) {
  const [group, setGroup] = useState("All");
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchFoods(group).then(setFoods);
  }, [group]);

  useEffect(() => {
    if (foods.length > 0) setSelectedFoodId(foods[0].id);
  }, [foods]);

  useEffect(() => {
    if (selectedFoodId && quantity > 0) {
      onAdd({
        id: Date.now().toString(),
        foodId: selectedFoodId,
        quantity,
      });
    }
  }, [selectedFoodId, quantity]);

  return (
    <div className="flex gap-2">
      <select
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        className="border p-1"
      >
        {FOOD_GROUPS.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <select
        value={selectedFoodId}
        onChange={(e) => setSelectedFoodId(e.target.value)}
        className="border p-1"
      >
        {foods.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        className="border p-1 w-24"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
    </div>
  );
}

function MealCard({
  meal,
  onUpdate,
  foodList,
}: {
  meal: Meal;
  onUpdate: (items: MealItem[]) => void;
  foodList: Food[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

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
      <div className="mt-2">
        <FoodSelector
          index={0}
          onAdd={(item) => onUpdate([...meal.items, item])}
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ghi chú / Gợi ý chế biến
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

export default function MealPlan({ target }: { target?: any }) {
  const [mealCount, setMealCount] = useState(3);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foodList, setFoodList] = useState<Food[]>([]);

  useEffect(() => {
    fetch("/api/foods")
      .then((res) => res.json())
      .then(setFoodList);
  }, []);

  useEffect(() => {
    setMeals(
      Array.from({ length: mealCount }, (_, i) => ({
        title: `Bữa ${i + 1}`,
        items: [],
      }))
    );
  }, [mealCount]);

  const getTotalMacro = () => {
    return meals.reduce(
      (totals, meal) => {
        return meal.items.reduce((acc, item) => {
          const food = foodList.find((f) => f.id === item.foodId);
          if (!food) return acc;
          const ratio = item.quantity / (food.unit === "100g" ? 100 : 1);
          return {
            protein: acc.protein + food.protein * ratio,
            carb: acc.carb + food.carb * ratio,
            fat: acc.fat + food.fat * ratio,
            calories: acc.calories + food.calories * ratio,
          };
        }, totals);
      },
      { protein: 0, carb: 0, fat: 0, calories: 0 }
    );
  };

  const total = getTotalMacro();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <label className="font-semibold mr-2">Chọn số bữa ăn:</label>
        <select
          value={mealCount}
          onChange={(e) => setMealCount(parseInt(e.target.value))}
          className="border p-1 rounded"
        >
          {[2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} bữa
            </option>
          ))}
        </select>
      </div>

      {meals.map((meal, idx) => (
        <MealCard
          key={idx}
          meal={meal}
          foodList={foodList}
          onUpdate={(items) => {
            const updated = [...meals];
            updated[idx].items = items;
            setMeals(updated);
          }}
        />
      ))}

      <div className="p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-1">Tổng dinh dưỡng tất cả các bữa</h3>
        <p>Calories: {total.calories.toFixed(0)} kcal</p>
        <p>Protein: {total.protein.toFixed(1)} g</p>
        <p>Carb: {total.carb.toFixed(1)} g</p>
        <p>Fat: {total.fat.toFixed(1)} g</p>
      </div>

      {target && (
        <div className="p-4 border rounded bg-gray-100 mt-4">
          <h3 className="font-semibold mb-1">So sánh với mục tiêu</h3>
          <p>
            Calories: {total.calories.toFixed(0)} / {target.calories} kcal
          </p>
          <p>
            Protein: {total.protein.toFixed(1)} / {target.protein} g
          </p>
          <p>
            Carb: {total.carb.toFixed(1)} / {target.carb} g
          </p>
          <p>
            Fat: {total.fat.toFixed(1)} / {target.fat} g
          </p>
        </div>
      )}
    </div>
  );
}
