import {
  getVenue,
  VenueRequestError,
} from "@/features/venues/services/venuesApi";
import { useQuery } from "@tanstack/react-query";
import { VenueGallery } from "@/features/venues/components/VenueGallery";
import { VenueDescription } from "@/features/venues/components/VenueDescription";
import { Wifi, CarFront, Coffee, PawPrint, Users } from "lucide-react";
import { VenueMap } from "@/features/venues/components/VenueMap";
import { BookingCard } from "@/features/venues/components/BookingCard";
import { useParams, useSearchParams, Link, useLocation } from "react-router";
import { VenueRating } from "@/features/venues/components/VenueRating";
import { UserRound, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { PageMessage } from "@/shared/components/PageMessage";
import { parseISO } from "date-fns";
import type { DateRange } from "react-day-picker";

export function VenueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [avatarError, setAvatarError] = useState(false);
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() =>
    checkIn && checkOut
      ? { from: parseISO(checkIn), to: parseISO(checkOut) }
      : undefined,
  );

  const [selectedGuests, setGuests] = useState(
    () => Number(searchParams.get("guests")) || 1,
  );
  const { state } = useLocation();
  const backLink =
    state?.from === "my-venues"
      ? { to: "/my-venues", label: "Back to my venues" }
      : state?.from === "my-bookings"
        ? { to: "/my-bookings", label: "Back to my bookings" }
        : state?.from === "guest-bookings"
          ? {
              to:
                state.period === "past"
                  ? "/my-venues/bookings?period=past"
                  : "/my-venues/bookings",
              label: "Back to guest bookings",
            }
          : state?.from === "home"
            ? { to: "/", label: "Back to home" }
            : {
                to: { pathname: "/venues", search: searchParams.toString() },
                label: "Back to venues",
                state: { returnFocusTo: id },
              };

  const {
    data: venue,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenue(id!),
    enabled: Boolean(id),
    retry: (failureCount, error) => {
      if (
        error instanceof VenueRequestError &&
        (error.status === 400 || error.status === 404)
      ) {
        return false;
      }

      return failureCount < 3;
    },
  });

  const venueName = venue?.name;

  useEffect(() => {
    document.title = `${venueName ?? "Venue details"} | Holidaze`;
  }, [venueName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  if (isLoading) {
    return <PageMessage>Loading venue...</PageMessage>;
  }

  if (error) {
    return <PageMessage isError>{error.message}</PageMessage>;
  }

  if (!venue) {
    return <PageMessage isError>Venue not found.</PageMessage>;
  }

  const guests = Math.min(Math.max(1, selectedGuests), venue.maxGuests);

  return (
    <main className="mx-auto w-full max-w-6xl px-4">
      <Link
        to={backLink.to}
        state={backLink.state}
        className="mt-4 inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {backLink.label}
      </Link>
      <h1 className="mb-2">{venue.name}</h1>
      <VenueGallery media={venue.media} name={venue.name} />
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        {venue.rating > 0 && <VenueRating rating={venue.rating} />}
        <span className="flex items-center gap-1">
          <Users aria-hidden="true" className="h-4 w-4" />
          Up to {venue.maxGuests} guests
        </span>
      </div>
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
                {venue.owner.avatar?.url && !avatarError ? (
                  <img
                    src={venue.owner.avatar.url}
                    alt={venue.owner.avatar.alt || ""}
                    className="h-14 w-14 rounded-full object-cover"
                    loading="lazy"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-placeholder">
                    <UserRound className="h-7 w-7 text-placeholder-foreground" />
                  </div>
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
                .join(", ") ||
                venue.location.continent ||
                "Location not available"}
            </p>

            {venue.location.lat != null && venue.location.lng != null && (
              <div className="relative z-0">
                <VenueMap lat={venue.location.lat} lng={venue.location.lng} />
              </div>
            )}
          </section>
        </div>
        <div className="hidden self-start lg:sticky lg:top-6 lg:block">
          <BookingCard
            price={venue.price}
            dateRange={dateRange}
            setDateRange={setDateRange}
            guests={guests}
            setGuests={setGuests}
            bookings={venue.bookings ?? []}
            venueId={venue.id}
            maxGuests={venue.maxGuests}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-card px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:border-t dark:border-card-border dark:shadow-none lg:hidden">
        <BookingCard
          price={venue.price}
          dateRange={dateRange}
          setDateRange={setDateRange}
          guests={guests}
          setGuests={setGuests}
          bookings={venue.bookings ?? []}
          venueId={venue.id}
          maxGuests={venue.maxGuests}
          variant="mobile"
        />
      </div>

      <div className="h-24 lg:hidden" aria-hidden="true" />
    </main>
  );
}
