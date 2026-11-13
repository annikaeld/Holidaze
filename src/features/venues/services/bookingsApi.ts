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

export interface CustomerBooking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue: {
    id: string;
    name: string;
    media: {
      url: string;
      alt?: string;
    }[];
    price: number;
  };
}

interface CustomerBookingsResponse {
  data: CustomerBooking[];
}

export async function getCustomerBookings(
  name: string,
  accessToken: string,
): Promise<CustomerBooking[]> {
  const response = await fetch(
    `https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(name)}/bookings?_venue=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not load your bookings.");
  }

  const result: CustomerBookingsResponse = await response.json();

  return result.data;
}

export async function deleteBooking(
  bookingId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/${bookingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Could not cancel booking. Please try again.");
  }
}
