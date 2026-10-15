import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";

export function HomePage() {
  return (
    <section className="flex w-full min-w-0 min-h-64 items-center justify-center bg-hero sm:min-h-80">
      <div className="w-full min-w-0 max-w-6xl px-4">
        <h1>Find your next stay</h1>
        <VenueSearchForm />
      </div>
    </section>
  );
}
