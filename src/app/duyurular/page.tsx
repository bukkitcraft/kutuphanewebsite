import { prisma } from "@/lib/prisma";
import { ContentApprovedComments } from "@/components/ContentApprovedComments";
import { AnnouncementCommentBox } from "@/components/AnnouncementCommentBox";

export const dynamic = "force-dynamic";

const KEYS = {
  title: "announcements_page_title",
  introHtml: "announcements_page_intro_html"
} as const;

const DEFAULTS = {
  pageTitle: "Duyurular",
  introHtml: "<p>Önemli duyurularımızı bu sayfadan takip edebilirsiniz.</p>"
};

export default async function DuyurularPage() {
  const [titleRow, introRow, announcements] = await Promise.all([
    prisma.setting.findUnique({ where: { key: KEYS.title } }),
    prisma.setting.findUnique({ where: { key: KEYS.introHtml } }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      include: {
        comments: {
          where: {
            isApproved: true,
            isGuestbook: false,
            contentId: null
          },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            fullName: true,
            message: true,
            rating: true,
            createdAt: true
          }
        }
      }
    })
  ]);

  const pageTitle = titleRow?.value ?? DEFAULTS.pageTitle;
  const introHtml = introRow?.value ?? DEFAULTS.introHtml;

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
        <div
          className="rich-snippet max-w-none text-slate-700 [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      </header>

      {announcements.length === 0 ? (
        <p className="text-slate-600">Şu an yayında duyuru bulunmuyor.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {announcements.map((a) => (
            <article
              key={a.id}
              id={`duyuru-${a.id}`}
              className="flex flex-col gap-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold text-amber-950">{a.title}</h2>
                <div
                  className="rich-snippet mt-3 text-sm leading-relaxed text-amber-950/90 [&_a]:text-amber-800 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: a.bodyHtml }}
                />
              </div>
              <div className="mt-auto space-y-6 border-t border-amber-200/80 pt-6">
                <ContentApprovedComments comments={a.comments} />
                <AnnouncementCommentBox announcementId={a.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
