import { DayPicker } from "react-day-picker";
import type { DateRange, Matcher } from "react-day-picker";
import { Check } from "lucide-react";
import { isBefore, isSameDay, parseISO, startOfDay } from "date-fns";
import type { VenueBooking } from "@/features/venues/types/venue";
import { hasBookingOverlap } from "@/features/venues/utils/hasBookingOverlap";
import { useState } from "react";

interface DateRangeCalendarProps {
  id?: string;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  bookings?: VenueBooking[];
  onClear?: () => void;
  onConfirm?: () => void;
}

export function DateRangeCalendar({
  id,
  selected,
  onSelect,
  bookings = [],
  onClear,
  onConfirm,
}: DateRangeCalendarProps) {
  const bookedPeriods = bookings.map((booking) => ({
    from: startOfDay(parseISO(booking.dateFrom)),
    to: startOfDay(parseISO(booking.dateTo)),
  }));

  const [dateError, setDateError] = useState<string | null>(null);

  const disabledDates: Matcher[] = [
    { before: startOfDay(new Date()) },
    (date: Date) => {
      const day = startOfDay(date);

      return bookedPeriods.some((period) => {
        const isBookedNight =
          !isBefore(day, period.from) && isBefore(day, period.to);

        const isValidCheckout =
          selected?.from &&
          isBefore(selected.from, day) &&
          isSameDay(day, period.from) &&
          !hasBookingOverlap(selected.from, day, bookings);

        return isBookedNight && !isValidCheckout;
      });
    },
  ];

  function handleSelect(range: DateRange | undefined) {
    if (!range?.from) {
      onSelect(undefined);
      return;
    }

    const checkIn = startOfDay(range.from);

    if (!range.to || isSameDay(range.from, range.to)) {
      const isBooked = bookedPeriods.some(
        (period) =>
          !isBefore(checkIn, period.from) && isBefore(checkIn, period.to),
      );

      if (!isBooked) {
        setDateError(null);
        onSelect({ from: checkIn, to: undefined });
      }

      return;
    }

    const checkOut = startOfDay(range.to);
    if (isBefore(checkIn, checkOut)) {
      if (hasBookingOverlap(checkIn, checkOut, bookings)) {
        setDateError("Some dates in this range are already booked.");
        return;
      }

      setDateError(null);
      onSelect({ from: checkIn, to: checkOut });
    }
  }

  return (
    <div className="calendar-content">
      <DayPicker
        id={id}
        autoFocus
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={disabledDates}
        className="holidaze-calendar"
      />

      {dateError && (
        <p role="alert" className="mt-2 text-sm text-error">
          {dateError}
        </p>
      )}

      {(onClear || onConfirm) && (
        <div className="mt-4 flex items-center justify-between gap-3">
          {onClear && (
            <button
              type="button"
              onClick={() => {
                setDateError(null);
                onClear?.();
              }}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              Clear
            </button>
          )}

          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={!selected?.from || !selected?.to}
              aria-label="Confirm dates"
              className="btn-confirm"
            >
              <Check size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
