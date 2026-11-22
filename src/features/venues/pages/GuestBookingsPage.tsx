import { Link, Navigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth";
import { getManagedVenues } from "../services/venuesApi";
import { OverviewCard } from "../components/OverviewCard";
import { PageMessage } from "@/shared/components/PageMessage";
import { Pagination } from "@/features/venues/components/Pagination";
import { usePagination } from "@/shared/hooks/usePagination";
import { useRef, useState, useEffect } from "react";
import { AvatarImage } from "@/features/auth/components/AvatarImage";
import type { VenueBooking } from "../types/venue";

export function GuestBookingsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const showPastBookings = searchParams.get("period") === "past";

  function changeBookingPeriod(past: boolean) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (past) {
          next.set("period", "past");
        } else {
          next.delete("period");
        }
        return next;
      },
      { replace: true },
    );

    goToPage(1);
  }
  const [selectedGuest, setSelectedGuest] =
    useState<VenueBooking["customer"]>(undefined);
  const guestDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = guestDialogRef.current;

    if (selectedGuest && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [selectedGuest]);

  const {
    data: venues = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["managed-venues", user?.name],
    queryFn: () => getManagedVenues(user!.name, user!.accessToken),
    enabled: Boolean(user?.venueManager),
    retry: false,
  });

  const today = startOfDay(new Date());

  const bookings = venues
    .flatMap((venue) =>
      (venue.bookings ?? []).map((booking) => ({
        ...booking,
        venue,
      })),
    )
    .filter((booking) => {
      const isCurrentOrUpcoming = isAfter(parseISO(booking.dateTo), today);
      return showPastBookings ? !isCurrentOrUpcoming : isCurrentOrUpcoming;
    })
    .sort((a, b) => {
      if (showPastBookings) {
        return parseISO(b.dateTo).getTime() - parseISO(a.dateTo).getTime();
      }

      return parseISO(a.dateFrom).getTime() - parseISO(b.dateFrom).getTime();
    });

  const {
    visibleItems: visibleBookings,
    currentPage,
    pageCount,
    goToPage,
  } = usePagination(bookings);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/list-venue" replace />;
  }

  if (isLoading) {
    return <PageMessage>Loading guest bookings...</PageMessage>;
  }

  if (isError) {
    return (
      <PageMessage isError>
        Unable to load guest bookings. Please try again.
      </PageMessage>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/my-venues"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My venues
      </Link>

      <h1>Guest bookings</h1>
      <div
        role="group"
        aria-label="Booking period"
        className="mt-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={!showPastBookings}
          onClick={() => changeBookingPeriod(false)}
          className="min-h-11 cursor-pointer rounded-full border border-border px-4 py-2 text-sm aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Current &amp; upcoming
        </button>

        <button
          type="button"
          aria-pressed={showPastBookings}
          onClick={() => changeBookingPeriod(true)}
          className="min-h-11 cursor-pointer rounded-full border border-border px-4 py-2 text-sm aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Past bookings
        </button>
      </div>
      {bookings.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">
            {showPastBookings
              ? "No past guest bookings"
              : "No current or upcoming guest bookings"}
          </h2>

          <p className="mt-2 text-muted-foreground">
            {showPastBookings
              ? "Completed stays at your venues will appear here."
              : "Current and upcoming stays at your venues will appear here."}
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {visibleBookings.map((booking) => (
            <OverviewCard
              key={booking.id}
              title={booking.venue.name}
              image={booking.venue.media?.[0]}
              actions={
                <Link
                  to={`/venues/${booking.venue.id}`}
                  state={{
                    from: "guest-bookings",
                    period: showPastBookings ? "past" : "current",
                  }}
                  className="text-sm font-semibold text-heading underline-offset-4 hover:underline"
                >
                  View venue
                </Link>
              }
            >
              <p className="text-base font-semibold">
                {format(parseISO(booking.dateFrom), "dd MMM yyyy")}
                {" – "}
                {format(parseISO(booking.dateTo), "dd MMM yyyy")}
              </p>

              <p className="text-sm">
                {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
              </p>

              {booking.customer ? (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSelectedGuest(booking.customer)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md text-left text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {booking.customer.avatar?.url && (
                    <img
                      src={booking.customer.avatar.url}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <span>
                    Booked by:{" "}
                    <span className="underline underline-offset-4">
                      {booking.customer.name}
                    </span>
                  </span>
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Booked by: Unknown customer
                </p>
              )}
            </OverviewCard>
          ))}
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={goToPage}
          />
        </div>
      )}
      <dialog
        ref={guestDialogRef}
        aria-labelledby="guest-profile-title"
        onClose={() => setSelectedGuest(undefined)}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-card-border bg-card p-6 text-card-foreground shadow-xl backdrop:bg-black/50"
      >
        {selectedGuest && (
          <div className="flex flex-col items-center gap-4 text-center">
            <AvatarImage
              url={selectedGuest.avatar?.url}
              alt={selectedGuest.avatar?.alt || "Guest avatar"}
              size="lg"
            />
            <h2 id="guest-profile-title">{selectedGuest.name}</h2>
            <p className="w-full whitespace-pre-line wrap-break-word text-sm text-muted-foreground">
              {selectedGuest.bio?.trim() || "No bio added yet"}
            </p>
          </div>
        )}

        <button
          type="button"
          autoFocus
          onClick={() => guestDialogRef.current?.close()}
          className="btn-primary mt-6"
        >
          Close
        </button>
      </dialog>
    </main>
  );
}
