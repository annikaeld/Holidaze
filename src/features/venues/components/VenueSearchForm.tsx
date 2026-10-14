import { DayPicker } from "react-day-picker";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Check } from "lucide-react";

export function VenueSearchForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <form action="/venues" method="get" className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring">
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
          className="w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="grid grid-cols-2 relative gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            aria-expanded={isCalendarOpen}
            aria-controls="date-calendar"
            className="flex w-full min-w-0 flex-col items-start gap-1 rounded-lg border border-border bg-card p-3 text-left focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-xs font-semibold text-muted-foreground">
              When?
            </span>
            <span className="text-foreground">
              {dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })} – ${dateRange.to.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}`
                : "Add dates"}
            </span>
          </button>
          <input
            type="hidden"
            name="checkIn"
            value={dateRange?.from?.toLocaleDateString("en-CA") ?? ""}
          />
          <input
            type="hidden"
            name="checkOut"
            value={dateRange?.to?.toLocaleDateString("en-CA") ?? ""}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-3 focus-within:ring-2 focus-within:ring-ring">
          <label
            htmlFor="guests"
            className="text-xs font-semibold text-muted-foreground"
          >
            Guests
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            min={1}
            defaultValue={1}
            className="w-full min-w-0 bg-transparent text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <button type="submit">Search</button>
      </div>
    </form>
  );
}
