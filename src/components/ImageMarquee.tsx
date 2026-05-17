import Link from "next/link";
import type { ReactNode } from "react";

export type MarqueeSlide = {
  id: number;
  imageUrl: string;
  altText: string | null;
  linkUrl: string | null;
};

function expandForLoop(slides: MarqueeSlide[]): MarqueeSlide[] {
  if (slides.length === 0) return [];
  let base = [...slides];
  while (base.length < 6) {
    base = [...base, ...slides];
  }
  return [...base, ...base];
}

function SlideLink({
  slide,
  children
}: {
  slide: MarqueeSlide;
  children: ReactNode;
}) {
  if (!slide.linkUrl) return <>{children}</>;
  if (slide.linkUrl.startsWith("http")) {
    return (
      <a
        href={slide.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={slide.linkUrl} className="block">
      {children}
    </Link>
  );
}

export function ImageMarquee({ slides }: { slides: MarqueeSlide[] }) {
  const loop = expandForLoop(slides);
  if (loop.length === 0) return null;

  return (
    <div className="relative -mx-4 overflow-hidden border-y border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 py-4 sm:-mx-0 sm:rounded-xl">
      <p className="mb-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        Galeri
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee gap-6 pr-6">
          {loop.map((s, idx) => (
            <figure key={`${s.id}-${idx}`} className="shrink-0">
              <SlideLink slide={s}>
                <img
                  src={s.imageUrl}
                  alt={s.altText ?? "Slayt"}
                  className="h-40 w-auto max-w-[min(92vw,26rem)] rounded-lg object-cover shadow-md ring-1 ring-black/5 sm:h-44"
                />
              </SlideLink>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
