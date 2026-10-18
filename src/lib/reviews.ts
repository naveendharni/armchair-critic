import { entries } from "@/data/entries";
import { sources } from "@/lib/sources";
import { LONG_DASH } from "@/lib/text";
import type { Entry, Media, MediaType, Review } from "@/lib/types";

/** Catches mistakes in the list before anything is fetched, so a bad entry fails the build. */
function validate(list: Entry[]): void {
  const problems: string[] = [];
  const seen = new Set<string>();

  if (list.length === 0) problems.push("The list is empty. Add at least one entry.");

  list.forEach((entry, i) => {
    const where = `Entry ${i + 1} (${entry.type} ${entry.id})`;
    const key = `${entry.type}/${entry.id}`;

    if (seen.has(key)) problems.push(`${where} is in the list twice.`);
    seen.add(key);

    if (!sources[entry.type]) problems.push(`${where}: there is no source for ${entry.type} yet.`);
    if (!Number.isInteger(entry.id) || entry.id <= 0) problems.push(`${where}: the ID must be a whole number.`);
    if (!(entry.rating >= 0 && entry.rating <= 10) || Math.round(entry.rating * 10) !== entry.rating * 10) {
      problems.push(`${where}: the rating must be from 0 to 10, with one decimal at most.`);
    }

    const points = [...entry.strong, ...entry.weak];
    if (points.some((point) => !point.trim())) {
      problems.push(`${where}: a strong or weak point is empty.`);
    }
    if (entry.note !== undefined && (!entry.note.trim() || entry.note.includes("\n"))) {
      problems.push(`${where}: the note must be one line.`);
    }
    if ([...points, entry.note ?? ""].some((text) => LONG_DASH.test(text))) {
      problems.push(`${where}: has an em or en dash. Use a comma, a period or plain words.`);
    }
  });

  if (problems.length) {
    throw new Error(`Fix src/data/entries.ts:\n  ${problems.join("\n  ")}`);
  }
}

async function load(): Promise<Review[]> {
  validate(entries);

  // One request per source, carrying every ID of that type.
  const types = [...new Set(entries.map((entry) => entry.type))];
  const found = new Map<MediaType, Map<number, Media>>(
    await Promise.all(
      types.map(async (type) => {
        const ids = entries.filter((entry) => entry.type === type).map((entry) => entry.id);
        return [type, await sources[type]!.fetchMedia(ids)] as const;
      }),
    ),
  );

  const missing: string[] = [];
  const reviews = entries.flatMap((entry) => {
    const media = found.get(entry.type)?.get(entry.id);
    if (!media) {
      missing.push(`${entry.type} ${entry.id}`);
      return [];
    }
    return [{ ...entry, media, source: sources[entry.type]!.name, slug: `${entry.type}/${entry.id}` }];
  });

  if (missing.length) {
    throw new Error(
      `Not found on the source: ${missing.join(", ")}. Check the IDs in src/data/entries.ts with npm run find.`,
    );
  }
  return reviews;
}

let cached: Promise<Review[]> | undefined;

/**
 * Every entry joined with its source data. Pages share one fetch per build
 * process, so the home page and every entry page reuse the same request.
 */
export function getReviews(): Promise<Review[]> {
  cached ??= load().catch((error) => {
    cached = undefined;
    throw error;
  });
  return cached;
}

export async function getReview(type: string, id: string): Promise<Review | undefined> {
  const reviews = await getReviews();
  return reviews.find((review) => review.type === type && String(review.id) === id);
}
