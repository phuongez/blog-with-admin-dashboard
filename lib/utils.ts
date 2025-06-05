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
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) throw new Error("User not found in DB");

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const currentRole = clerkUser.publicMetadata?.role;
  const alreadySynced = clerkUser.publicMetadata?.roleSynced === true;

  if (currentRole === user.role && alreadySynced) {
    // Không cần cập nhật
    return;
  }

  // Cập nhật role + đánh dấu đã sync
  await clerkClient.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      role: user.role,
      roleSynced: true,
    },
  });
}
