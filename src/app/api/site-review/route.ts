import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText } from "@/lib/security";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
  gender: z.enum(["MALE", "FEMALE"]),
  rating: z.number().int().min(1).max(5)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  await prisma.siteReview.create({
    data: {
      fullName: sanitizePlainText(parsed.data.fullName).slice(0, 120),
      message: sanitizePlainText(parsed.data.message).slice(0, 2000),
      gender: parsed.data.gender,
      rating: parsed.data.rating
    }
  });

  return NextResponse.json({ ok: true });
}
