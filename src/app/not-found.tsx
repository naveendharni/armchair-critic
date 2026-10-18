import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28">
      <h1 className="font-serif text-5xl">Page not found</h1>
      <p className="mt-3 text-muted">Nothing is rated at this address.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-5 font-medium text-on-accent"
      >
        See all ratings
      </Link>
    </div>
  );
}
