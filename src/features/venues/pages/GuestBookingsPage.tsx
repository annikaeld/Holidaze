import { Link, Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, parseISO, startOfDay } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth";
import { getManagedVenues } from "../services/venuesApi";
import { OverviewCard } from "../components/OverviewCard";
import { PageMessage } from "@/shared/components/PageMessage";
import { Pagination } from "@/features/venues/components/Pagination";
import { usePagination } from "@/shared/hooks/usePagination";

export function GuestBookingsPage() {
  const { user } = useAuth();

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
    .filter((booking) => isAfter(parseISO(booking.dateTo), today))
    .sort(
      (a, b) => parseISO(a.dateFrom).getTime() - parseISO(b.dateFrom).getTime(),
    );

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

      {bookings.length === 0 ? (
        <div className="mt-8 text-center">
          <h2>No upcoming guest bookings</h2>
          <p className="mt-3 text-muted-foreground">
            Bookings for your venues will appear here.
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
                  state={{ from: "guest-bookings" }}
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

              <div className="flex items-center gap-2">
                {booking.customer?.avatar?.url && (
                  <img
                    src={booking.customer.avatar.url}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                    loading="lazy"
                  />
                )}

                <p className="text-sm text-muted-foreground">
                  Booked by: {booking.customer?.name ?? "Unknown customer"}
                </p>
              </div>
            </OverviewCard>
          ))}
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={goToPage}
          />
        </div>
      )}
    </main>
  );
}
