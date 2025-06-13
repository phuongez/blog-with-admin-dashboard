"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PersonalForm from "./PersonalForm";
import Mealplan from "./Mealplan";
import FoodManagerPage from "./FoodManagerPage";
import Tracking from "./Tracking";
import { useNutritionStore } from "@/stores/useNutritionStore";

export default function NutritionTabRenderer({ user }: any) {
  const [tab, setTab] = useState("calc");

  const searchParams = useSearchParams();

  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab") || "calc";
    setTab(tabFromUrl);
  }, [searchParams]);

  const onCalculate = (data: any) => {
    console.log(data);
    // setResult(data);
  };

  const result = useNutritionStore((state) => state.result);

  return (
    <div>
      {tab === "calc" && <PersonalForm onCalculate={onCalculate} />}
      {tab === "mealplan" && <Mealplan target={result || undefined} />}
      {tab === "foodmanage" && <FoodManagerPage />}
      {tab === "tracking" && <Tracking />}
      {/* {tab === "nutritionGuide" && <NutritionGuide />} */}
    </div>
  );
}
