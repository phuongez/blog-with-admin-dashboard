"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  unit: string;
  protein: number;
  carb: number;
  fat: number;
  calories: number;
};

type Props = {
  filteredFoods: Food[];
  selectedFoodId: string;
  setSelectedFoodId: (id: string) => void;
  group: string;
  setGroup: (group: string) => void;
  search: string;
  setSearch: (search: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedFood: Food | null;
  handleAdd: () => void;
};

export default function FoodSelector({
  filteredFoods,
  selectedFoodId,
  setSelectedFoodId,
  group,
  setGroup,
  search,
  setSearch,
  quantity,
  setQuantity,
  selectedFood,
  handleAdd,
}: Props) {
  const ratio = quantity / 100;

  return (
    <div className="flex flex-col gap-3 p-2 rounded-md text-sm">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Chọn nhóm */}
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className="w-fit sm:w-auto text-sm min-w-[120px] h-[2.25rem]">
            <SelectValue placeholder="Chọn nhóm" />
          </SelectTrigger>
          <SelectContent className="max-h-[180px] overflow-y-auto text-base">
            {FOOD_GROUPS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tìm món ăn */}
        <Input
          type="text"
          placeholder="Tìm món ăn..."
          className="hidden md:block text-sm w-fit sm:w-[180px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Chọn món */}
        <Select value={selectedFoodId} onValueChange={setSelectedFoodId}>
          <SelectTrigger className="w-fit text-sm h-[2.25rem]">
            <SelectValue placeholder="-- Chọn món ăn --" />
          </SelectTrigger>
          <SelectContent className="max-h-[180px] overflow-y-auto text-base">
            {filteredFoods.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Lượng */}
        <div className="relative w-[110px]">
          <Input
            type="number"
            min={0}
            className="pr-10 text-sm" // chừa khoảng bên phải để hiển thị đơn vị
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {selectedFood?.unit === "100g" ? "g" : "phần"}
          </span>
        </div>

        {/* Thêm */}
        <Button onClick={handleAdd} size={"sm"} className=" text-base px-4">
          Thêm
        </Button>
      </div>

      {/* Thông tin món */}
      {selectedFood && quantity > 0 && (
        <div className="text-sm text-gray-700 flex flex-wrap gap-4">
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
