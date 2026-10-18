import { plain } from "@/lib/text";
import type { Media, Source } from "@/lib/types";

const ENDPOINT = "https://graphql.anilist.co";
// AniList returns at most 50 items per page.
const PAGE_SIZE = 50;

const FIELDS = `
fragment Fields on Media {
  id
  siteUrl
  title { english romaji }
  startDate { year }
  genres
  format
  episodes
  status
  studios(isMain: true) { nodes { name } }
  coverImage { extraLarge color }
}`;

type AniListMedia = {
  id: number;
  siteUrl: string;
  title: { english: string | null; romaji: string | null };
  startDate: { year: number | null };
  genres: string[];
  format: string | null;
  episodes: number | null;
  status: string | null;
  studios: { nodes: { name: string }[] };
  coverImage: { extraLarge: string | null; color: string | null };
};

type AniListResponse = {
  data?: Record<string, { media: AniListMedia[] }>;
  errors?: { message: string }[];
};

const FORMATS: Record<string, string> = {
  TV: "TV",
  TV_SHORT: "TV short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music video",
};

// More than 50 IDs need more than one page. Each page gets an alias (p0, p1, ...)
// so the whole list still goes out as a single request.
function buildQuery(pageCount: number): string {
  const vars = Array.from({ length: pageCount }, (_, i) => `$p${i}: [Int]`).join(", ");
  const pages = Array.from(
    { length: pageCount },
    (_, i) => `  p${i}: Page(perPage: ${PAGE_SIZE}) { media(id_in: $p${i}, type: ANIME) { ...Fields } }`,
  ).join("\n");
  return `query (${vars}) {\n${pages}\n}\n${FIELDS}`;
}

async function post(body: string, attempt = 1): Promise<AniListResponse> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
    signal: AbortSignal.timeout(20_000),
  });
  if (res.status === 429 && attempt < 3) {
    const wait = Math.min(Number(res.headers.get("retry-after")) || 10, 60);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
    return post(body, attempt + 1);
  }
  if (!res.ok) throw new Error(`AniList request failed with status ${res.status}`);
  return res.json();
}

function toMedia(m: AniListMedia): Media {
  const title = plain(m.title.english ?? m.title.romaji ?? `AniList ${m.id}`);
  const romaji = m.title.romaji ? plain(m.title.romaji) : undefined;
  const isMovie = m.format === "MOVIE";

  let episodes: string | undefined;
  if (m.episodes && !isMovie) episodes = m.episodes === 1 ? "1 episode" : `${m.episodes} episodes`;
  else if (m.status === "RELEASING") episodes = "Still airing";

  const facts = [m.format ? FORMATS[m.format] : undefined, episodes, m.studios.nodes[0]?.name]
    .filter((fact): fact is string => Boolean(fact))
    .map(plain);

  return {
    title,
    altTitle: romaji && romaji.toLowerCase() !== title.toLowerCase() ? romaji : undefined,
    year: m.startDate.year ?? undefined,
    genres: m.genres.map(plain),
    facts,
    poster: m.coverImage.extraLarge
      ? { url: m.coverImage.extraLarge, color: m.coverImage.color ?? undefined }
      : undefined,
    url: m.siteUrl,
  };
}

export const anilist: Source = {
  name: "AniList",
  async fetchMedia(ids) {
    const pages: number[][] = [];
    for (let i = 0; i < ids.length; i += PAGE_SIZE) pages.push(ids.slice(i, i + PAGE_SIZE));
    const variables = Object.fromEntries(pages.map((page, i) => [`p${i}`, page]));

    const json = await post(JSON.stringify({ query: buildQuery(pages.length), variables }));
    if (json.errors?.length) {
      throw new Error(`AniList error: ${json.errors.map((e) => e.message).join("; ")}`);
    }

    const found = new Map<number, Media>();
    for (const page of Object.values(json.data ?? {})) {
      for (const m of page.media) found.set(m.id, toMedia(m));
    }
    return found;
  },
};
