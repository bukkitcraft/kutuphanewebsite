import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { prisma } from "@/lib/prisma";
import { IceriklerToolbar } from "./IceriklerToolbar";

export const dynamic = "force-dynamic";

const KEYS = {
  title: "icerikler_page_title",
  introHtml: "icerikler_page_intro_html"
} as const;

const DEFAULTS = {
  pageTitle: "Tüm içerikler",
  introHtml:
    "<p>Yayınlanan tüm içerikleri tarihe göre listeleyebilir; başlıkta arama ve sıralama kullanabilirsiniz.</p>"
};

export async function generateMetadata(): Promise<Metadata> {
  const row = await prisma.setting.findUnique({ where: { key: KEYS.title } });
  const title = row?.value?.trim() || DEFAULTS.pageTitle;
  return {
    title,
    description: "Kütüphane ve haber içeriklerinin tam listesi"
  };
}

type Props = {
  searchParams: Promise<{ q?: string; sort?: string }>;
};

export default async function IceriklerPage({ searchParams }: Props) {
  const { q: qRaw, sort: sortRaw } = await searchParams;
  const q = (qRaw ?? "").trim();
  const order = sortRaw === "oldest" ? "asc" : "desc";

  const [titleRow, introRow, allContents] = await Promise.all([
    prisma.setting.findUnique({ where: { key: KEYS.title } }),
    prisma.setting.findUnique({ where: { key: KEYS.introHtml } }),
    prisma.content.findMany({
      orderBy: { createdAt: order }
    })
  ]);

  const pageTitle = titleRow?.value?.trim() || DEFAULTS.pageTitle;
  const introHtml = introRow?.value?.trim() ? introRow.value : DEFAULTS.introHtml;

  const contents = q
    ? allContents.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()))
    : allContents;

  const showEmptySearch = q.length > 0 && contents.length === 0;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
        {introHtml.trim() &&
        introHtml !== "<p></p>" &&
        introHtml !== "<p><br></p>" ? (
          <div
            className="rich-snippet max-w-none text-lg text-slate-600 [&_a]:text-blue-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
        ) : null}
      </header>

      <IceriklerToolbar />

      {showEmptySearch ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-slate-800">
          “{q}” için eşleşen içerik bulunamadı. Farklı bir arama deneyin veya sıfırlayın.
        </p>
      ) : null}

      {!contents.length && !q ? (
        <p className="text-slate-600">Henüz yayında içerik bulunmuyor.</p>
      ) : null}

      {contents.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => (
            <ContentCard key={content.id} {...content} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
