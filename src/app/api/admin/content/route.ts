import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/slug";
import { sanitizePlainText, sanitizeRichHtml } from "@/lib/security";

const schema = z.object({
  title: z.string().min(3),
  bodyHtml: z.string().min(10),
  coverImage: z.string().optional()
});

export async function POST(request: Request) {
  const data = await request.json();
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const title = sanitizePlainText(parsed.data.title);
  const slugBase = makeSlug(title);
  const existing = await prisma.content.count({
    where: { slug: { startsWith: slugBase } }
  });
  const slug = existing > 0 ? `${slugBase}-${existing + 1}` : slugBase;

  const content = await prisma.content.create({
    data: {
      title,
      slug,
      bodyHtml: sanitizeRichHtml(parsed.data.bodyHtml),
      coverImage: parsed.data.coverImage
        ? sanitizePlainText(parsed.data.coverImage)
        : null
    }
  });

  return NextResponse.json(content);
}
