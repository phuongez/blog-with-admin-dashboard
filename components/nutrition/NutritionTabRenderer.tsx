"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PersonalForm from "./PersonalForm";

export default function NutritionTabRenderer() {
  const [tab, setTab] = useState("calc");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab") || "calc";
    setTab(tabFromUrl);
  }, [searchParams]);

  const onCalculate = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      {tab === "calc" && <PersonalForm onCalculate={onCalculate} />}
      {/* {tab === "revenue" && <DashboardRevenue />}
      {tab === "posts" && <DashPosts />}
      {tab === "comments" && <DashComments />}
      {tab === "users" && <DashUsers />}
      {tab === "dash" && <BlogDashboard />} */}
    </div>
  );
}
