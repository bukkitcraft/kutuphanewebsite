import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  contentId: z.number().int().positive(),
  value: z.number().int().min(1).max(5)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz oy" }, { status: 400 });
  }

  const content = await prisma.content.findUnique({
    where: { id: parsed.data.contentId }
  });
  if (!content) {
    return NextResponse.json({ error: "İçerik bulunamadı" }, { status: 404 });
  }

  const newVoteCount = content.voteCount + 1;
  const newAverage =
    (content.averageRate * content.voteCount + parsed.data.value) / newVoteCount;

  const updated = await prisma.content.update({
    where: { id: content.id },
    data: {
      voteCount: newVoteCount,
      averageRate: newAverage
    }
  });

  return NextResponse.json({
    averageRate: updated.averageRate,
    voteCount: updated.voteCount
  });
}
