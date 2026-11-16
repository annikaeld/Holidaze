import { useQuery } from "@tanstack/react-query";
import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { getAllVenues } from "@/features/venues/services/venuesApi";
import { DestinationShortcuts } from "@/features/venues/components/DestinationShortcuts";
import { VenueCardSkeleton } from "@/features/venues/components/VenueCardSkeleton";

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
      <section className="relative z-10 mx-auto flex min-h-480px w-full max-w-1440px min-w-0 items-center justify-center sm:min-h-96">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/images/etienne-dayer-vwH7zX3CeiA-unsplash.jpg"
            alt="baloons in the sky"
            className="absolute inset-0 h-full w-full object-cover object-[center_45%] md:object-[center_52%] lg:object-[center_100%]"
          />

          <div className="absolute inset-0 bg-surface opacity-70" />
        </div>
        <div className="relative z-10 w-full min-w-0 max-w-6xl px-4 py-12 sm:py-10">
          <h1>Find your next stay</h1>
          <VenueSearchForm />
        </div>
      </section>

      <DestinationShortcuts />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6">Need some inspiration?</h2>

        {isLoading ? (
          <>
            <p role="status" className="sr-only">
              Loading inspiration...
            </p>

            <div
              aria-hidden="true"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <VenueCardSkeleton key={index} />
              ))}
            </div>
          </>
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
