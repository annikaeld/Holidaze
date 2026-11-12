import { DateRangeCalendar } from "@/components/ui/DateRangeCalendar";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Check, X } from "lucide-react";
import { useSearchParams } from "react-router";

const SHORT_READABLE_DATE_LOCALE = "en-GB";

function formatDateForUrl(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

type VenueSearchFormProps = {
  variant?: "default" | "filters";
  draftParams?: URLSearchParams;
  onDraftChange?: (name: string, value: string) => void;
};

export function VenueSearchForm({
  variant = "default",
  draftParams,
  onDraftChange,
}: VenueSearchFormProps) {
  const [urlParams] = useSearchParams();
  const searchParams = draftParams ?? urlParams;
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (!checkIn || !checkOut) return undefined;

    return {
      from: new Date(`${checkIn}T12:00:00`),
      to: new Date(`${checkOut}T12:00:00`),
    };
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guests, setGuests] = useState(
    Math.max(1, Number(searchParams.get("guests")) || 1),
  );
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const [destination, setDestination] = useState(
    searchParams.get("destination") ?? "",
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchFormRef.current &&
        !searchFormRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <form
      id={variant === "filters" ? "venue-filter-search" : undefined}
      ref={searchFormRef}
      action="/venues"
      method="get"
      className={
        variant === "filters"
          ? "flex w-full flex-col gap-3"
          : "flex w-full flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0 lg:p-2 search-surface"
      }
    >
      {variant === "filters" &&
        ["wifi", "parking", "breakfast", "pets", "minPrice", "maxPrice"].map(
          (name) =>
            searchParams.has(name) && (
              <input
                key={name}
                type="hidden"
                name={name}
                value={searchParams.get(name) ?? ""}
              />
            ),
        )}
      <div
        className={
          variant === "filters"
            ? "relative flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring"
            : "relative flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring lg:flex-2 lg:rounded-none lg:border-0 lg:bg-transparent lg:focus-within:ring-0 lg:focus-within:bg-field-active lg:focus-within:rounded-lg"
        }
      >
        <label
          htmlFor="destination"
          className="text-xs font-semibold text-muted-foreground"
        >
          Where?
        </label>
        <input
          type="search"
          id="destination"
          name="destination"
          placeholder="Search destinations or stays"
          value={destination}
          onChange={(event) => {
            const value = event.target.value;
            setDestination(value);

            if (variant === "filters") {
              onDraftChange?.("destination", value);
            }
          }}
          onFocus={() => {
            setIsCalendarOpen(false);
            setIsGuestsOpen(false);
          }}
          className="w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
        {destination && (
          <button
            type="button"
            onClick={() => {
              setDestination("");

              if (variant === "filters") {
                onDraftChange?.("destination", "");
              }
            }}
            aria-label="Clear destination"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div
        className={
          variant === "filters"
            ? "relative grid min-w-0 grid-cols-1 gap-3"
            : "relative grid min-w-0 grid-cols-2 gap-3 lg:flex-2"
        }
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsGuestsOpen(false);
            }}
            aria-expanded={isCalendarOpen}
            aria-controls="date-calendar"
            className={
              variant === "filters"
                ? "flex w-full min-w-0 flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left focus-visible:ring-2 focus-visible:ring-ring"
                : "flex w-full min-w-0 flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left focus-visible:ring-2 focus-visible:ring-ring lg:border-0 lg:bg-transparent lg:rounded-lg lg:focus-visible:bg-field-active lg:aria-expanded:bg-field-active"
            }
          >
            <span className="text-xs font-semibold text-muted-foreground">
              When?
            </span>
            <span className="text-foreground">
              {dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString(
                    SHORT_READABLE_DATE_LOCALE,
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )} – ${dateRange.to.toLocaleDateString(
                    SHORT_READABLE_DATE_LOCALE,
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}`
                : "Add dates"}
            </span>
          </button>
          <input
            type="hidden"
            name="checkIn"
            value={dateRange?.from ? formatDateForUrl(dateRange.from) : ""}
          />
          <input
            type="hidden"
            name="checkOut"
            value={dateRange?.to ? formatDateForUrl(dateRange.to) : ""}
          />
        </div>
        {isCalendarOpen && (
          <div
            className={
              variant === "filters"
                ? "relative mt-3 w-full rounded-xl border border-border bg-card p-2 sm:p-4"
                : "absolute left-0 top-full z-50 mt-2 rounded-xl border border-border bg-card p-2 sm:p-4 shadow-lg max-w-[calc(100vw-2rem)]"
            }
          >
            <DateRangeCalendar
              id="date-calendar"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);

                if (variant === "filters") {
                  onDraftChange?.(
                    "checkIn",
                    range?.from ? formatDateForUrl(range.from) : "",
                  );
                  onDraftChange?.(
                    "checkOut",
                    range?.to ? formatDateForUrl(range.to) : "",
                  );
                }
              }}
              onClear={() => {
                setDateRange(undefined);

                if (variant === "filters") {
                  onDraftChange?.("checkIn", "");
                  onDraftChange?.("checkOut", "");
                }
              }}
              onConfirm={() => setIsCalendarOpen(false)}
            />
          </div>
        )}
        <div
          className={
            variant === "filters"
              ? "relative flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring"
              : "relative flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring lg:rounded-none lg:border-0 lg:bg-transparent lg:focus-within:ring-0 lg:focus-within:bg-field-active lg:focus-within:rounded-lg"
          }
        >
          <label
            htmlFor="guests"
            className="text-xs font-semibold text-muted-foreground"
          >
            Guests
          </label>
          <button
            type="button"
            id="guests"
            onClick={() => {
              setIsGuestsOpen(!isGuestsOpen);
              setIsCalendarOpen(false);
            }}
            aria-expanded={isGuestsOpen}
            aria-controls="guests-popover"
            className="w-full min-w-0 bg-transparent text-left text-foreground"
          >
            {guests} {guests === 1 ? "guest" : "guests"}
          </button>
          <input type="hidden" name="guests" value={guests} />
          {isGuestsOpen && (
            <div
              id="guests-popover"
              className={
                variant === "filters"
                  ? "mt-3 w-full border-t border-border pt-3"
                  : "absolute top-full right-0 z-50 mt-2 min-w-52 rounded-xl border border-border bg-card p-4 shadow-lg"
              }
            >
              <div
                className={
                  variant === "filters"
                    ? "flex items-center justify-center gap-4"
                    : "flex items-center justify-between gap-4"
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    const updatedGuests = Math.max(1, guests - 1);
                    setGuests(updatedGuests);

                    if (variant === "filters") {
                      onDraftChange?.("guests", String(updatedGuests));
                    }
                  }}
                  disabled={guests <= 1}
                  aria-label="Remove one guest"
                  className="btn-counter"
                >
                  −
                </button>

                <span aria-live="polite">{guests}</span>

                <button
                  type="button"
                  onClick={() => {
                    const updatedGuests = guests + 1;
                    setGuests(updatedGuests);

                    if (variant === "filters") {
                      onDraftChange?.("guests", String(updatedGuests));
                    }
                  }}
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
                  <Check size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {variant !== "filters" && (
        <div className="lg:flex lg:items-center lg:pl-3">
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      )}
    </form>
  );
}
