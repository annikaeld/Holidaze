import { useParams } from "react-router";
import { getVenue } from "@/features/venues/services/venuesApi";
import { useQuery } from "@tanstack/react-query";
import { VenueGallery } from "@/features/venues/components/VenueGallery";
import { formatVenueDescription } from "@/features/venues/utils/formatVenueDescription";
import { Wifi, CarFront, Coffee, PawPrint } from "lucide-react";

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

  return (
    <main className="mx-auto w-full max-w-3xl">
      <h1 className="mb-6">{venue.name}</h1>
      <VenueGallery media={venue.media} name={venue.name} />
      <section className="mx-auto mt-6 w-full max-w-3xl">
        <h2>About this place</h2>
        <p className="whitespace-pre-line">
          {formatVenueDescription(venue.description)}
        </p>
      </section>
      {(venue.meta.wifi ||
        venue.meta.parking ||
        venue.meta.breakfast ||
        venue.meta.pets) && (
        <section className="mx-auto mt-8 w-full max-w-3xl">
          <h2 className="mb-4">What this place offers</h2>

          <ul className="grid grid-cols-2 gap-4">
            {venue.meta.wifi && (
              <li className="flex items-center gap-3">
                <Wifi aria-hidden="true" />
                <span>Wi-Fi</span>
              </li>
            )}

            {venue.meta.parking && (
              <li className="flex items-center gap-3">
                <CarFront aria-hidden="true" />
                <span>Parking</span>
              </li>
            )}

            {venue.meta.breakfast && (
              <li className="flex items-center gap-3">
                <Coffee aria-hidden="true" />
                <span>Breakfast</span>
              </li>
            )}

            {venue.meta.pets && (
              <li className="flex items-center gap-3">
                <PawPrint aria-hidden="true" />
                <span>Pets allowed</span>
              </li>
            )}
          </ul>
        </section>
      )}
    </main>
  );
}
