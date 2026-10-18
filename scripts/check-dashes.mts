// Fails if any text file in the repo has an em or en dash. They read as AI-written.
// AGENTS.md is skipped because Next.js writes it and restores it on every `next dev`.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const SKIP = new Set(["AGENTS.md", "package-lock.json"]);
const TEXT = /\.(tsx?|mts|mjs|js|css|md|json|svg|txt)$/;

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n")
  .filter((file) => file && TEXT.test(file) && !SKIP.has(file) && existsSync(file));

let found = 0;
for (const file of files) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/[\u2012-\u2015]/.test(line)) {
        console.log(`${file}:${i + 1}: ${line.trim()}`);
        found++;
      }
    });
}

if (found) {
  console.log(`\n${found} line(s) with an em or en dash.`);
  process.exit(1);
}
console.log(`No em or en dashes in ${files.length} files.`);
