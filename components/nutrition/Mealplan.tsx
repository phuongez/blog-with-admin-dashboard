"use client";

import { useEffect, useState } from "react";
import MealCard from "./MealCard";
import { Button } from "@/components/ui/button";

const fetchAllFoods = async (): Promise<Food[]> => {
  const res = await fetch("/api/foods");
  return res.json();
};

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
  target?: {
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  };
};

export default function MealPlan({ target }: Props) {
  const [mealCount, setMealCount] = useState(3);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foodList, setFoodList] = useState<Food[]>([]);
  const [dietType, setDietType] = useState("Bình thường");

  useEffect(() => {
    fetchAllFoods().then(setFoodList);
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

  const generateMealplan = async () => {
    if (!target) return;
    const res = await fetch("/api/mealplan/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target,
        preferences: {
          meals: mealCount,
          diet: dietType,
        },
      }),
    });
    const aiMeals = await res.json();

    const mappedMeals = aiMeals.map((m: any, idx: number) => ({
      title: m.meal || `Bữa ${idx + 1}`,
      note: m.note || "",
      items: m.items.map((i: any) => ({
        id: crypto.randomUUID(),
        foodId: foodList.find((f) => f.name === i.food)?.id || "",
        quantity: i.quantity,
      })),
    }));

    setMeals(mappedMeals);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <label className="font-semibold">Chọn số bữa ăn:</label>
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

          <label className="font-semibold">Chế độ ăn:</label>
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="border p-1 rounded"
          >
            {[
              "Bình thường",
              "Ăn chay",
              "Ít carb",
              "Nhiều protein",
              "Ketogenic",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {target && (
            <Button onClick={generateMealplan} className="ml-auto">
              Gợi ý thực đơn bằng AI
            </Button>
          )}
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
    </div>
  );
}
