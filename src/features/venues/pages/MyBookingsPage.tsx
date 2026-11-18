import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router";
import {
  isAfter,
  parseISO,
  startOfDay,
  format,
  differenceInCalendarDays,
} from "date-fns";
import { useAuth } from "@/features/auth/context/useAuth";
import { House } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getCustomerBookings,
  deleteBooking,
  type CustomerBooking,
} from "@/features/venues/services/bookingsApi";
import { OverviewCard } from "../components/OverviewCard";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageMessage } from "@/shared/components/PageMessage";
import { Pagination } from "@/features/venues/components/Pagination";
import { usePagination } from "@/shared/hooks/usePagination";

export function MyBookingsPage() {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [bookingToCancel, setBookingToCancel] =
    useState<CustomerBooking | null>(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customer-bookings", user?.name],
    queryFn: () => getCustomerBookings(user!.name, user!.accessToken),
    enabled: Boolean(user),
    retry: false,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return deleteBooking(bookingId, user.accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["customer-bookings", user?.name],
      });

      setBookingToCancel(null);
      toast.success("Your booking has been cancelled.");
    },
    onError: (error) => {
      toast.error(error.message || "Unable to cancel booking.");
    },
  });

  const today = startOfDay(new Date());

  const upcomingBookings = bookings
    .filter((booking) => isAfter(parseISO(booking.dateTo), today))
    .sort(
      (a, b) => parseISO(a.dateFrom).getTime() - parseISO(b.dateFrom).getTime(),
    );

  const {
    visibleItems: visibleBookings,
    currentPage,
    pageCount,
    goToPage,
  } = usePagination(upcomingBookings);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <PageMessage>Loading your bookings...</PageMessage>;
  }

  if (isError) {
    return (
      <PageMessage isError>
        Unable to load your bookings. Please try again.
      </PageMessage>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <h1>My bookings</h1>

      {upcomingBookings.length === 0 ? (
        <div className="mt-8 flex min-h-80 flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-hero">
            <House
              size={36}
              strokeWidth={1.5}
              className="text-heading"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-xl font-semibold">No upcoming bookings!</h2>

          <p className="mt-2 text-muted-foreground">
            Your future stays will appear here.
          </p>

          <Link
            to="/venues"
            className="mt-6 text-sm font-semibold text-heading underline underline-offset-4 hover:text-primary"
          >
            Explore venues
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {visibleBookings.map((booking) => {
            const nights = differenceInCalendarDays(
              parseISO(booking.dateTo),
              parseISO(booking.dateFrom),
            );

            return (
              <OverviewCard
                key={booking.id}
                title={booking.venue.name}
                image={booking.venue.media?.[0]}
                actions={
                  <>
                    <Link
                      to={`/venues/${booking.venue.id}`}
                      state={{ from: "my-bookings" }}
                      className="text-sm font-semibold text-heading underline-offset-4 hover:underline"
                    >
                      View venue
                    </Link>

                    <button
                      type="button"
                      onClick={() => setBookingToCancel(booking)}
                      className="cursor-pointer text-sm text-error underline-offset-4 hover:underline"
                    >
                      Cancel booking
                    </button>
                  </>
                }
              >
                <p className="text-sm">
                  {format(parseISO(booking.dateFrom), "dd MMM yyyy")}
                  {" – "}
                  {format(parseISO(booking.dateTo), "dd MMM yyyy")}
                </p>

                <p className="text-sm">
                  {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                  {" · "}
                  {nights} {nights === 1 ? "night" : "nights"}
                </p>
              </OverviewCard>
            );
          })}
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={goToPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(bookingToCancel)}
        title="Cancel booking?"
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        isPending={cancelMutation.isPending}
        onConfirm={() => {
          if (bookingToCancel) {
            cancelMutation.mutate(bookingToCancel.id);
          }
        }}
        onClose={() => setBookingToCancel(null)}
      >
        {bookingToCancel && (
          <>
            <p>
              Are you sure you want to cancel your booking at{" "}
              <strong>{bookingToCancel.venue.name}</strong>?
            </p>

            <p className="text-muted-foreground">
              {format(parseISO(bookingToCancel.dateFrom), "dd MMM yyyy")}
              {" – "}
              {format(parseISO(bookingToCancel.dateTo), "dd MMM yyyy")}
            </p>

            <p className="text-muted-foreground">
              This action cannot be undone.
            </p>
          </>
        )}
      </ConfirmDialog>
    </main>
  );
}
