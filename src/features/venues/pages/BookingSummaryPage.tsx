import { useSearchParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getVenue } from "@/features/venues/services/venuesApi";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { VenueImage } from "@/features/venues/components/VenueImage";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { GuestSelector } from "@/features/venues/components/GuestSelector";
import {
  createBooking,
  type CreateBookingData,
} from "@/features/venues/services/bookingsApi";
import { useAuth } from "@/features/auth/context/useAuth";
import { toast } from "sonner";
import { hasBookingOverlap } from "@/features/venues/utils/hasBookingOverlap";

export function BookingSummaryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const venueId = searchParams.get("venueId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 1);

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (!checkIn || !checkOut) return undefined;

    return {
      from: parseISO(checkIn),
      to: parseISO(checkOut),
    };
  });
  const {
    data: venue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["venue", venueId],
    queryFn: () => getVenue(venueId!),
    enabled: Boolean(venueId),
  });

  const bookingMutation = useMutation({
    mutationFn: (data: CreateBookingData) => {
      if (!user) {
        throw new Error("You must be logged in to book.");
      }

      return createBooking(data, user.accessToken);
    },
    onSuccess: (response) => {
      navigate("/booking/success", {
        replace: true,
        state: {
          booking: {
            ...response.data,
            venue,
          },
        },
      });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  if (!venueId) {
    return <p>Missing venue information.</p>;
  }

  if (isLoading) {
    return <p>Loading booking summary...</p>;
  }

  if (isError || !venue) {
    return <p>Unable to load venue information.</p>;
  }
  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from)
      : 0;

  const totalPrice = nights > 0 ? venue.price * nights : 0;

  function handleConfirmBooking() {
    if (
      !venueId ||
      !venue ||
      !dateRange?.from ||
      !dateRange?.to ||
      nights <= 0 ||
      guests < 1 ||
      guests > venue.maxGuests ||
      bookingMutation.isPending ||
      bookingMutation.isSuccess
    ) {
      return;
    }

    if (hasBookingOverlap(dateRange.from, dateRange.to, venue.bookings ?? [])) {
      toast.error("These dates are no longer available.");
      return;
    }

    bookingMutation.mutate({
      venueId,
      dateFrom: dateRange.from.toISOString(),
      dateTo: dateRange.to.toISOString(),
      guests,
    });
  }
  return (
    <section className="w-full min-w-0 bg-background py-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl px-4">
        <h1>Your Booking Summary</h1>
        <div className="mt-6 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-28 shrink-0 overflow-hidden rounded-lg">
              <VenueImage media={venue.media} name={venue.name} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold">{venue.name}</h2>
            </div>
          </div>

          <div className="border-t border-border pt-4 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Dates</h3>
                <p className="mt-1 text-sm">
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, "dd MMM yyyy")} – ${format(dateRange.to, "dd MMM yyyy")}`
                    : "Select dates"}
                </p>
              </div>
              {!isCalendarOpen && (
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className="btn-secondary"
                >
                  Edit
                </button>
              )}
            </div>
            {isCalendarOpen && (
              <div className="mt-4 mb-6 flex justify-end">
                <DateRangeCalendar
                  selected={dateRange}
                  onSelect={setDateRange}
                  bookings={venue.bookings ?? []}
                  onClear={() => setDateRange(undefined)}
                  onConfirm={() => {
                    if (!dateRange?.from || !dateRange?.to) return;

                    const params = new URLSearchParams(searchParams);
                    params.set("checkIn", format(dateRange.from, "yyyy-MM-dd"));
                    params.set("checkOut", format(dateRange.to, "yyyy-MM-dd"));

                    setSearchParams(params, { replace: true });
                    setIsCalendarOpen(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border py-4">
            <div>
              <h3 className="text-sm font-semibold">Guests</h3>
              <p className="mt-1 text-sm">
                {guests} {guests === 1 ? "guest" : "guests"}
              </p>
            </div>

            {!isGuestsOpen && (
              <button
                type="button"
                onClick={() => setIsGuestsOpen(true)}
                className="btn-secondary"
              >
                Edit
              </button>
            )}
            {isGuestsOpen && (
              <div className="flex items-center justify-end">
                <GuestSelector
                  guests={guests}
                  maxGuests={venue.maxGuests}
                  onChange={setGuests}
                  onConfirm={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("guests", String(guests));
                    setSearchParams(params, { replace: true });
                    setIsGuestsOpen(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-semibold">Price details</h3>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span>
                {nights} {nights === 1 ? "night" : "nights"} × NOK{" "}
                {venue.price.toLocaleString("en-GB")}
              </span>

              <span>NOK {totalPrice.toLocaleString("en-GB")}</span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-semibold">
              <span>Total NOK</span>
              <span>{totalPrice.toLocaleString("en-GB")}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="btn-primary w-full sm:w-auto"
            disabled={
              bookingMutation.isPending ||
              bookingMutation.isSuccess ||
              isCalendarOpen ||
              isGuestsOpen ||
              nights <= 0 ||
              guests < 1 ||
              guests > venue.maxGuests
            }
          >
            {bookingMutation.isPending ? "Confirming..." : "Confirm booking"}
          </button>
        </div>
      </div>
    </section>
  );
}
