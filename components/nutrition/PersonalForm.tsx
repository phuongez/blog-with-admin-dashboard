"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type FormData = {
  gender: "male" | "female";
  weight: number;
  height: number;
  age: number;
  activity: number;
  goal: "maintain" | "lose" | "gain";
};

type Result = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
};

export default function PersonalForm({
  onCalculate,
}: {
  onCalculate: (data: Result) => void;
}) {
  const [form, setForm] = useState<FormData>({
    gender: "male",
    weight: 60,
    height: 170,
    age: 25,
    activity: 1.55,
    goal: "maintain",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "weight" || name === "height" || name === "age"
          ? parseInt(value)
          : name === "activity"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { weight, height, age, gender, activity, goal } = form;

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activity;

    let calories = tdee;
    if (goal === "lose") calories -= 300;
    if (goal === "gain") calories += 300;

    const protein = (calories * 0.25) / 4;
    const fat = (calories * 0.25) / 9;
    const carb = (calories * 0.5) / 4;

    onCalculate({
      bmr,
      tdee,
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carb: Math.round(carb),
    });
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground text-center md:text-left">
            Nutrition Calculator
          </CardTitle>
          <p className="text-muted-foreground text-center md:text-left">
            Nhập các chỉ số và mục tiêu mong muốn để xác định kế hoạch dinh
            dưỡng
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Tuổi"
            />
            <Input
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              placeholder="Cân nặng (kg)"
            />
            <Input
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
              placeholder="Chiều cao (cm)"
            />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
            >
              <option value="1.2">Ít vận động</option>
              <option value="1.375">Vận động nhẹ</option>
              <option value="1.55">Vận động vừa</option>
              <option value="1.725">Vận động nhiều</option>
            </select>
            <select name="goal" value={form.goal} onChange={handleChange}>
              <option value="maintain">Giữ cân</option>
              <option value="lose">Giảm cân</option>
              <option value="gain">Tăng cân</option>
            </select>
            <button type="submit">Tính toán</button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
