// components/FoodSelector.tsx
import { useEffect, useState } from "react";

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

export default function FoodSelector({
  index,
  onAdd,
}: {
  index: number;
  onAdd: (item: MealItem) => void;
}) {
  const [group, setGroup] = useState("All");
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetch(`/api/foods?group=${group}`)
      .then((res) => res.json())
      .then(setFoods);
  }, [group]);

  // useEffect(() => {
  //   if (foods.length > 0 && !selectedFoodId) {
  //     setSelectedFoodId(foods[0].id);
  //   }
  // }, [foods, selectedFoodId]);

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedFood = foods.find((f) => f.id === selectedFoodId);
  const ratio =
    selectedFood && quantity > 0
      ? quantity / (selectedFood.unit === "100g" ? 100 : 1)
      : 0;

  const handleAdd = () => {
    if (!selectedFoodId || quantity <= 0) return;
    const food = foods.find((f) => f.id === selectedFoodId);
    if (!food) return;

    onAdd({
      id: Date.now().toString(),
      foodId: selectedFoodId,
      quantity,
    });
  };

  return (
    <div className="flex flex-col gap-2 border p-2 rounded-md">
      <div className="flex gap-2 items-center">
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
        <input
          type="text"
          placeholder="Tìm món ăn..."
          className="border p-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
          className="border p-1"
        >
          <option value="">-- Chọn món ăn --</option>
          {filteredFoods.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          className="border p-1 w-24"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button
          onClick={handleAdd}
          className="text-sm text-green-600 border px-2 py-1 rounded"
        >
          Thêm
        </button>
      </div>
      {selectedFood && quantity > 0 && (
        <div className="text-sm text-gray-700 flex gap-4">
          <span>Protein: {(selectedFood.protein * ratio).toFixed(1)}g</span>
          <span>Carb: {(selectedFood.carb * ratio).toFixed(1)}g</span>
          <span>Fat: {(selectedFood.fat * ratio).toFixed(1)}g</span>
          <span>
            Calories: {(selectedFood.calories * ratio).toFixed(0)} kcal
          </span>
        </div>
      )}
    </div>
  );
}
