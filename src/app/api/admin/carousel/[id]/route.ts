import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeOptionalLink } from "@/lib/href";
import { sanitizePlainText } from "@/lib/security";
import { z } from "zod";

function sanitizeImageUrl(raw: string): string {
  const t = sanitizePlainText(raw).trim();
  if (t.startsWith("/") && !t.startsWith("//")) return t.slice(0, 2048);
  if (/^https:\/\//i.test(t)) return t.slice(0, 2048);
  if (/^http:\/\//i.test(t)) return t.slice(0, 2048);
  return "";
}

const putSchema = z.object({
  imageUrl: z.string().min(1).max(2048),
  altText: z.string().max(200).optional().nullable(),
  linkUrl: z.string().max(2048).optional().nullable(),
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

  const imageUrl = sanitizeImageUrl(parsed.data.imageUrl);
  if (!imageUrl) {
    return NextResponse.json({ error: "Geçersiz resim URL" }, { status: 400 });
  }

  const alt =
    parsed.data.altText == null || parsed.data.altText === ""
      ? null
      : sanitizePlainText(parsed.data.altText).slice(0, 200) || null;

  const link =
    parsed.data.linkUrl == null || parsed.data.linkUrl === ""
      ? null
      : sanitizeOptionalLink(parsed.data.linkUrl);

  const row = await prisma.homeCarouselSlide.update({
    where: { id: Number(id) },
    data: {
      imageUrl,
      altText: alt,
      linkUrl: link,
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
  await prisma.homeCarouselSlide.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
