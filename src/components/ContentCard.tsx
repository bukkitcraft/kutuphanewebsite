import Link from "next/link";

type ContentCardProps = {
  title: string;
  slug: string;
  coverImage?: string | null;
  bodyHtml: string;
  averageRate: number;
  voteCount: number;
  createdAt: Date;
};

export function ContentCard({
  title,
  slug,
  coverImage,
  bodyHtml,
  averageRate,
  voteCount,
  createdAt
}: ContentCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {coverImage ? (
        <img src={coverImage} alt={title} className="h-48 w-full object-cover" />
      ) : null}
      <div className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="line-clamp-3 text-sm text-slate-600">
          {bodyHtml.replace(/<[^>]*>/g, "")}
        </p>
        <p className="text-xs text-slate-500">
          Puan: {averageRate.toFixed(1)} / 5 ({voteCount} oy) -{" "}
          {new Intl.DateTimeFormat("tr-TR").format(createdAt)}
        </p>
        <Link
          href={`/content/${slug}`}
          className="inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Devamını oku
        </Link>
      </div>
    </article>
  );
}
