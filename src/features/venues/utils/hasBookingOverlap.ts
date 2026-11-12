import { isBefore, parseISO, startOfDay } from "date-fns";
import type { VenueBooking } from "../types/venue";

export function hasBookingOverlap(
  checkIn: Date,
  checkOut: Date,
  bookings: VenueBooking[],
): boolean {
  const selectedFrom = startOfDay(checkIn);
  const selectedTo = startOfDay(checkOut);

  return bookings.some((booking) => {
    const bookedFrom = startOfDay(parseISO(booking.dateFrom));
    const bookedTo = startOfDay(parseISO(booking.dateTo));

    return isBefore(selectedFrom, bookedTo) && isBefore(bookedFrom, selectedTo);
  });
}
