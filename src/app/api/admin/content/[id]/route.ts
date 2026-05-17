import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText, sanitizeRichHtml } from "@/lib/security";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.content.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const content = await prisma.content.update({
    where: { id: Number(id) },
    data: {
      title: sanitizePlainText(body.title),
      bodyHtml: sanitizeRichHtml(body.bodyHtml),
      coverImage: body.coverImage ? sanitizePlainText(body.coverImage) : null
    }
  });

  return NextResponse.json(content);
}
