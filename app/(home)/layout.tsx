import { Navbar } from "@/components/home/header/navbar";
import { prisma } from "@/lib/prisma";
import { syncUserRoleToClerk } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user) {
    const loggedInUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!loggedInUser) {
      await prisma.user.create({
        data: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          clerkUserId: user.id,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl,
        },
      });
    }
    await syncUserRoleToClerk(user.id);
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;
