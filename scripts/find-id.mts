// Finds the source ID for a title, to copy into src/data/entries.ts.
//   npm run find -- "attack on titan"
//   npm run find -- --type anime "frieren"

type Match = { id: number; title: string; details: string };

type AniListSearch = {
  data?: {
    Page: {
      media: {
        id: number;
        title: { english: string | null; romaji: string | null };
        startDate: { year: number | null };
        format: string | null;
        episodes: number | null;
      }[];
    };
  };
  errors?: { message: string }[];
};

async function findAnime(search: string): Promise<Match[]> {
  const query = `query ($search: String) {
    Page(perPage: 8) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        title { english romaji }
        startDate { year }
        format
        episodes
      }
    }
  }`;
  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables: { search } }),
  });
  if (!res.ok) throw new Error(`AniList request failed with status ${res.status}`);
  const json = (await res.json()) as AniListSearch;
  if (!json.data) throw new Error(json.errors?.map((e) => e.message).join("; ") ?? "AniList returned no data");

  return json.data.Page.media.map((m) => {
    const { english, romaji } = m.title;
    const title = english && romaji && english !== romaji ? `${english} (${romaji})` : (english ?? romaji ?? "");
    const details = [m.startDate.year, m.format, m.episodes && `${m.episodes} ${m.episodes === 1 ? "ep" : "eps"}`].filter(Boolean).join(", ");
    return { id: m.id, title, details };
  });
}

// One search per type. Movies (TMDB), shows (TVmaze) and singers (Deezer) go here later.
const finders: Record<string, (search: string) => Promise<Match[]>> = {
  anime: findAnime,
};

const args = process.argv.slice(2);
let type = "anime";
const typeFlag = args.indexOf("--type");
if (typeFlag !== -1) {
  type = args[typeFlag + 1] ?? "";
  args.splice(typeFlag, 2);
}
const search = args.join(" ").trim();

if (!search) {
  console.log('Usage: npm run find -- "title"');
  process.exit(1);
}
const find = finders[type];
if (!find) {
  console.log(`Search for "${type}" is not built yet. Only anime works for now.`);
  process.exit(1);
}

const matches = await find(search);
if (matches.length === 0) {
  console.log(`No ${type} found for "${search}".`);
  process.exit(1);
}

const width = Math.max(...matches.map((m) => String(m.id).length));
for (const m of matches) console.log(`${String(m.id).padStart(width)}  ${m.title}  [${m.details}]`);
console.log(`\nCopy the ID into src/data/entries.ts, as in { type: "${type}", id: ${matches[0].id}, ... }`);
