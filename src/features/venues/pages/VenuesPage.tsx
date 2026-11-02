import { useQuery } from "@tanstack/react-query";
import { getAllVenues } from "@/features/venues/services/venuesApi";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { useSearchParams } from "react-router";
import { Pagination } from "@/features/venues/components/Pagination";
import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";
import { VenueFilters } from "@/features/venues/components/VenueFilters";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  getVenueRegion,
  isNordicCountry,
} from "@/features/venues/utils/venueRegions";

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftParams, setDraftParams] = useState(
    () => new URLSearchParams(searchParams),
  );
  useEffect(() => {
    if (!filtersOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);
  const destination = searchParams.get("destination") ?? "";
  const guests = Number(searchParams.get("guests") ?? 1);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const wifi = searchParams.get("wifi") === "true";
  const parking = searchParams.get("parking") === "true";
  const breakfast = searchParams.get("breakfast") === "true";
  const pets = searchParams.get("pets") === "true";
  const selectedRegions = searchParams.getAll("region");
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

  const venues = (venuesData ?? []).filter((venue) => {
    if (selectedRegions.length > 0) {
      const country = venue.location?.country ?? null;
      const continent = venue.location?.continent ?? null;

      const region = getVenueRegion(country, continent);

      const matchesRegion = selectedRegions.some(
        (selected) =>
          selected === region ||
          (selected === "nordic" && isNordicCountry(country)),
      );

      if (!matchesRegion) return false;
    }
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
      <div className="flex items-center justify-between">
        <h1>Venues</h1>

        <button
          type="button"
          onClick={() => {
            setDraftParams(new URLSearchParams(searchParams));
            setFiltersOpen(true);
          }}
          aria-label="Open filters"
          className="cursor-pointer rounded-lg border border-border bg-card p-3"
        >
          <SlidersHorizontal size={20} aria-hidden="true" />
        </button>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-card p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="cursor-pointer text-2xl"
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>

            <div className="min-h-0 min-w-0 overflow-y-auto px-2 py-2">
              <VenueSearchForm
                variant="filters"
                draftParams={draftParams}
                onDraftChange={(name, value) => {
                  setDraftParams((previous) => {
                    const params = new URLSearchParams(previous);

                    if (value) {
                      params.set(name, value);
                    } else {
                      params.delete(name);
                    }

                    params.delete("page");
                    return params;
                  });
                }}
              />
              <VenueFilters
                selectedRegions={draftParams.getAll("region")}
                onRegionChange={(region, checked) => {
                  setDraftParams((previous) => {
                    const params = new URLSearchParams(previous);

                    if (checked) {
                      params.append("region", region);
                    } else {
                      params.delete("region", region);
                    }

                    params.delete("page");
                    return params;
                  });
                }}
                selected={["wifi", "parking", "breakfast", "pets"].filter(
                  (amenity) => draftParams.get(amenity) === "true",
                )}
                onChange={(amenity, checked) => {
                  setDraftParams((previous) => {
                    const params = new URLSearchParams(previous);

                    if (checked) {
                      params.set(amenity, "true");
                    } else {
                      params.delete(amenity);
                    }

                    params.delete("page");
                    return params;
                  });
                }}
                minPrice={draftParams.get("minPrice") ?? ""}
                maxPrice={draftParams.get("maxPrice") ?? ""}
                onPriceChange={(min, max) => {
                  setDraftParams((previous) => {
                    const params = new URLSearchParams(previous);

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
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchParams(new URLSearchParams(draftParams));
                setFiltersOpen(false);
              }}
              className="mt-6 cursor-pointer rounded-lg bg-field-active p-3"
            >
              Show venues
            </button>
          </div>
        </div>
      )}

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
