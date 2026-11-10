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
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, guests - 1))}
        disabled={guests <= 1}
        aria-label="Remove one guest"
        className="btn-counter"
      >
        −
      </button>
      <span aria-live="polite">{guests}</span>
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
  );
}
