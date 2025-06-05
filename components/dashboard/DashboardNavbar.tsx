"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  BarChart,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
const DashboardNavbar = () => {
  return (
    <div className="w-full px-4 border-b flex justify-center">
      <nav className="flex items-center overflow-x-scroll">
        <Link href={"/dashboard"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <LayoutDashboard className="hidden md:inline-block mr-2 h-4 w-4" />
            Tổng quan
          </Button>
        </Link>

        <Link href={"/dashboard?tab=revenue"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <FileText className="hidden md:inline-block mr-2 h-4 w-4" />
            Doanh số
          </Button>
        </Link>
        <Link href={"/dashboard?tab=posts"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <FileText className="hidden md:inline-block mr-2 h-4 w-4" />
            Bài viết
          </Button>
        </Link>
        <Link href={"/dashboard?tab=users"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <FileText className="hidden md:inline-block mr-2 h-4 w-4" />
            Người dùng
          </Button>
        </Link>
        <Link href={"/dashboard?tab=comments"}>
          <Button
            variant="ghost"
            className="rounded-none focus:border-b-2 focus:border-black"
          >
            <MessageCircle className="hidden md:inline-block mr-2 h-4 w-4" />
            Bình luận
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default DashboardNavbar;
