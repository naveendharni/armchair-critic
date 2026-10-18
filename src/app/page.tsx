import { ReviewGrid, type Card } from "@/components/review-grid";
import { getReviews } from "@/lib/reviews";
import { typeLabels, type MediaType, type Review } from "@/lib/types";

/** "5 anime rated", later "5 anime, 2 movies rated". */
function summarize(reviews: Review[]): string {
  const counts = new Map<MediaType, number>();
  for (const review of reviews) counts.set(review.type, (counts.get(review.type) ?? 0) + 1);
  const parts = [...counts].map(([type, n]) => `${n} ${n === 1 ? typeLabels[type].one : typeLabels[type].many}`);
  return `${parts.join(", ")} rated`;
}

export default async function Home() {
  const reviews = await getReviews();
  const cards: Card[] = reviews.map((review) => ({
    slug: review.slug,
    title: review.media.title,
    year: review.media.year,
    rating: review.rating,
    poster: review.media.poster,
  }));

  return (
    <>
      <div className="pb-8 pt-6 sm:pb-10 sm:pt-12">
        <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl">What I watch, rated</h1>
        <p className="mt-3 max-w-xl text-muted sm:text-lg">
          My ratings out of 10, with what worked and what didn&apos;t.
        </p>
      </div>
      <ReviewGrid cards={cards} summary={summarize(reviews)} />
    </>
  );
}
