const API_URL = "https://v2.api.noroff.dev/holidaze/bookings";

export interface CreateBookingData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

export async function createBooking(
  data: CreateBookingData,
  accessToken: string,
) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Could not create booking");
  }

  return response.json();
}
