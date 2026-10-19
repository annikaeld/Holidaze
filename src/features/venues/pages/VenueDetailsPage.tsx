import { useParams } from "react-router";
import { getVenue } from "@/features/venues/services/venuesApi";
import { useQuery } from "@tanstack/react-query";
import { VenueGallery } from "@/features/venues/components/VenueGallery";

export function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: venue,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenue(id!),
    enabled: Boolean(id),
  });
  if (isLoading) {
    return <p>Loading venue...</p>;
  }
  if (error) {
    return <p role="alert">{error.message}</p>;
  }
  if (!venue) {
    return <p role="alert">Venue not found.</p>;
  }
  console.log(venue.name, "Antall bilder:", venue.media.length);
  return (
    <main>
      <h1>{venue.name}</h1>
      <div className="mx-auto w-full max-w-3xl">
        <VenueGallery media={venue.media} name={venue.name} />
      </div>
    </main>
  );
}
