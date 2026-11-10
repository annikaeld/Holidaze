import type { VenueBooking } from "../types/venue";
import { addDays, parseISO, differenceInCalendarDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { useNavigate, useSearchParams } from "react-router";
import { format } from "date-fns";
import { useAuth } from "@/features/auth/context/useAuth";

interface BookingCardProps {
  venueId: string;
  maxGuests: number;
  price: number;
  checkIn?: string;
  checkOut?: string;
  bookings: VenueBooking[];
  variant?: "desktop" | "mobile";
}

export function BookingCard({
  venueId,
  maxGuests,
  price,
  checkIn,
  checkOut,
  bookings,
  variant = "desktop",
}: BookingCardProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [guests, setGuests] = useState(() => {
    const requestedGuests = Number(searchParams.get("guests")) || 1;
    return Math.min(Math.max(1, requestedGuests), maxGuests);
  });

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (!checkIn || !checkOut) return undefined;

    return {
      from: parseISO(checkIn),
      to: parseISO(checkOut),
    };
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isCalendarOpen && !isGuestsOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
        dateButtonRef.current?.focus();
      }
    }
    function handleClickOutside(event: PointerEvent) {
      const target = event.target as Node;

      if (
        isCalendarOpen &&
        !calendarRef.current?.contains(target) &&
        !dateButtonRef.current?.contains(target)
      ) {
        setIsCalendarOpen(false);
      }

      if (isGuestsOpen && !guestsRef.current?.contains(target)) {
        setIsGuestsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isCalendarOpen, isGuestsOpen]);
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
  function handleReserve() {
    if (!dateRange?.from || !dateRange?.to || nights <= 0) {
      setIsCalendarOpen(true);
      setIsGuestsOpen(false);
      return;
    }

    const params = new URLSearchParams({
      venueId,
      checkIn: format(dateRange.from, "yyyy-MM-dd"),
      checkOut: format(dateRange.to, "yyyy-MM-dd"),
      guests: String(guests),
    });

    const destination = `/booking/summary?${params.toString()}`;

    if (user) {
      navigate(destination);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(destination)}`);
    }
  }
  if (variant === "mobile") {
    return (
      <aside className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold whitespace-nowrap">
            NOK {(totalPrice ?? price).toLocaleString("en-GB")}
          </p>

          <button
            type="button"
            ref={dateButtonRef}
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsGuestsOpen(false);
            }}
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
        <div ref={guestsRef} className="relative self-end">
          <button
            type="button"
            onClick={() => {
              setIsGuestsOpen(!isGuestsOpen);
              setIsCalendarOpen(false);
            }}
            aria-expanded={isGuestsOpen}
            aria-controls="mobile-booking-guests"
            className="cursor-pointer text-sm text-muted-foreground underline underline-offset-2"
          >
            {guests} {guests === 1 ? "guest" : "guests"}
          </button>

          {isGuestsOpen && (
            <div
              id="mobile-booking-guests"
              className="absolute bottom-full right-0 z-50 mb-2 min-w-52 rounded-xl border border-border bg-card p-4 shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setGuests((current) => Math.max(1, current - 1))
                  }
                  disabled={guests <= 1}
                  aria-label="Remove one guest"
                  className="btn-counter"
                >
                  −
                </button>

                <span aria-live="polite">{guests}</span>

                <button
                  type="button"
                  onClick={() =>
                    setGuests((current) => Math.min(maxGuests, current + 1))
                  }
                  disabled={guests >= maxGuests}
                  aria-label="Add one guest"
                  className="btn-counter"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => setIsGuestsOpen(false)}
                  aria-label="Confirm guests"
                  className="btn-confirm"
                >
                  ✓
                </button>
              </div>
            </div>
          )}
        </div>
        {isCalendarOpen && (
          <div
            ref={calendarRef}
            className="absolute bottom-full right-0 z-50 mb-2 rounded-xl border border-border bg-card p-2 shadow-lg"
          >
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
        <button
          type="button"
          onClick={handleReserve}
          className="btn-primary mt-4 w-full"
        >
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
        onClick={() => {
          setIsCalendarOpen(!isCalendarOpen);
          setIsGuestsOpen(false);
        }}
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
        <div
          ref={calendarRef}
          className="absolute top-full right-0 z-50 mt-2 rounded-xl border border-border bg-card p-2 shadow-lg"
        >
          <DateRangeCalendar
            id="booking-calendar"
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
      <div ref={guestsRef} className="relative mt-4">
        <button
          type="button"
          onClick={() => {
            setIsGuestsOpen(!isGuestsOpen);
            setIsCalendarOpen(false);
          }}
          aria-expanded={isGuestsOpen}
          aria-controls="booking-guests"
          className="flex w-full flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left cursor-pointer"
        >
          <span className="text-xs font-semibold text-muted-foreground">
            Guests
          </span>
          <span>
            {guests} {guests === 1 ? "guest" : "guests"}
          </span>
        </button>

        {isGuestsOpen && (
          <div
            id="booking-guests"
            className="absolute top-full right-0 z-50 mt-2 min-w-52 rounded-xl border border-border bg-card p-4 shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setGuests((current) => Math.max(1, current - 1))}
                disabled={guests <= 1}
                aria-label="Remove one guest"
                className="btn-counter"
              >
                −
              </button>

              <span aria-live="polite">{guests}</span>

              <button
                type="button"
                onClick={() =>
                  setGuests((current) => Math.min(maxGuests, current + 1))
                }
                disabled={guests >= maxGuests}
                aria-label="Add one guest"
                className="btn-counter"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => setIsGuestsOpen(false)}
                aria-label="Confirm guests"
                className="btn-confirm"
              >
                ✓
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleReserve}
        className="btn-primary mt-4 w-full"
      >
        Reserve
      </button>
    </aside>
  );
}
