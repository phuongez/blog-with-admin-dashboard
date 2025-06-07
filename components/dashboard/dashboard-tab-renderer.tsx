"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogDashboard } from "@/components/dashboard/blog-dashboard";
import DashboardRevenue from "@/components/dashboard/DashboardRevenue";
import DashComments from "@/components/dashboard/DashComments";
import DashPosts from "@/components/dashboard/DashPosts";
import DashProfile from "@/components/dashboard/DashProfile";
import DashUsers from "@/components/dashboard/DashUsers";
import DashSocials from "./DashSocials";

export function DashboardTabRenderer() {
  const [tab, setTab] = useState("dash");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab") || "dash";
    setTab(tabFromUrl);
  }, [searchParams]);

  return (
    <div>
      {tab === "profile" && <DashProfile />}
      {tab === "revenue" && <DashboardRevenue />}
      {tab === "posts" && <DashPosts />}
      {tab === "comments" && <DashComments />}
      {tab === "users" && <DashUsers />}
      {tab === "dash" && <BlogDashboard />}
      {tab === "socials" && <DashSocials />}
    </div>
  );
}
