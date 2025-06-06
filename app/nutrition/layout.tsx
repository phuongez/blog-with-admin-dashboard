import NutritionNavbar from "@/components/nutrition/NutritionNavbar";
import { Navbar } from "@/components/home/header/navbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <Navbar />
        <NutritionNavbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default layout;
