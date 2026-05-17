import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeGoogleMapsEmbedUrl,
  sanitizePlainText,
  sanitizeRichHtml
} from "@/lib/security";

const DEFAULT_SUBTITLE =
  "Kütüphane ve içeriklerimiz hakkında kısa bilgi ve görsel.";

export async function GET() {
  const [htmlRow, imgRow, subRow, mapRow] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "about_html" } }),
    prisma.setting.findUnique({ where: { key: "about_image_url" } }),
    prisma.setting.findUnique({ where: { key: "about_subtitle" } }),
    prisma.setting.findUnique({ where: { key: "about_map_embed_url" } })
  ]);
  const subtitle =
    subRow === null ? DEFAULT_SUBTITLE : (subRow.value ?? "");
  return NextResponse.json({
    value: htmlRow?.value ?? "<p></p>",
    imageUrl: (imgRow?.value ?? "").trim(),
    subtitle,
    mapEmbedUrl: (mapRow?.value ?? "").trim()
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const value = sanitizeRichHtml(String(body.value ?? ""));
  const rawImg = body.imageUrl != null ? String(body.imageUrl) : "";
  const imageUrl = rawImg.trim() ? sanitizePlainText(rawImg).slice(0, 2000) : "";
  const subtitle = sanitizePlainText(String(body.subtitle ?? "")).slice(0, 500);
  const mapEmbedUrl = sanitizeGoogleMapsEmbedUrl(String(body.mapEmbedUrl ?? ""));

  await prisma.setting.upsert({
    where: { key: "about_html" },
    update: { value },
    create: { key: "about_html", value }
  });
  await prisma.setting.upsert({
    where: { key: "about_image_url" },
    update: { value: imageUrl },
    create: { key: "about_image_url", value: imageUrl }
  });
  await prisma.setting.upsert({
    where: { key: "about_subtitle" },
    update: { value: subtitle },
    create: { key: "about_subtitle", value: subtitle }
  });
  await prisma.setting.upsert({
    where: { key: "about_map_embed_url" },
    update: { value: mapEmbedUrl },
    create: { key: "about_map_embed_url", value: mapEmbedUrl }
  });
  return NextResponse.json({ ok: true });
}
