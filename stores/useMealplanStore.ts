import { create } from "zustand";

type AIFoodItem = {
  food: string;
  quantity: number;
  unit: string;
};

type AIMeal = {
  meal: string;
  note?: string;
  items: AIFoodItem[];
  macros?: {
    protein?: string;
    carbohydrate?: string;
    fat?: string;
  };
};

type MealplanStore = {
  aiMeals: AIMeal[];
  setAIMeals: (meals: AIMeal[]) => void;
  reset: () => void;
};

export const useMealplanStore = create<MealplanStore>((set) => ({
  aiMeals: [],
  setAIMeals: (meals) => set({ aiMeals: meals }),
  reset: () => set({ aiMeals: [] }),
}));
