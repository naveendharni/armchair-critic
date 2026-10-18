/** Em, en and other long dashes. None of them may appear on the site. */
export const LONG_DASH = /[\u2012-\u2015]/;

/** Swaps long dashes in source text (titles, studios) for plain hyphens. */
export function plain(text: string): string {
  return text.replace(/[\u2012-\u2015]/g, "-");
}

/** 4 stays "4", 3.5 stays "3.5". */
export function formatScore(score: number): string {
  return String(Math.round(score * 10) / 10);
}
