import { useState } from "react";
interface GuestSelectorProps {
  guests: number;
  maxGuests: number;
  onChange: (guests: number) => void;
  onConfirm: () => void;
}

export function GuestSelector({
  guests,
  maxGuests,
  onChange,
  onConfirm,
}: GuestSelectorProps) {
  const [guestInput, setGuestInput] = useState<string | null>(null);

  function updateGuestInput(value: string) {
    if (!/^\d*$/.test(value)) return;

    setGuestInput(value);

    const count = Number(value);
    if (count >= 1 && count <= maxGuests) {
      onChange(count);
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, guests - 1))}
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
          onChange={(event) => updateGuestInput(event.currentTarget.value)}
          onBlur={() => setGuestInput(null)}
          className="w-12 rounded bg-transparent px-1 py-2 text-center text-foreground focus:bg-field-active focus:outline-hidden"
        />

        <button
          type="button"
          onClick={() => onChange(Math.min(maxGuests, guests + 1))}
          disabled={guests >= maxGuests}
          aria-label="Add one guest"
          className="btn-counter"
        >
          +
        </button>

        <button
          type="button"
          onClick={onConfirm}
          aria-label="Confirm guests"
          className="btn-confirm"
        >
          ✓
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Maximum {maxGuests} {maxGuests === 1 ? "guest" : "guests"} for this
        venue
      </p>
    </div>
  );
}
