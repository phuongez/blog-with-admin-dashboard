import { create } from "zustand";

type Result = {
  calories: number;
  protein: number;
  fat: number;
  carb: number;
};

type NutritionStore = {
  result: Result | null;
  setResult: (data: Result) => void;
};

export const useNutritionStore = create<NutritionStore>((set) => ({
  result: null,
  setResult: (data) => set({ result: data }),
}));
