import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentApprovedComments } from "@/components/ContentApprovedComments";
import { ContentCommentForm } from "@/components/ContentCommentForm";
import { RatingStars } from "@/components/RatingStars";

export const dynamic = "force-dynamic";

export default async function ContentDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await prisma.content.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { isApproved: true, isGuestbook: false, announcementId: null },
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
  });

  if (!content) notFound();

  const { comments, ...article } = content;

  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt={article.title}
          className="max-h-96 w-full rounded-xl object-cover"
        />
      ) : null}
      <div
        className="prose max-w-none rounded-lg bg-white p-4 shadow-sm"
        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
      />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Hızlı puan</h2>
        <p className="text-sm text-slate-600">
          İçeriği tek tıkla 1–5 yıldızla değerlendirin (yorum formundan bağımsız ortalama).
        </p>
        <RatingStars
          contentId={article.id}
          initialRate={article.averageRate}
          initialVotes={article.voteCount}
        />
      </div>

      <ContentApprovedComments comments={comments} />
      <ContentCommentForm contentId={article.id} />
    </article>
  );
}
