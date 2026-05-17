import { ContentCard } from "@/components/ContentCard";
import { HomeAdminHeartBar } from "@/components/HomeAdminHeartBar";
import { HomeTopReviews } from "@/components/HomeTopReviews";
import { ImageMarquee } from "@/components/ImageMarquee";
import { SiteReviewForm } from "@/components/SiteReviewForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const HOME_KEYS = {
  title: "home_page_title",
  subtitle: "home_page_subtitle",
  introHtml: "home_page_intro_html"
} as const;

const HOME_DEFAULTS = {
  title: "Kütüphane İçerikleri",
  subtitle: "",
  introHtml: ""
};

export default async function HomePage() {
  const [titleRow, subRow, introRow, contents, carouselSlides, topSiteReviews] = await Promise.all([
      prisma.setting.findUnique({ where: { key: HOME_KEYS.title } }),
      prisma.setting.findUnique({ where: { key: HOME_KEYS.subtitle } }),
      prisma.setting.findUnique({ where: { key: HOME_KEYS.introHtml } }),
      prisma.content.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.homeCarouselSlide.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }]
      }),
      prisma.siteReview.findMany({
        where: { isApproved: true },
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        take: 3,
        select: {
          id: true,
          fullName: true,
          message: true,
          rating: true,
          createdAt: true
        }
      })
    ]);

  const pageTitle = titleRow?.value ?? HOME_DEFAULTS.title;
  const pageSubtitle = subRow?.value ?? HOME_DEFAULTS.subtitle;
  const introHtml = introRow?.value ?? HOME_DEFAULTS.introHtml;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
        {pageSubtitle ? (
          <p className="text-lg text-slate-600">{pageSubtitle}</p>
        ) : null}
      </header>

      {introHtml.trim() && introHtml !== "<p></p>" && introHtml !== "<p><br></p>" ? (
        <div
          className="rich-snippet max-w-none rounded-xl border border-slate-200 bg-white p-5 shadow-sm [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : null}

      <ImageMarquee slides={carouselSlides} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Son paylaşılan içerikler</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => (
            <ContentCard key={content.id} {...content} />
          ))}
        </div>
      </div>

      <div id="site-yorum" className="scroll-mt-24 space-y-10 border-t border-slate-200 pt-10">
        <SiteReviewForm />
        <HomeTopReviews reviews={topSiteReviews} />
      </div>

      <HomeAdminHeartBar />
    </section>
  );
}
