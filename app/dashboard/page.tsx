"use client";

import { BlogDashboard } from "@/components/dashboard/blog-dashboard";
import DashboardRevenue from "@/components/dashboard/DashboardRevenue";
import DashComments from "@/components/dashboard/DashComments";
import DashPosts from "@/components/dashboard/DashPosts";
import DashProfile from "@/components/dashboard/DashProfile";
import DashUsers from "@/components/dashboard/DashUsers";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [tab, setTab] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab") || "dash";
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);
  return (
    <div>
      {tab === "profile" && <DashProfile />}
      {tab === "revenue" && <DashboardRevenue />}

      {tab === "posts" && <DashPosts />}
      {tab === "comments" && <DashComments />}

      {tab === "users" && <DashUsers />}
      {tab === "dash" && <BlogDashboard />}
    </div>
  );
};

export default page;
