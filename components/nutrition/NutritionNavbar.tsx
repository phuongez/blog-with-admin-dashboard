"use client";

import { Button } from "../ui/button";
import {
  BookOpenCheck,
  Calculator,
  ChartNetwork,
  FileText,
  Salad,
} from "lucide-react";
import Link from "next/link";
const NutritionNavbar = () => {
  return (
    <div className="w-full px-4 border-b flex justify-center">
      <nav className="flex items-center overflow-x-scroll">
        <Link href={"/nutrition"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <Calculator className="hidden md:inline-block mr-2 h-4 w-4" />
            Calculator
          </Button>
        </Link>

        <Link href={"/nutrition?tab=mealplan"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <Salad className="hidden md:inline-block mr-2 h-4 w-4" />
            Mealplan
          </Button>
        </Link>
        <Link href={"/nutrition?tab=tracking"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <ChartNetwork className="hidden md:inline-block mr-2 h-4 w-4" />
            Tracking
          </Button>
        </Link>
        <Link href={"/nutrition?tab=guide"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <BookOpenCheck className="hidden md:inline-block mr-2 h-4 w-4" />
            Guide
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default NutritionNavbar;
