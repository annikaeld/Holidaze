import { Link, useLocation, Navigate } from "react-router";
import { CheckCircle2, ArrowLeft, CalendarDays, Users } from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";

interface BookingConfirmation {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue: {
    name: string;
    price: number;
    media?: { url: string; alt?: string }[];
  };
}

export function BookingSuccessPage() {
  const location = useLocation();
  const booking = (location.state as { booking?: BookingConfirmation } | null)
    ?.booking;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const nights = differenceInCalendarDays(
    parseISO(booking.dateTo),
    parseISO(booking.dateFrom),
  );

  const total = nights * booking.venue.price;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-10">
        <CheckCircle2
          size={36}
          className="mb-4 text-toast-success-foreground"
          aria-hidden="true"
        />

        <h1>Booking Successful</h1>

        <p className="mt-4">Thank you! Your booking has been confirmed.</p>
        <p className="mt-2">
          You can view your upcoming bookings under{" "}
          <Link
            to="/my-bookings"
            className="font-semibold text-heading underline underline-offset-4 hover:opacity-80"
          >
            My bookings
          </Link>
          .
        </p>
      </div>

      <section
        aria-label="Booking details"
        className="rounded-xl border border-card-border bg-card p-5 sm:p-6"
      >
        <div className="flex items-start gap-4">
          {booking.venue.media?.[0] && (
            <img
              src={booking.venue.media[0].url}
              alt={booking.venue.media[0].alt || booking.venue.name}
              className="h-24 w-24 rounded-lg object-cover"
            />
          )}

          <h2 className="text-lg">{booking.venue.name}</h2>
        </div>

        <div className="mt-6 space-y-4 border-t border-card-border pt-5">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              {format(parseISO(booking.dateFrom), "d MMM yyyy")} –{" "}
              {format(parseISO(booking.dateTo), "d MMM yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Users size={18} aria-hidden="true" />
            <span>
              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
              {" · "}
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>

          <div className="flex justify-between border-t border-card-border pt-4 font-semibold">
            <span>Total</span>
            <span>NOK {total.toLocaleString("en-US")}</span>
          </div>
        </div>
      </section>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-heading underline-offset-4 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>
    </main>
  );
}
