import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";

export function HomePage() {
  return (
    <section className="flex min-h-64 items-center justify-center bg-hero sm:min-h-80">
      <div>
        <h1>Find your next stay</h1>
        <VenueSearchForm />
      </div>
    </section>
  );
}
