import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <h1 id="not-found-heading">Page not found</h1>

      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">
          The page you’re looking for may have moved or been removed
        </p>

        <Link
          to="/"
          className="btn-primary btn-primary-compact mt-5 inline-flex"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
