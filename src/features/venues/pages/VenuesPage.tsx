import { useQuery } from "@tanstack/react-query";
import { getVenues } from "@/features/venues/services/venuesApi";

export function VenuesPage() {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
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

  const venues = response.data;
  const pagination = response.meta;

  return (
    <div>
      <h1>Venues</h1>
      <p>
        Page {pagination.currentPage} of {pagination.pageCount} (
        {pagination.totalCount} venues)
      </p>
      {venues.map((venue) => (
        <p key={venue.id}>{venue.name}</p>
      ))}
    </div>
  );
}
