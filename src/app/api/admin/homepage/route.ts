import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText, sanitizeRichHtml } from "@/lib/security";
import { z } from "zod";

const keys = {
  title: "home_page_title",
  subtitle: "home_page_subtitle",
  introHtml: "home_page_intro_html"
} as const;

const defaults = {
  title: "Kütüphane İçerikleri",
  subtitle: "",
  introHtml: ""
};

const putSchema = z.object({
  title: z.string().max(200),
  subtitle: z.string().max(500),
  introHtml: z.string()
});

export async function GET() {
  const [titleRow, subRow, introRow] = await Promise.all([
    prisma.setting.findUnique({ where: { key: keys.title } }),
    prisma.setting.findUnique({ where: { key: keys.subtitle } }),
    prisma.setting.findUnique({ where: { key: keys.introHtml } })
  ]);

  return NextResponse.json({
    title: titleRow?.value ?? defaults.title,
    subtitle: subRow?.value ?? defaults.subtitle,
    introHtml: introRow?.value ?? defaults.introHtml
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const title = sanitizePlainText(parsed.data.title) || defaults.title;
  const subtitle = sanitizePlainText(parsed.data.subtitle);
  const introHtml = sanitizeRichHtml(parsed.data.introHtml);

  await prisma.$transaction([
    prisma.setting.upsert({
      where: { key: keys.title },
      update: { value: title },
      create: { key: keys.title, value: title }
    }),
    prisma.setting.upsert({
      where: { key: keys.subtitle },
      update: { value: subtitle },
      create: { key: keys.subtitle, value: subtitle }
    }),
    prisma.setting.upsert({
      where: { key: keys.introHtml },
      update: { value: introHtml },
      create: { key: keys.introHtml, value: introHtml }
    })
  ]);

  return NextResponse.json({ title, subtitle, introHtml });
}
