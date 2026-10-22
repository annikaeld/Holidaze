import { DayPicker } from "react-day-picker";
import type { DateRange, Matcher } from "react-day-picker";
import { Check } from "lucide-react";

interface DateRangeCalendarProps {
  id?: string;
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  disabled?: Matcher | Matcher[];
  onClear?: () => void;
  onConfirm?: () => void;
}

export function DateRangeCalendar({
  id,
  selected,
  onSelect,
  disabled,
  onClear,
  onConfirm,
}: DateRangeCalendarProps) {
  return (
    <>
      <DayPicker
        id={id}
        autoFocus
        mode="range"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        excludeDisabled
        className="holidaze-calendar"
      />

      {(onClear || onConfirm) && (
        <div className="mt-4 flex items-center justify-between gap-3">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              Clear
            </button>
          )}

          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={!selected?.from || !selected?.to}
              aria-label="Confirm dates"
              className="btn-confirm"
            >
              <Check size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
