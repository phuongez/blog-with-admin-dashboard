import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { clerkUserId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ prismaUserId: user.id }));
}
