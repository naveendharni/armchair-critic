# Armchair Critic

I rate what I watch out of 5, with what worked and what didn't. Anime for now. Movies, TV shows, web series and singers come later.

Built with Next.js, TypeScript and Tailwind. Posters and details come from the AniList API at build time, so every page is static.

<img src="docs/screenshots/grid-top.png" alt="The poster grid on a phone, sorted by highest rating" width="300">

## Run it

Needs Node 22.18 or newer.

```bash
npm install
npm run dev
```

## Add a rating

1. Find the ID: `npm run find -- "frieren"`
2. Add an entry to `src/data/entries.ts`.
3. Run `npm run check` and `npm run build`.

The build stops with a plain message if an entry is wrong: a rating outside 0.5 to 5, the wrong number of points, an ID AniList doesn't know, or an em or en dash.
