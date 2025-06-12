"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PersonalForm from "./PersonalForm";
import Mealplan from "./Mealplan";
import FoodManagerPage from "./FoodManagerPage";

export default function NutritionTabRenderer({ user }: any) {
  const [tab, setTab] = useState("calc");
  const [result, setResult] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab") || "calc";
    setTab(tabFromUrl);
  }, [searchParams]);

  const onCalculate = (data: any) => {
    console.log(data);
    setResult(data);
  };

  return (
    <div>
      {tab === "calc" && <PersonalForm onCalculate={onCalculate} />}
      {tab === "mealplan" && <Mealplan target={result} />}
      {tab === "foodmanage" && <FoodManagerPage />}
      {/* {tab === "tracking" && <Tracking />}
      {tab === "nutritionGuide" && <NutritionGuide />} */}
    </div>
  );
}
