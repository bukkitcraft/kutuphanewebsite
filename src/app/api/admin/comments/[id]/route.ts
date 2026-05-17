import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isFinite(n)) {
    return NextResponse.json({ error: "Geçersiz kimlik" }, { status: 400 });
  }
  await prisma.comment.delete({ where: { id: n } });
  return NextResponse.json({ ok: true });
}
