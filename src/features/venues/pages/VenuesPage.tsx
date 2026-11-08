import { useQuery } from "@tanstack/react-query";
import { getAllVenues } from "@/features/venues/services/venuesApi";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { useSearchParams } from "react-router";
import { Pagination } from "@/features/venues/components/Pagination";
import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm";
import { VenueFilters } from "@/features/venues/components/VenueFilters";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  getVenueRegion,
  isNordicCountry,
} from "@/features/venues/utils/venueRegions";
import { VenueCardSkeleton } from "@/features/venues/components/VenueCardSkeleton";

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
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterDialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!filtersOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);
  useEffect(() => {
    if (!filtersOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [filtersOpen]);
  useEffect(() => {
    if (!filtersOpen) return;

    const dialog = filterDialogRef.current;
    const filterButton = filterButtonRef.current;
    if (!dialog) return;

    const focusableSelector =
      'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.getClientRects().length > 0);

    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const elements = getFocusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleTab);
      filterButton?.focus();
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
  const sort = searchParams.get("sort") ?? "newest";
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

  const sortedVenues = [...venues].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;

      case "price-desc":
        return b.price - a.price;

      case "rating-asc":
        return a.rating - b.rating;

      case "rating-desc":
        return b.rating - a.rating;

      default:
        return new Date(b.created).getTime() - new Date(a.created).getTime();
    }
  });

  const pageSize = 12;
  const pageCount = Math.ceil(venues.length / pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));

  const paginatedVenues = sortedVenues.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1>Venues</h1>

        <div className="flex items-center gap-3">
          <select
            aria-label="Sort venues"
            value={sort}
            onChange={(event) => {
              const value = event.target.value;

              setSearchParams((previous) => {
                const params = new URLSearchParams(previous);

                if (value === "newest") {
                  params.delete("sort");
                } else {
                  params.set("sort", value);
                }

                params.delete("page");
                return params;
              });
            }}
            className="min-w-0 cursor-pointer rounded-lg border border-border bg-card px-3 py-3 text-sm text-card-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="rating-desc">Rating: High to low</option>
            <option value="rating-asc">Rating: Low to high</option>
          </select>
          <button
            ref={filterButtonRef}
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

          {!isLoading && !error && (
            <span className="ml-auto whitespace-nowrap text-sm text-muted-foreground">
              {venues.length.toLocaleString("en-US")} stays
            </span>
          )}
        </div>
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4">
          <div
            role="dialog"
            ref={filterDialogRef}
            aria-modal="true"
            aria-label="Filters"
            className="filter-modal flex max-h-[90dvh] w-full flex-col rounded-t-2xl bg-card p-6 shadow-xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl"
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
              <div className="mt-6">
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
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchParams(new URLSearchParams(draftParams));
                setFiltersOpen(false);
              }}
              className="btn-primary mt-6 shrink-0"
            >
              Show venues
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <>
          <p role="status" className="sr-only">
            Loading venues...
          </p>
          <div
            aria-hidden="true"
            className="mb-4 h-5 w-20 animate-pulse rounded bg-placeholder"
          />
          <div
            aria-hidden="true"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <VenueCardSkeleton key={index} />
            ))}
          </div>
        </>
      ) : error ? (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-border bg-card p-6 text-card-foreground"
        >
          <h2 className="text-lg font-semibold">Unable to load venues</h2>
          <p className="mt-2 text-muted-foreground">
            Something went wrong. Please try again later.
          </p>
        </div>
      ) : (
        <>
          {venues.length === 0 ? (
            <p>No venues match your filters. Try adjusting your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </>
      )}
      {!isLoading && !error && venues.length > 0 && (
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={(newPage) => {
            setSearchParams((params) => {
              params.set("page", String(newPage));
              return params;
            });

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      )}
    </div>
  );
}
