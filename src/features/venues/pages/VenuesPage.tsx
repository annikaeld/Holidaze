import { useQuery } from "@tanstack/react-query";
import { getAllVenues } from "@/features/venues/services/venuesApi";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { useSearchParams } from "react-router";
import { Pagination } from "@/features/venues/components/Pagination";
import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";
import { VenueFilters } from "@/features/venues/components/VenueFilters";

function datesOverlap(
  checkIn: string,
  checkOut: string,
  bookedFrom: string,
  bookedTo: string,
): boolean {
  return (
    new Date(checkIn) < new Date(bookedTo) &&
    new Date(checkOut) > new Date(bookedFrom)
  );
}

export function VenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = searchParams.get("destination") ?? "";
  const guests = Number(searchParams.get("guests") ?? 1);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const wifi = searchParams.get("wifi") === "true";
  const parking = searchParams.get("parking") === "true";
  const breakfast = searchParams.get("breakfast") === "true";
  const pets = searchParams.get("pets") === "true";
  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? Infinity);

  const {
    data: venuesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["venues", destination],
    queryFn: () => getAllVenues(destination),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="min-h-screen p-8">
        <p>Loading venues...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen p-8">
        <p role="alert">{error.message}</p>
      </section>
    );
  }

  if (!venuesData || venuesData.length === 0) {
    return (
      <section className="min-h-screen p-8">
        <p>No venues found.</p>
      </section>
    );
  }

  const venues = venuesData.filter((venue) => {
    if (venue.maxGuests < guests) return false;

    if (wifi && !venue.meta?.wifi) return false;
    if (parking && !venue.meta?.parking) return false;
    if (breakfast && !venue.meta?.breakfast) return false;
    if (pets && !venue.meta?.pets) return false;
    if (venue.price < minPrice) return false;
    if (venue.price > maxPrice) return false;

    if (!checkIn || !checkOut) return true;

    return !venue.bookings?.some((booking) =>
      datesOverlap(checkIn, checkOut, booking.dateFrom, booking.dateTo),
    );
  });

  const pageSize = 12;
  const pageCount = Math.ceil(venues.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));

  const paginatedVenues = venues.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1>Venues</h1>
      <div className="my-6">
        <VenueSearchForm key={searchParams.toString()} />
      </div>
      <VenueFilters
        selected={["wifi", "parking", "breakfast", "pets"].filter(
          (amenity) => searchParams.get(amenity) === "true",
        )}
        onChange={(amenity, checked) => {
          setSearchParams((params) => {
            if (checked) {
              params.set(amenity, "true");
            } else {
              params.delete(amenity);
            }

            params.delete("page");
            return params;
          });
        }}
        minPrice={searchParams.get("minPrice") ?? ""}
        maxPrice={searchParams.get("maxPrice") ?? ""}
        onPriceChange={(min, max) => {
          setSearchParams((params) => {
            if (min === "") {
              params.delete("minPrice");
            } else {
              params.set("minPrice", min);
            }

            if (max === "") {
              params.delete("maxPrice");
            } else {
              params.set("maxPrice", max);
            }

            params.delete("page");
            return params;
          });
        }}
      />
      <p>
        {venues.length === 0
          ? "0 venues found"
          : `Page ${currentPage} of ${pageCount} (${venues.length} venues found)`}
      </p>
      {venues.length === 0 ? (
        <p>No venues match your filters. Try adjusting your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={(newPage) => {
          setSearchParams((params) => {
            params.set("page", String(newPage));
            return params;
          });
        }}
      />
    </div>
  );
}
