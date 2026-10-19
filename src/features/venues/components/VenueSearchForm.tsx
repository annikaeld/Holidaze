import { DayPicker } from "react-day-picker";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Check, X } from "lucide-react";

const SHORT_READABLE_DATE_LOCALE = "en-GB";

function formatDateForUrl(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function VenueSearchForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guests, setGuests] = useState(1);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const [destination, setDestination] = useState("");

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
      ref={searchFormRef}
      action="/venues"
      method="get"
      className="flex w-full flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0 lg:rounded-xl lg:bg-card lg:p-2"
    >
      <div className="relative flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring lg:flex-2 lg:rounded-none lg:border-0 lg:bg-transparent lg:focus-within:ring-0 lg:focus-within:bg-field-active lg:focus-within:rounded-lg">
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
          placeholder="Where do you want to go?"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          onFocus={() => {
            setIsCalendarOpen(false);
            setIsGuestsOpen(false);
          }}
          className="w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
        {destination && (
          <button
            type="button"
            onClick={() => setDestination("")}
            aria-label="Clear destination"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="relative grid min-w-0 grid-cols-2 gap-3 lg:flex-2">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => {
              setIsCalendarOpen(!isCalendarOpen);
              setIsGuestsOpen(false);
            }}
            aria-expanded={isCalendarOpen}
            aria-controls="date-calendar"
            className="flex w-full min-w-0 flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left focus-visible:ring-2 focus-visible:ring-ring lg:border-0 lg:bg-transparent lg:rounded-lg lg:focus-visible:bg-field-active lg:aria-expanded:bg-field-active"
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
          <div className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-border bg-card p-2 sm:p-4 shadow-lg max-w-[calc(100vw-2rem)]">
            <DayPicker
              id="date-calendar"
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={{ before: new Date() }}
              className="holidaze-calendar"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDateRange(undefined)}
                className="rounded-lg px-3 py-2 cursor-pointer text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                disabled={!dateRange?.from || !dateRange?.to}
                aria-label="Confirm dates"
                className="btn-confirm"
              >
                <Check size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring lg:rounded-none lg:border-0 lg:bg-transparent lg:focus-within:ring-0 lg:focus-within:bg-field-active lg:focus-within:rounded-lg">
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
              className="absolute top-full right-0 z-50 mt-2 min-w-52 rounded-xl border border-border bg-card p-4 shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setGuests((count) => Math.max(1, count - 1))}
                  disabled={guests <= 1}
                  aria-label="Remove one guest"
                  className="btn-counter"
                >
                  −
                </button>

                <span aria-live="polite">{guests}</span>

                <button
                  type="button"
                  onClick={() => setGuests((count) => count + 1)}
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
      <div className="lg:flex lg:items-center lg:pl-3">
        <button type="submit" className="btn-primary">
          Search
        </button>
      </div>
    </form>
  );
}
