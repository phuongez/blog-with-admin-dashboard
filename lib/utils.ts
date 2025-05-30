import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "@/lib/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createGmailLink({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function syncUserRoleToClerk(clerkUserId: string) {
  // 1. Lấy user trong Prisma theo Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found in DB");

  // 2. Cập nhật role vào Clerk publicMetadata
  await clerkClient.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      role: user.role, // enum: ADMIN, AUTHOR, USER
    },
  });
}
