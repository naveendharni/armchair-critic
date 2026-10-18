export type MediaType = "anime" | "movie" | "show" | "webseries" | "singer";

/** Two or three short points. */
export type Points = [string, string] | [string, string, string];

/** One thing I rated. Every item in src/data/entries.ts has this shape. */
export type Entry = {
  type: MediaType;
  /** ID on the source for this type (AniList for anime). `npm run find` looks it up. */
  id: number;
  /** My rating out of 10. One decimal at most, like 7.5. */
  rating: number;
  /** What worked. */
  strong: Points;
  /** What didn't. */
  weak: Points;
  /** The year I watched it. */
  year?: number;
  /** One line, shown as a quote on the entry page. */
  note?: string;
};

/** What a source returns for one ID, in the same shape for every source. */
export type Media = {
  title: string;
  /** Romanized or original title, when it differs from `title`. */
  altTitle?: string;
  year?: number;
  genres: string[];
  /** Short facts for the details line, like "TV", "25 episodes" or the studio. */
  facts: string[];
  poster?: { url: string; color?: string };
  /** Average score from the source, out of 10. */
  score?: number;
  /** This title's page on the source site. */
  url: string;
};

/** Where one type gets its posters and details. Each type plugs in its own. */
export type Source = {
  /** Shown with the average score, as in "AniList average". */
  name: string;
  /** Looks up every ID, in as few requests as the API allows. IDs it can't find are left out. */
  fetchMedia(ids: number[]): Promise<Map<number, Media>>;
};

export type Review = Entry & {
  media: Media;
  /** Name of the source, like "AniList". */
  source: string;
  /** Path of the entry page, like "anime/16498". */
  slug: string;
};

export const typeLabels: Record<MediaType, { one: string; many: string }> = {
  anime: { one: "anime", many: "anime" },
  movie: { one: "movie", many: "movies" },
  show: { one: "TV show", many: "TV shows" },
  webseries: { one: "web series", many: "web series" },
  singer: { one: "singer", many: "singers" },
};
