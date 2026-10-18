"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatScore } from "@/lib/text";

/** Just what a poster card needs, so the page sends the browser as little as possible. */
export type Card = {
  slug: string;
  title: string;
  year?: number;
  rating: number;
  poster?: { url: string; color?: string };
};

type SortKey = "high" | "low" | "title";

const byTitle = (a: Card, b: Card) => a.title.localeCompare(b.title);

const SORTS: Record<SortKey, { label: string; spoken: string; compare: (a: Card, b: Card) => number }> = {
  high: { label: "Highest", spoken: "highest rating first", compare: (a, b) => b.rating - a.rating || byTitle(a, b) },
  low: { label: "Lowest", spoken: "lowest rating first", compare: (a, b) => a.rating - b.rating || byTitle(a, b) },
  title: { label: "A to Z", spoken: "title, A to Z", compare: byTitle },
};

// Matches the grid columns below: 2 on phones up to 5 on wide screens.
const SIZES = "(min-width: 1152px) 210px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw";

export function ReviewGrid({ cards, summary }: { cards: Card[]; summary: string }) {
  const [sort, setSort] = useState<SortKey>("high");
  const [announcement, setAnnouncement] = useState("");
  const sorted = useMemo(() => [...cards].sort(SORTS[sort].compare), [cards, sort]);

  return (
    <section aria-labelledby="list-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <h2 id="list-heading" className="text-sm text-muted">
          {summary}
        </h2>
        <div role="group" aria-label="Sort" className="flex rounded-full bg-surface p-1 ring-1 ring-line">
          {(Object.keys(SORTS) as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={sort === key}
              onClick={() => {
                setSort(key);
                setAnnouncement(`Sorted by ${SORTS[key].spoken}`);
              }}
              className="h-9 rounded-full px-3.5 text-sm font-medium text-muted transition-colors aria-[pressed=false]:hover:text-fg aria-pressed:bg-accent aria-pressed:text-on-accent"
            >
              {SORTS[key].label}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5">
        {sorted.map((card, i) => (
          <PosterCard key={card.slug} card={card} eager={i < 4} />
        ))}
      </ul>
    </section>
  );
}

function PosterCard({ card, eager }: { card: Card; eager: boolean }) {
  const rating = formatScore(card.rating);

  return (
    <li>
      <Link href={`/${card.slug}`} className="group block rounded-xl">
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface ring-1 ring-white/10"
          style={{ backgroundColor: card.poster?.color }}
        >
          {card.poster ? (
            // The title is right below, so the poster itself is decorative here.
            <Image
              src={card.poster.url}
              alt=""
              fill
              sizes={SIZES}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center p-3 text-center text-sm text-muted">
              No poster
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute left-2 top-2 rounded-lg bg-accent px-2 py-1.5 text-base font-bold leading-none tabular-nums text-on-accent shadow-lg shadow-black/40"
          >
            {rating}
            <span className="text-[0.7em] font-semibold opacity-75">/10</span>
          </span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-medium leading-snug transition-colors group-hover:text-accent">
          {card.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {card.year}
          <span className="sr-only">
            {card.year ? ", " : ""}my rating {rating} out of 10
          </span>
        </p>
      </Link>
    </li>
  );
}
