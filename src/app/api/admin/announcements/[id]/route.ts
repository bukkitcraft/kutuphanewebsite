import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText, sanitizeRichHtml } from "@/lib/security";
import { z } from "zod";

const putSchema = z.object({
  title: z.string().min(1).max(200),
  bodyHtml: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int()
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const row = await prisma.announcement.update({
    where: { id: Number(id) },
    data: {
      title: sanitizePlainText(parsed.data.title),
      bodyHtml: sanitizeRichHtml(parsed.data.bodyHtml),
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder
    }
  });

  return NextResponse.json(row);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.announcement.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
