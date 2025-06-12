"use client";

import { useEffect, useState } from "react";

type MealItem = {
  foodName: string;
  quantity: number; // grams
};

type Meal = {
  title: string;
  items: MealItem[];
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

export default function Mealplan({ target }: any) {
  const [meals, setMeals] = useState<Meal[]>([
    { title: "Bữa sáng", items: [] },
    { title: "Bữa trưa", items: [] },
    { title: "Bữa tối", items: [] },
    { title: "Bữa phụ", items: [] },
  ]);

  const [foodList, setFoodList] = useState<Food[]>([]);

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await fetch("/api/foods");
      const data = await res.json();
      setFoodList(data);
    };
    fetchFoods();
  }, []);

  const addFoodToMeal = (
    mealIndex: number,
    foodName: string,
    quantity: number
  ) => {
    setMeals((prev) => {
      const updated = [...prev];
      updated[mealIndex].items.push({ foodName, quantity });
      return updated;
    });
  };

  const getMacroFromMeal = (meal: Meal) => {
    return meal.items.reduce(
      (totals, item) => {
        const food = foodList.find((f) => f.name === item.foodName);
        if (!food) return totals;
        const ratio = item.quantity / 100;
        return {
          protein: totals.protein + food.protein * ratio,
          carb: totals.carb + food.carb * ratio,
          fat: totals.fat + food.fat * ratio,
          calories: totals.calories + food.calories * ratio,
        };
      },
      { protein: 0, carb: 0, fat: 0, calories: 0 }
    );
  };

  const getTotalMacro = () => {
    return meals.reduce(
      (totals, meal) => {
        const m = getMacroFromMeal(meal);
        return {
          protein: totals.protein + m.protein,
          carb: totals.carb + m.carb,
          fat: totals.fat + m.fat,
          calories: totals.calories + m.calories,
        };
      },
      { protein: 0, carb: 0, fat: 0, calories: 0 }
    );
  };

  const total = getTotalMacro();

  return (
    <div className="space-y-6">
      {meals.map((meal, index) => (
        <div key={meal.title} className="border p-4 rounded-md bg-white shadow">
          <h2 className="text-xl font-bold mb-2">{meal.title}</h2>

          {/* List món đã chọn */}
          <ul className="mb-2">
            {meal.items.map((item, idx) => (
              <li key={idx}>
                {item.foodName} - {item.quantity}g
                <button
                  className="text-red-500 text-sm"
                  onClick={() => {
                    const updatedMeals = [...meals];
                    updatedMeals[index].items.splice(idx, 1);
                    setMeals(updatedMeals);
                  }}
                >
                  Xoá
                </button>
              </li>
            ))}
          </ul>

          {/* Chọn món */}
          <div className="flex gap-2">
            <select id={`food-${index}`} className="border p-1">
              {foodList.map((food) => (
                <option key={food.name} value={food.name}>
                  {food.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="gram"
              className="border p-1 w-24"
              id={`qty-${index}`}
            />
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => {
                const foodEl = document.getElementById(
                  `food-${index}`
                ) as HTMLSelectElement;
                const qtyEl = document.getElementById(
                  `qty-${index}`
                ) as HTMLInputElement;
                if (!foodEl || !qtyEl) return;
                const name = foodEl.value;
                const qty = parseInt(qtyEl.value);
                if (name && qty > 0) addFoodToMeal(index, name, qty);
              }}
            >
              Thêm
            </button>
          </div>

          {/* Tổng dinh dưỡng bữa này */}
          <div className="mt-2 text-sm text-gray-600">
            {(() => {
              const macro = getMacroFromMeal(meal);
              return (
                <p>
                  Tổng: {macro.calories.toFixed(0)} kcal – P:
                  {macro.protein.toFixed(1)}g, C:{macro.carb.toFixed(1)}g, F:
                  {macro.fat.toFixed(1)}g
                </p>
              );
            })()}
          </div>
        </div>
      ))}
      {target && (
        <div className="p-4 border rounded bg-gray-50 mt-6">
          <h3 className="font-semibold mb-1">Tổng dinh dưỡng</h3>
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
