import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText, sanitizeRichHtml } from "@/lib/security";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  bodyHtml: z.string(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export async function GET() {
  const list = await prisma.announcement.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }]
  });
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const row = await prisma.announcement.create({
    data: {
      title: sanitizePlainText(parsed.data.title),
      bodyHtml: sanitizeRichHtml(parsed.data.bodyHtml),
      isActive: parsed.data.isActive ?? true,
      sortOrder: parsed.data.sortOrder ?? 0
    }
  });

  return NextResponse.json(row);
}
