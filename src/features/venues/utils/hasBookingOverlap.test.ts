import { describe, expect, it } from "vitest";
import type { VenueBooking } from "../types/venue";
import { hasBookingOverlap } from "./hasBookingOverlap";

const bookings: VenueBooking[] = [
  {
    id: "existing-booking",
    dateFrom: "2026-12-24",
    dateTo: "2026-12-26",
    guests: 2,
  },
];

describe("hasBookingOverlap", () => {
  it("detects an overlapping booking", () => {
    const checkIn = new Date(2026, 11, 25);
    const checkOut = new Date(2026, 11, 27);

    expect(hasBookingOverlap(checkIn, checkOut, bookings)).toBe(true);
  });

  it("allows check-in on the day another booking ends", () => {
    const checkIn = new Date(2026, 11, 26);
    const checkOut = new Date(2026, 11, 28);

    expect(hasBookingOverlap(checkIn, checkOut, bookings)).toBe(false);
  });
});