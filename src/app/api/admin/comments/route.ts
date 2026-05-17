import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Onay bekleyen içerik ve duyuru yorumları */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("pending") !== "1") {
    return NextResponse.json([]);
  }

  const comments = await prisma.comment.findMany({
    where: {
      isApproved: false,
      isGuestbook: false,
      OR: [{ contentId: { not: null } }, { announcementId: { not: null } }]
    },
    orderBy: { createdAt: "desc" },
    include: {
      content: { select: { title: true, slug: true } },
      announcement: { select: { id: true, title: true } }
    }
  });

  return NextResponse.json(comments);
}
