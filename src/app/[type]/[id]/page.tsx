import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Cross } from "@/components/icons";
import { entries } from "@/data/entries";
import { getReview } from "@/lib/reviews";
import { formatScore } from "@/lib/text";
import { typeLabels, verdictLabels } from "@/lib/types";

// Every page comes from the list, so any other URL is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((entry) => ({ type: entry.type, id: String(entry.id) }));
}

export async function generateMetadata({ params }: PageProps<"/[type]/[id]">): Promise<Metadata> {
  const { type, id } = await params;
  const review = await getReview(type, id);
  if (!review) return {};

  const description = review.note ?? `Rated ${formatScore(review.rating)} out of 5, with what worked and what didn't.`;
  return {
    title: review.media.title,
    description,
    openGraph: {
      title: `${review.media.title}: ${formatScore(review.rating)}/5`,
      description,
      images: review.media.poster ? [review.media.poster.url] : undefined,
    },
  };
}

export default async function EntryPage({ params }: PageProps<"/[type]/[id]">) {
  const { type, id } = await params;
  const review = await getReview(type, id);
  if (!review) notFound();

  const { media } = review;
  const details = [media.year, ...media.facts].filter(Boolean).join(" · ");

  return (
    <article className="pb-6">
      <Link
        href="/"
        className="-ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-2 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        All ratings
      </Link>

      {/* Phones: poster and title side by side, the rest below. Wider: poster on the left, everything else beside it. */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-x-10 md:grid-cols-[280px_minmax(0,1fr)] md:gap-x-12">
        <div className="relative isolate self-start sm:row-span-2">
          {media.poster?.color && (
            <div
              aria-hidden="true"
              className="absolute inset-4 -z-10 opacity-30 blur-3xl"
              style={{ backgroundColor: media.poster.color }}
            />
          )}
          <div
            className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-surface shadow-2xl shadow-black/50 ring-1 ring-white/10"
            style={{ backgroundColor: media.poster?.color }}
          >
            {media.poster && (
              <Image
                src={media.poster.url}
                alt={`Poster for ${media.title}`}
                fill
                sizes="(min-width: 768px) 280px, (min-width: 640px) 220px, 50vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="min-w-0 self-center sm:self-start">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">{typeLabels[review.type].one}</p>
          <h1 className="mt-2 font-serif text-3xl leading-[1.05] text-balance sm:text-5xl">{media.title}</h1>
          {media.altTitle && <p className="mt-2 text-sm text-muted sm:text-base">{media.altTitle}</p>}
          {details && <p className="mt-3 text-sm text-muted">{details}</p>}
        </div>

        <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">
          {media.genres.length > 0 && (
            <ul aria-label="Genres" className="flex flex-wrap gap-2">
              {media.genres.map((genre) => (
                <li key={genre} className="rounded-full px-3 py-1 text-sm ring-1 ring-line">
                  {genre}
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl bg-accent/10 p-4 ring-1 ring-accent/40">
              <dt className="text-sm text-muted">My rating</dt>
              <dd className="mt-1 font-serif text-5xl leading-none text-accent">
                {formatScore(review.rating)}
                <Out />
              </dd>
            </div>
            <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
              <dt className="text-sm text-muted">Rewatch verdict</dt>
              <dd className="mt-2 font-serif text-3xl leading-tight">{verdictLabels[review.verdict]}</dd>
            </div>
          </dl>

          {review.note && (
            <blockquote className="mt-8 max-w-2xl border-l-2 border-accent pl-4 font-serif text-2xl italic leading-snug">
              {review.note}
            </blockquote>
          )}

          <div className="mt-10 grid max-w-3xl gap-8 sm:grid-cols-2">
            <Points heading="What worked" points={review.strong} good />
            <Points heading="What didn't" points={review.weak} />
          </div>

          <p className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            {review.year && <span>Watched in {review.year}</span>}
            <a href={media.url} className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-fg">
              See it on {review.source}
              <ArrowUpRight className="size-3.5" />
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}

/** "/5" for the eye, "out of 5" for screen readers. */
function Out() {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5 font-sans text-lg text-muted">
        /5
      </span>
      <span className="sr-only"> out of 5</span>
    </>
  );
}

function Points({ heading, points, good = false }: { heading: string; points: string[]; good?: boolean }) {
  const Icon = good ? Check : Cross;
  return (
    <section>
      <h2 className="font-serif text-2xl">{heading}</h2>
      <ul className="mt-3 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex gap-3 leading-relaxed">
            <Icon className={`mt-1 size-4 shrink-0 ${good ? "text-good" : "text-bad"}`} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
