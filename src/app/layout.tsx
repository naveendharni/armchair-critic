import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/icons";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: "Armchair Critic", template: "%s | Armchair Critic" },
  description: "Anime I've watched, rated out of 10, with what worked and what didn't.",
};

export const viewport: Viewport = {
  themeColor: "#0b0c0f",
  colorScheme: "dark",
};

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-md bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>

        <header className={`${container} flex items-center justify-between py-3`}>
          <Link href="/" className="flex items-center gap-2.5 rounded-md py-1">
            <Logo className="size-8" />
            <span className="font-serif text-2xl">Armchair Critic</span>
          </Link>
          <a
            href="https://naveendharni.netlify.app"
            className="rounded-md px-1 py-2 text-sm text-muted transition-colors hover:text-fg"
          >
            by Naveen
          </a>
        </header>

        <main id="main" tabIndex={-1} className={`${container} flex-1 focus-visible:outline-none`}>
          {children}
        </main>

        <footer className={`${container} py-10 text-sm text-muted`}>
          Posters and details from{" "}
          <a href="https://anilist.co" className="underline underline-offset-4 hover:text-fg">
            AniList
          </a>
          .
        </footer>
      </body>
    </html>
  );
}
