import { addDays, parseISO } from "date-fns";
import type { VenueBooking } from "../types/venue";

export function getBookedDates(bookings: VenueBooking[]) {
  return bookings.map((booking) => ({
    from: parseISO(booking.dateFrom),
    to: addDays(parseISO(booking.dateTo), -1),
  }));
}
