import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeNavHref } from "@/lib/href";
import { sanitizePlainText } from "@/lib/security";
import { z } from "zod";

const createSchema = z.object({
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(2048),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export async function GET() {
  const list = await prisma.menuItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const row = await prisma.menuItem.create({
    data: {
      label: sanitizePlainText(parsed.data.label).slice(0, 80),
      href: sanitizeNavHref(parsed.data.href),
      isActive: parsed.data.isActive ?? true,
      sortOrder: parsed.data.sortOrder ?? 0
    }
  });
  return NextResponse.json(row);
}
