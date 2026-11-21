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
  const [query, setQuery] = useState(
    searchParams.get("q") ?? "",
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
  const [guestInput, setGuestInput] = useState<string | null>(null);

  function updateGuestInput(value: string) {
    if (!/^\d*$/.test(value)) return;

    setGuestInput(value);

    const count = Number(value);
    if (!Number.isSafeInteger(count) || count < 1) return;

    setGuests(count);

    if (variant === "filters") {
      onDraftChange?.("guests", String(count));
    }
  }

  return (
    <form
      id={variant === "filters" ? "venue-filter-search" : undefined}
      ref={searchFormRef}
      action="/venues"
      method="get"
      className={
        variant === "filters"
          ? "flex w-full flex-col gap-3"
          : "flex w-full flex-col gap-3 md:flex-row md:items-stretch md:gap-0 md:p-2 search-surface"
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
        className={`relative flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:bg-field-active focus-within:ring-2 focus-within:ring-focus-ring ${
          variant === "filters"
            ? ""
            : "dark:border-card-border md:flex-2 md:rounded-none md:border-0 md:bg-transparent md:focus-within:ring-0 md:focus-within:rounded-lg"
        }`}
      >
        <label
          htmlFor="search-query"
          className="text-xs font-semibold text-muted-foreground"
        >
          Search
        </label>
        <input
          type="search"
          id="search-query"
          name="q"
          placeholder="Search by name, city, country..."
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);

            if (variant === "filters") {
              onDraftChange?.("q", value);
            }
          }}
          onFocus={() => {
            setIsCalendarOpen(false);
            setIsGuestsOpen(false);
          }}
          className="w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");

              if (variant === "filters") {
                onDraftChange?.("q", "");
              }
            }}
            aria-label="Clear search query"
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
            : "relative grid min-w-0 grid-cols-2 gap-3 md:flex-2"
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
                ? "flex w-full min-w-0 flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left focus-visible:ring-2 focus-visible:ring-focus-ring"
                : "flex w-full min-w-0 flex-col items-start gap-1 rounded-lg border border-border dark:border-card-border bg-card p-3 text-left focus-visible:ring-2 focus-visible:ring-focus-ring md:border-0 md:bg-transparent md:rounded-lg md:focus-visible:bg-field-active md:aria-expanded:bg-field-active"
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
          data-active={isGuestsOpen}
          className={`relative min-w-0 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-focus-ring data-[active=true]:bg-field-active ${
            variant === "filters"
              ? isGuestsOpen
                ? "grid grid-cols-[minmax(0,1fr)_auto] gap-x-3"
                : "flex flex-col gap-1"
              : `flex flex-col gap-1 md:justify-center md:rounded-none dark:border-card-border md:border-0 md:bg-transparent md:focus-within:rounded-lg md:focus-within:ring-0 ${
                  isGuestsOpen ? "max-[360px]:px-1" : ""
                }`
          }`}
        >
          <label
            htmlFor="guests"
            className={
              variant === "default" && isGuestsOpen
                ? "sr-only"
                : "col-start-1 row-start-1 text-xs font-semibold text-muted-foreground"
            }
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
            className={
              variant === "default" && isGuestsOpen
                ? "hidden"
                : "w-full min-w-0 bg-transparent text-left text-foreground"
            }
          >
            {guests} {guests === 1 ? "guest" : "guests"}
          </button>
          <input type="hidden" name="guests" value={guests} />
          {isGuestsOpen && (
            <div
              id="guests-popover"
              className={
                variant === "filters"
                  ? "col-start-2 row-start-1 row-span-2 self-center"
                  : "min-w-0"
              }
            >
              <div
                className={
                  variant === "filters"
                    ? "flex items-center justify-end gap-3"
                    : "flex items-center justify-between gap-1 max-md:[&>button]:size-8 max-md:[&>button]:shrink-0 max-md:[&>input]:min-w-0 max-md:[&>input]:flex-1 md:justify-start md:gap-2"
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

                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="Number of guests"
                  value={guestInput ?? String(guests)}
                  onChange={(event) =>
                    updateGuestInput(event.currentTarget.value)
                  }
                  onBlur={() => setGuestInput(null)}
                  className="w-12 rounded bg-transparent px-1 py-2 text-center text-foreground focus:bg-field-active focus:outline-hidden"
                />

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
        <div className="md:flex md:items-center md:pl-3">
          <button
            type="submit"
            className="btn-primary shadow-[0_0_16px_4px_var(--card)]"
          >
            Search
          </button>
        </div>
      )}
    </form>
  );
}
