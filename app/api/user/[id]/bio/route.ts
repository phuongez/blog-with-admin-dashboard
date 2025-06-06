import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: any) {
  const { userId } = await auth();
  const body = await req.json();
  const { bio } = body;

  const author = await prisma.user.findUnique({ where: { id: params.id } });
  if (!author || author.clerkUserId !== userId) {
    return new Response("Unauthorized", { status: 403 });
  }

  await prisma.user.update({
    where: { id: params.id },
    data: { bio },
  });

  return new Response("Updated");
}
