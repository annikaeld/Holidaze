import { useQuery } from "@tanstack/react-query";
import { getVenues, searchVenues } from "@/features/venues/services/venuesApi";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { useSearchParams } from "react-router";

export function VenuesPage() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination") ?? "";
  const guests = Number(searchParams.get("guests") ?? 1);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["venues", destination],
    queryFn: () => (destination ? searchVenues(destination) : getVenues()),
  });

  if (isLoading) {
    return (
      <section className="min-h-screen p-8">
        <p>Loading venues...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen p-8">
        <p role="alert">{error.message}</p>
      </section>
    );
  }

  if (!response) {
    return (
      <section className="min-h-screen p-8">
        <p>No venues found</p>
      </section>
    );
  }

  if (response.data.length === 0) {
    return (
      <section className="min-h-screen p-8">
        <p>No venues found for "{destination}"</p>
      </section>
    );
  }

  const venues = response.data.filter((venue) => venue.maxGuests >= guests);
  const pagination = response.meta;

  if (venues.length === 0) {
    return (
      <section className="min-h-screen p-8">
        <p>No venues found for {guests} guests.</p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1>Venues</h1>
      <p>
        Page {pagination.currentPage} of {pagination.pageCount} ({venues.length}{" "}
        venues shown)
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
