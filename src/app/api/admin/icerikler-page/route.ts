import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText, sanitizeRichHtml } from "@/lib/security";
import { z } from "zod";

const keys = {
  title: "icerikler_page_title",
  introHtml: "icerikler_page_intro_html"
} as const;

const defaults = {
  pageTitle: "Tüm içerikler",
  introHtml:
    "<p>Yayınlanan tüm içerikleri tarihe göre listeleyebilir; başlıkta arama ve sıralama kullanabilirsiniz.</p>"
};

const putSchema = z.object({
  pageTitle: z.string().max(120),
  introHtml: z.string()
});

export async function GET() {
  const [titleRow, introRow] = await Promise.all([
    prisma.setting.findUnique({ where: { key: keys.title } }),
    prisma.setting.findUnique({ where: { key: keys.introHtml } })
  ]);

  return NextResponse.json({
    pageTitle: titleRow?.value ?? defaults.pageTitle,
    introHtml: introRow?.value ?? defaults.introHtml
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const pageTitle =
    sanitizePlainText(parsed.data.pageTitle).slice(0, 120) || defaults.pageTitle;
  const introHtml = sanitizeRichHtml(parsed.data.introHtml);

  await prisma.$transaction([
    prisma.setting.upsert({
      where: { key: keys.title },
      update: { value: pageTitle },
      create: { key: keys.title, value: pageTitle }
    }),
    prisma.setting.upsert({
      where: { key: keys.introHtml },
      update: { value: introHtml },
      create: { key: keys.introHtml, value: introHtml }
    })
  ]);

  return NextResponse.json({ pageTitle, introHtml });
}
