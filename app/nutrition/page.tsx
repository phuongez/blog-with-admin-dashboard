import { Suspense } from "react";
import NutritionTabRenderer from "@/components/nutrition/NutritionTabRenderer";
import { auth } from "@clerk/nextjs/server";

export default async function NutritionPage() {
  const user = await auth();
  return (
    <Suspense fallback={<div>Đang tải dashboard...</div>}>
      <NutritionTabRenderer user={user.userId} />
    </Suspense>
  );
}
