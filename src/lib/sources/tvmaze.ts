import { plain } from "@/lib/text";
import type { Media, Source } from "@/lib/types";

const ENDPOINT = "https://api.tvmaze.com/shows";

type TVmazeShow = {
  id: number;
  url: string;
  name: string;
  genres: string[];
  status: string;
  premiered: string | null;
  network: { name: string } | null;
  webChannel: { name: string } | null;
  image: { medium: string; original: string } | null;
  _embedded?: { seasons: unknown[] };
};

async function getShow(id: number, attempt = 1): Promise<TVmazeShow | undefined> {
  const res = await fetch(`${ENDPOINT}/${id}?embed=seasons`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (res.status === 404) return undefined;
  // TVmaze allows about 20 calls every 10 seconds.
  if (res.status === 429 && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return getShow(id, attempt + 1);
  }
  if (!res.ok) throw new Error(`TVmaze request for show ${id} failed with status ${res.status}`);
  return res.json();
}

function toMedia(show: TVmazeShow): Media {
  const seasons = show._embedded?.seasons.length;
  const facts = [
    seasons ? (seasons === 1 ? "1 season" : `${seasons} seasons`) : undefined,
    show.network?.name ?? show.webChannel?.name,
    show.status === "Running" ? "Still airing" : undefined,
  ]
    .filter((fact): fact is string => Boolean(fact))
    .map(plain);

  return {
    title: plain(show.name),
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : undefined,
    genres: show.genres.map(plain),
    facts,
    poster: show.image ? { url: show.image.original } : undefined,
    url: show.url,
  };
}

// TVmaze has no batch lookup, so this is one request per show, all at once.
export const tvmaze: Source = {
  name: "TVmaze",
  async fetchMedia(ids) {
    const shows = await Promise.all(ids.map((id) => getShow(id)));
    const found = new Map<number, Media>();
    for (const show of shows) if (show) found.set(show.id, toMedia(show));
    return found;
  },
};
