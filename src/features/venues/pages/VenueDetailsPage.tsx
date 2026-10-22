import { getVenue } from "@/features/venues/services/venuesApi";
import { useQuery } from "@tanstack/react-query";
import { VenueGallery } from "@/features/venues/components/VenueGallery";
import { VenueDescription } from "@/features/venues/components/VenueDescription";
import { Wifi, CarFront, Coffee, PawPrint } from "lucide-react";
import { VenueMap } from "@/features/venues/components/VenueMap";
import { BookingCard } from "@/features/venues/components/BookingCard";
import { useParams, useSearchParams } from "react-router";

export function VenueDetailsPage() {
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
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
    <main className="mx-auto w-full max-w-6xl px-4">
      <h1 className="mb-6">{venue.name}</h1>
      <VenueGallery media={venue.media} name={venue.name} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <section>
            <h2>About this place</h2>
            <VenueDescription description={venue.description} />
          </section>
          {(venue.meta.wifi ||
            venue.meta.parking ||
            venue.meta.breakfast ||
            venue.meta.pets) && (
            <section className="mt-8">
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
          {venue.owner && (
            <section className="mt-8">
              <h2 className="mb-4">Hosted by</h2>

              <div className="flex items-center gap-4">
                {venue.owner.avatar?.url && (
                  <img
                    src={venue.owner.avatar.url}
                    alt={venue.owner.avatar.alt || ""}
                    className="h-14 w-14 rounded-full object-cover"
                    loading="lazy"
                  />
                )}

                <p>{venue.owner.name}</p>
              </div>
            </section>
          )}
          <section className="mt-8">
            <h2 className="mb-4">Where you'll be staying</h2>

            <p className="mb-4">
              {[venue.location.city, venue.location.country]
                .filter(Boolean)
                .join(", ") || "Location not available"}
            </p>

            {venue.location.lat != null && venue.location.lng != null && (
              <VenueMap lat={venue.location.lat} lng={venue.location.lng} />
            )}
          </section>
        </div>

        <div className="hidden self-start lg:sticky lg:top-6 lg:block">
          <BookingCard
            price={venue.price}
            checkIn={checkIn}
            checkOut={checkOut}
            bookings={venue.bookings ?? []}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-4 shadow-lg lg:hidden">
        <BookingCard
          price={venue.price}
          checkIn={checkIn}
          checkOut={checkOut}
          bookings={venue.bookings ?? []}
          variant="mobile"
        />
      </div>

      <div className="h-24 lg:hidden" aria-hidden="true" />
    </main>
  );
}
