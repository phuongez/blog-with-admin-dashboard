"use client";

import { Button } from "../ui/button";
import {
  Apple,
  BookOpenCheck,
  Calculator,
  ChartNetwork,
  FileText,
  Salad,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
const NutritionNavbar = () => {
  const { user } = useUser();
  return (
    <div className="w-full border-b px-4 flex justify-center items-center">
      <nav className="flex items-center overflow-x-auto py-0 h-[40px]">
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
        {user?.publicMetadata?.role === "ADMIN" && (
          <Link href={"/nutrition?tab=foodmanage"}>
            <Button
              variant="ghost"
              className="rounded-none focus:border-b-2 focus:border-black"
            >
              <Apple className="hidden md:inline-block mr-2 h-4 w-4" />
              Foods
            </Button>
          </Link>
        )}
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
