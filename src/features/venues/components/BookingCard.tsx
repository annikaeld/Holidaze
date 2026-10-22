import type { VenueBooking } from "../types/venue";
import { addDays, parseISO, differenceInCalendarDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";

interface BookingCardProps {
  price: number;
  checkIn?: string;
  checkOut?: string;
  bookings: VenueBooking[];
  variant?: "desktop" | "mobile";
}

export function BookingCard({
  price,
  checkIn,
  checkOut,
  bookings,
  variant = "desktop",
}: BookingCardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (!checkIn || !checkOut) return undefined;

    return {
      from: parseISO(checkIn),
      to: parseISO(checkOut),
    };
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isCalendarOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
        dateButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCalendarOpen]);
  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from)
      : 0;
  const totalPrice =
    Number.isFinite(nights) && nights > 0 ? price * nights : null;
  const bookedDates = bookings.map((booking) => ({
    from: parseISO(booking.dateFrom),
    to: addDays(parseISO(booking.dateTo), -1),
  }));
  if (variant === "mobile") {
    return (
      <aside className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold whitespace-nowrap">
            NOK {(totalPrice ?? price).toLocaleString("en-GB")}
          </p>

          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            aria-expanded={isCalendarOpen}
            aria-controls="mobile-booking-calendar"
            className="cursor-pointer text-sm text-muted-foreground underline underline-offset-2"
          >
            {dateRange?.from && dateRange?.to
              ? `${dateRange.from.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })} – ${dateRange.to.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}`
              : "Add dates"}
          </button>
        </div>
        {isCalendarOpen && (
          <div className="absolute bottom-full right-0 z-50 mb-2 rounded-xl border border-border bg-card p-2 shadow-lg">
            <DateRangeCalendar
              id="mobile-booking-calendar"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={[{ before: new Date() }, ...bookedDates]}
              onClear={() => setDateRange(undefined)}
              onConfirm={() => {
                setIsCalendarOpen(false);
                dateButtonRef.current?.focus();
              }}
            />
          </div>
        )}
        <button type="button" className="btn-primary self-center">
          Reserve
        </button>
      </aside>
    );
  }
  return (
    <aside className="booking-card relative">
      <p>
        <strong>
          NOK{" "}
          {totalPrice !== null
            ? totalPrice.toLocaleString("en-GB")
            : price.toLocaleString("en-GB")}
        </strong>
        {totalPrice !== null
          ? ` for ${nights} ${nights === 1 ? "night" : "nights"}`
          : " / night"}
      </p>
      <button
        type="button"
        ref={dateButtonRef}
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        aria-expanded={isCalendarOpen}
        aria-controls="booking-calendar"
        className="mt-4 flex w-full flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="text-xs font-semibold text-muted-foreground">
          When?
        </span>
        <span>
          {dateRange?.from && dateRange?.to
            ? `${dateRange.from.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })} – ${dateRange.to.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}`
            : "Add dates"}
        </span>
      </button>
      {isCalendarOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 rounded-xl border border-border bg-card p-2 shadow-lg">
          <DateRangeCalendar
            id="booking-calendar"
            selected={dateRange}
            onSelect={setDateRange}
            disabled={[{ before: new Date() }, ...bookedDates]}
            onClear={() => setDateRange(undefined)}
            onConfirm={() => setIsCalendarOpen(false)}
          />
        </div>
      )}
      <button type="button" className="btn-primary mt-4 w-full">
        Reserve
      </button>
    </aside>
  );
}
