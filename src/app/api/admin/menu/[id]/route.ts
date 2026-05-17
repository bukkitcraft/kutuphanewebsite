import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeNavHref } from "@/lib/href";
import { sanitizePlainText } from "@/lib/security";
import { z } from "zod";

const putSchema = z.object({
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(2048),
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

  const row = await prisma.menuItem.update({
    where: { id: Number(id) },
    data: {
      label: sanitizePlainText(parsed.data.label).slice(0, 80),
      href: sanitizeNavHref(parsed.data.href),
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
  await prisma.menuItem.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
