function Stars({ n }: { n: number }) {
  if (n < 1 || n > 5) return null;
  return (
    <span className="text-amber-500" aria-label={`${n} / 5 yıldız`}>
      {"★".repeat(n)}
      <span className="text-slate-300">{"☆".repeat(5 - n)}</span>
    </span>
  );
}

type Row = {
  id: number;
  fullName: string;
  message: string;
  rating: number;
  createdAt: Date;
};

export function ContentApprovedComments({ comments }: { comments: Row[] }) {
  if (comments.length === 0) return null;

  return (
    <section className="space-y-4" aria-labelledby="content-comments-heading">
      <h2 id="content-comments-heading" className="text-lg font-semibold text-slate-900">
        Yorumlar
      </h2>
      <ul className="space-y-4">
        {comments.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
          >
            {c.rating >= 1 && c.rating <= 5 ? (
              <div className="mb-2 text-sm">
                <Stars n={c.rating} />
              </div>
            ) : null}
            <p className="text-sm text-slate-800">&ldquo;{c.message}&rdquo;</p>
            <footer className="mt-2 text-xs font-medium text-slate-600">
              — {c.fullName}
              <span className="ml-2 font-normal text-slate-500">
                {new Intl.DateTimeFormat("tr-TR", {
                  dateStyle: "medium",
                  timeStyle: "short"
                }).format(new Date(c.createdAt))}
              </span>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
