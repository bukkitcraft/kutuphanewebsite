import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUsernameFromSession } from "@/lib/auth";

const schema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6).max(128),
    confirmPassword: z.string().min(1)
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Yeni şifreler uyuşmuyor"
  });

export async function PUT(request: Request) {
  const username = await getAdminUsernameFromSession();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
  }

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Mevcut şifre hatalı" }, { status: 400 });
  }

  const sameAsOld = await bcrypt.compare(parsed.data.newPassword, user.passwordHash);
  if (sameAsOld) {
    return NextResponse.json({ error: "Yeni şifre mevcut şifreyle aynı olamaz" }, { status: 400 });
  }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash }
  });

  return NextResponse.json({ ok: true });
}
