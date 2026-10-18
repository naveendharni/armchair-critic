import type { MediaType, Source } from "@/lib/types";
import { anilist } from "./anilist";

// Each type plugs in its own source: write a module that returns a Source,
// then set it here. Entries of a type without a source fail the build.
export const sources: Record<MediaType, Source | null> = {
  anime: anilist,
  movie: null, // TMDB. Needs TMDB_API_KEY in .env.local and in Vercel.
  show: null, // TVmaze
  webseries: null, // TVmaze
  singer: null, // Deezer
};
