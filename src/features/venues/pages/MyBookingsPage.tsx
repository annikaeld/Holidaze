import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router";
import { isAfter, parseISO, startOfDay, format } from "date-fns";
import { useAuth } from "@/features/auth/context/useAuth";
import { House } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getCustomerBookings,
  deleteBooking,
  type CustomerBooking,
} from "@/features/venues/services/bookingsApi";

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

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (bookingToCancel && !dialog.open) {
      dialog.showModal();
    } else if (!bookingToCancel && dialog.open) {
      dialog.close();
    }
  }, [bookingToCancel]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <h1>My bookings</h1>
        <p className="mt-8 text-muted-foreground">Loading your bookings...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <h1>My bookings</h1>
        <p role="alert" className="mt-8 text-error">
          Unable to load your bookings. Please try again.
        </p>
      </main>
    );
  }

  const today = startOfDay(new Date());

  const upcomingBookings = bookings
    .filter((booking) => isAfter(parseISO(booking.dateTo), today))
    .sort(
      (a, b) => parseISO(a.dateFrom).getTime() - parseISO(b.dateFrom).getTime(),
    );

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
          {upcomingBookings.map((booking) => (
            <article
              key={booking.id}
              className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-card sm:flex-row"
            >
              {booking.venue.media?.[0] && (
                <img
                  src={booking.venue.media[0].url}
                  alt={booking.venue.media[0].alt || booking.venue.name}
                  className="aspect-video w-full object-cover sm:aspect-square sm:w-44 sm:shrink-0"
                  loading="lazy"
                />
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5">
                <div>
                  <h2 className="text-xl font-semibold">
                    {booking.venue.name}
                  </h2>

                  <p className="mt-3 text-sm">
                    {format(parseISO(booking.dateFrom), "dd MMM yyyy")}
                    {" – "}
                    {format(parseISO(booking.dateTo), "dd MMM yyyy")}
                  </p>

                  <p className="mt-2 text-sm">
                    {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Link
                    to={`/venues/${booking.venue.id}`}
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
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby="cancel-booking-title"
        aria-describedby="cancel-booking-description"
        onCancel={(event) => {
          if (cancelMutation.isPending) {
            event.preventDefault();
            return;
          }

          setBookingToCancel(null);
        }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-card-border bg-card p-6 text-card-foreground shadow-xl backdrop:bg-black/50"
      >
        {bookingToCancel && (
          <>
            <h2 id="cancel-booking-title" className="text-xl font-semibold">
              Cancel booking?
            </h2>

            <p id="cancel-booking-description" className="mt-4 text-sm">
              Are you sure you want to cancel your booking at{" "}
              <strong>{bookingToCancel.venue.name}</strong>?
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {format(parseISO(bookingToCancel.dateFrom), "dd MMM yyyy")}
              {" – "}
              {format(parseISO(bookingToCancel.dateTo), "dd MMM yyyy")}
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end ">
              <button
                type="button"
                autoFocus
                disabled={cancelMutation.isPending}
                onClick={() => setBookingToCancel(null)}
                className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-field-active disabled:cursor-not-allowed w-full sm:w-auto"
              >
                Keep booking
              </button>

              <button
                type="button"
                disabled={cancelMutation.isPending}
                onClick={() => {
                  if (bookingToCancel) {
                    cancelMutation.mutate(bookingToCancel.id);
                  }
                }}
                className="cursor-pointer rounded-full border border-toast-error-border bg-toast-error px-4 py-2 text-sm font-medium text-toast-error-foreground hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </>
        )}
      </dialog>
    </main>
  );
}
