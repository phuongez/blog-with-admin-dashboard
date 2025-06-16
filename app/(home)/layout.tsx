import BlogFooter from "@/components/home/blog-footer";
import { Navbar } from "@/components/home/header/navbar";
import { prisma } from "@/lib/prisma";
import { syncUserRoleToClerk } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user) {
    // Dùng upsert để tránh race condition khi nhiều user đăng nhập cùng lúc
    await prisma.user.upsert({
      where: { clerkUserId: user.id },
      update: {}, // Không cập nhật gì nếu đã tồn tại
      create: {
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      },
    });

    // Gọi đồng bộ role về Clerk ở background (không chặn UI)
    syncUserRoleToClerk(user.id).catch((err) => {
      console.error("Không thể sync role về Clerk:", err);
    });
  }

  return (
    <div>
      <Navbar />
      {children}
      <BlogFooter />
    </div>
  );
};

export default HomeLayout;
