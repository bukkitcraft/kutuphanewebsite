import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText } from "@/lib/security";
import { z } from "zod";

const baseFields = {
  fullName: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
  gender: z.enum(["MALE", "FEMALE"]),
  rating: z.number().int().min(1).max(5)
};

const postSchema = z
  .object({
    ...baseFields,
    contentId: z.number().int().positive().optional(),
    announcementId: z.number().int().positive().optional()
  })
  .refine(
    (d) =>
      (d.contentId != null && d.announcementId == null) ||
      (d.announcementId != null && d.contentId == null),
    { message: "contentId veya announcementId (yalnızca biri) gerekli" }
  );

/** Onaylı içerik / duyuru yorumları (public GET) veya yeni yorum (POST, onaysız kayıt) */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawContent = searchParams.get("contentId");
  const rawAnn = searchParams.get("announcementId");

  if (rawContent != null && rawAnn != null) {
    return NextResponse.json({ error: "Yalnızca contentId veya announcementId" }, { status: 400 });
  }

  if (rawContent != null) {
    const contentId = Number(rawContent);
    if (!Number.isFinite(contentId) || contentId < 1) {
      return NextResponse.json({ error: "Geçersiz içerik" }, { status: 400 });
    }
    const comments = await prisma.comment.findMany({
      where: {
        contentId,
        announcementId: null,
        isApproved: true,
        isGuestbook: false
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        message: true,
        rating: true,
        createdAt: true
      }
    });
    return NextResponse.json(comments);
  }

  if (rawAnn != null) {
    const announcementId = Number(rawAnn);
    if (!Number.isFinite(announcementId) || announcementId < 1) {
      return NextResponse.json({ error: "Geçersiz duyuru" }, { status: 400 });
    }
    const comments = await prisma.comment.findMany({
      where: {
        announcementId,
        contentId: null,
        isApproved: true,
        isGuestbook: false
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        message: true,
        rating: true,
        createdAt: true
      }
    });
    return NextResponse.json(comments);
  }

  return NextResponse.json({ error: "contentId veya announcementId gerekli" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  if (parsed.data.contentId != null) {
    const content = await prisma.content.findUnique({
      where: { id: parsed.data.contentId }
    });
    if (!content) {
      return NextResponse.json({ error: "İçerik bulunamadı" }, { status: 404 });
    }
    await prisma.comment.create({
      data: {
        contentId: parsed.data.contentId,
        announcementId: null,
        fullName: sanitizePlainText(parsed.data.fullName).slice(0, 120),
        message: sanitizePlainText(parsed.data.message).slice(0, 2000),
        gender: parsed.data.gender,
        rating: parsed.data.rating,
        isGuestbook: false,
        isApproved: false
      }
    });
    return NextResponse.json({ ok: true });
  }

  const ann = await prisma.announcement.findUnique({
    where: { id: parsed.data.announcementId! }
  });
  if (!ann || !ann.isActive) {
    return NextResponse.json({ error: "Duyuru bulunamadı veya yayından kaldırılmış" }, { status: 404 });
  }

  await prisma.comment.create({
    data: {
      contentId: null,
      announcementId: parsed.data.announcementId!,
      fullName: sanitizePlainText(parsed.data.fullName).slice(0, 120),
      message: sanitizePlainText(parsed.data.message).slice(0, 2000),
      gender: parsed.data.gender,
      rating: parsed.data.rating,
      isGuestbook: false,
      isApproved: false
    }
  });

  return NextResponse.json({ ok: true });
}
