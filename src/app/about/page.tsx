import { sanitizeGoogleMapsEmbedUrl } from "@/lib/security";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_ABOUT_SUBTITLE =
  "Kütüphane ve içeriklerimiz hakkında kısa bilgi ve görsel.";

export default async function AboutPage() {
  const [htmlRow, imgRow, subRow, mapRow] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "about_html" } }),
    prisma.setting.findUnique({ where: { key: "about_image_url" } }),
    prisma.setting.findUnique({ where: { key: "about_subtitle" } }),
    prisma.setting.findUnique({ where: { key: "about_map_embed_url" } })
  ]);

  const imageUrl = (imgRow?.value ?? "").trim();
  const subtitleBlock =
    subRow === null
      ? DEFAULT_ABOUT_SUBTITLE
      : (subRow.value ?? "").trim() || null;
  const bodyHtml =
    htmlRow?.value?.trim() && htmlRow.value !== "<p></p>" && htmlRow.value !== "<p><br></p>"
      ? htmlRow.value
      : "<p>Hakkımızda bilgisi henüz eklenmedi.</p>";

  const mapEmbedUrl = sanitizeGoogleMapsEmbedUrl(mapRow?.value ?? "");

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Hakkımızda</h1>
        {subtitleBlock ? (
          <p className="mt-1 max-w-3xl text-lg text-slate-600">{subtitleBlock}</p>
        ) : null}
      </header>

      {imageUrl ? (
        <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-md ring-1 ring-black/5">
          {/* Anasayfa galeri slaytlarıyla aynı yükseklik: ImageMarquee h-40 sm:h-44 */}
          <div className="relative h-40 w-full sm:h-44">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Hakkımızda görseli"
              className="absolute inset-0 h-full w-full max-w-full object-cover object-center"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
          </div>
        </div>
      ) : null}

      {mapEmbedUrl ? (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div
            className="prose max-w-none h-full min-h-0 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            <p className="shrink-0 border-b border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Konum
            </p>
            <div className="relative min-h-[220px] w-full flex-1 bg-slate-200">
              <iframe
                title="Google Haritalar"
                src={mapEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="prose max-w-none rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      )}
    </section>
  );
}
