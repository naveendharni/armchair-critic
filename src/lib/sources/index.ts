import type { MediaType, Source } from "@/lib/types";
import { anilist } from "./anilist";
import { tvmaze } from "./tvmaze";

// Each type plugs in its own source: write a module that returns a Source,
// then set it here. Entries of a type without a source fail the build.
export const sources: Record<MediaType, Source | null> = {
  anime: anilist,
  movie: null, // TMDB. Needs TMDB_TOKEN in .env.local and in Vercel.
  show: tvmaze,
  webseries: tvmaze,
  singer: null, // Deezer
};
