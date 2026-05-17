type Review = {
  id: number;
  fullName: string;
  message: string;
  rating: number;
  createdAt: Date;
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-500" aria-label={`${n} / 5 yıldız`}>
      {"★".repeat(n)}
      <span className="text-slate-300">{"☆".repeat(5 - n)}</span>
    </span>
  );
}

export function HomeTopReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="space-y-4" aria-labelledby="top-reviews-heading">
      <h2 id="top-reviews-heading" className="text-lg font-semibold text-slate-900">
        En yüksek puana sahip yorumlar
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <blockquote
            key={r.id}
            className="flex flex-col rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm"
          >
            <div className="mb-2 text-sm">
              <Stars n={r.rating} />
            </div>
            <p className="grow text-sm text-slate-800">&ldquo;{r.message}&rdquo;</p>
            <footer className="mt-3 text-xs font-medium text-slate-600">— {r.fullName}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
