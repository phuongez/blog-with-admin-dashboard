import { Suspense } from "react";
import NutritionTabRenderer from "@/components/nutrition/NutritionTabRenderer";

export default function NutritionPage() {
  return (
    <Suspense fallback={<div>Đang tải dashboard...</div>}>
      <NutritionTabRenderer />
    </Suspense>
  );
}
