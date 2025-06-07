import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { socialLinks } = body;

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        socialLinks,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Clerk update error:", err);
    return new NextResponse("Failed to update social links", { status: 500 });
  }
}
