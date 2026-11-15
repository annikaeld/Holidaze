import { useQuery } from "@tanstack/react-query";
import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { getAllVenues } from "@/features/venues/services/venuesApi";
import { DestinationShortcuts } from "@/features/venues/components/DestinationShortcuts";

async function getRandomVenues() {
  const venues = await getAllVenues();

  return [...venues]
    .filter((venue) => venue.media?.[0]?.url)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
}

export function HomePage() {
  const {
    data: randomVenues = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["random-venues"],
    queryFn: getRandomVenues,
    gcTime: 0,
  });

  return (
    <main>
      <section className="flex min-h-64 w-full min-w-0 items-center justify-center bg-hero sm:min-h-80">
        <div className="w-full min-w-0 max-w-6xl px-4">
          <h1>Find your next stay</h1>
          <VenueSearchForm />
        </div>
      </section>

      <DestinationShortcuts />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6">Need some inspiration?</h2>

        {isLoading ? (
          <p className="text-muted-foreground">Loading inspiration...</p>
        ) : isError ? (
          <p role="alert" className="text-error">
            Unable to load inspiration.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {randomVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
