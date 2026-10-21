"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatScore } from "@/lib/text";
import { verdictLabels, type MediaType, type Verdict } from "@/lib/types";

/** Just what a poster card needs, so the page sends the browser as little as possible. */
export type Card = {
  slug: string;
  type: MediaType;
  title: string;
  year?: number;
  rating: number;
  verdict: Verdict;
  poster?: { url: string; color?: string };
};

type SortKey = "high" | "low" | "title";

const byTitle = (a: Card, b: Card) => a.title.localeCompare(b.title);

const SORTS: Record<SortKey, { label: string; spoken: string; compare: (a: Card, b: Card) => number }> = {
  high: { label: "Highest", spoken: "highest rating first", compare: (a, b) => b.rating - a.rating || byTitle(a, b) },
  low: { label: "Lowest", spoken: "lowest rating first", compare: (a, b) => a.rating - b.rating || byTitle(a, b) },
  title: { label: "A to Z", spoken: "title, A to Z", compare: byTitle },
};

// Medal colors by rating: gold for 5, silver from 4, bronze from 3. All pass WCAG AA.
function badgeClass(rating: number): string {
  if (rating >= 5) return "bg-linear-to-br from-[#fbd476] to-[#e9a82a] text-[#1c1404]";
  if (rating >= 4) return "bg-linear-to-br from-[#f4f5f7] to-[#b9bec8] text-[#15171c]";
  if (rating >= 3) return "bg-linear-to-br from-[#e8b08a] to-[#b8774a] text-[#1f1206]";
  return "bg-surface text-muted ring-1 ring-line";
}

// Matches the grid columns below: 2 on phones up to 5 on wide screens.
const SIZES = "(min-width: 1152px) 210px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw";

/** One filter chip per type in the list, like { type: "show", label: "TV shows" }. */
export type TypeFilter = { type: MediaType; label: string };

export function ReviewGrid({ cards, summary, types }: { cards: Card[]; summary: string; types: TypeFilter[] }) {
  const [sort, setSort] = useState<SortKey>("high");
  const [type, setType] = useState<MediaType | "all">("all");
  const [announcement, setAnnouncement] = useState("");
  const sorted = useMemo(
    () => cards.filter((card) => type === "all" || card.type === type).sort(SORTS[sort].compare),
    [cards, sort, type],
  );
  const filters = [{ type: "all" as const, label: "All" }, ...types];

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

      {types.length > 1 && (
        <div role="group" aria-label="Show" className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.type}
              type="button"
              aria-pressed={type === filter.type}
              onClick={() => {
                setType(filter.type);
                setAnnouncement(`Showing ${filter.type === "all" ? "everything" : filter.label}`);
              }}
              className="h-9 rounded-full px-4 text-sm font-medium text-muted ring-1 ring-line transition-colors aria-[pressed=false]:hover:text-fg aria-pressed:bg-fg aria-pressed:text-bg aria-pressed:ring-fg"
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

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
      <Link
        href={`/${card.slug}`}
        className="group block rounded-xl transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface ring-1 ring-white/10 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/60"
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
            className={`absolute left-2 top-2 rounded-lg px-2 py-1.5 text-base font-bold leading-none tabular-nums shadow-lg shadow-black/40 ${badgeClass(card.rating)}`}
          >
            {rating}
            <span className="text-[0.7em] font-semibold opacity-75">/5</span>
          </span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-medium leading-snug transition-colors group-hover:text-accent">
          {card.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {[card.year, verdictLabels[card.verdict]].filter(Boolean).join(" · ")}
          <span className="sr-only">, my rating {rating} out of 5</span>
        </p>
      </Link>
    </li>
  );
}
