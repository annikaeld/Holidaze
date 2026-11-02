import { useState } from "react";
import { regions } from "../utils/venueRegions";

type VenueFiltersProps = {
  selected: string[];
  onChange: (amenity: string, checked: boolean) => void;
  selectedRegions: string[];
  onRegionChange: (region: string, checked: boolean) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (minPrice: string, maxPrice: string) => void;
};

const amenities = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "parking", label: "Parking" },
  { value: "breakfast", label: "Breakfast" },
  { value: "pets", label: "Pets allowed" },
];

export function VenueFilters({
  selected,
  onChange,
  selectedRegions,
  onRegionChange,
  minPrice,
  maxPrice,
  onPriceChange,
}: VenueFiltersProps) {
  const [priceInputs, setPriceInputs] = useState({
    minPrice,
    maxPrice,
  });

  return (
    <div id="venue-filters">
      <fieldset>
        <legend className="mb-3 font-semibold">Regions</legend>
        <div className="grid grid-cols-2 gap-3">
          {regions.map((region) => (
            <label key={region.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={region.value}
                checked={selectedRegions.includes(region.value)}
                onChange={(event) =>
                  onRegionChange(region.value, event.target.checked)
                }
              />
              <span>{region.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 font-semibold">Price per night</legend>

        <div className="flex gap-3">
          <label className="flex flex-col gap-1">
            Min
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={priceInputs.minPrice}
              onChange={(event) =>
                setPriceInputs((prev) => ({
                  ...prev,
                  minPrice: event.target.value,
                }))
              }
              onBlur={() =>
                onPriceChange(priceInputs.minPrice, priceInputs.maxPrice)
              }
              className="w-full rounded-lg border border-border bg-card p-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            Max
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={priceInputs.maxPrice}
              onChange={(event) =>
                setPriceInputs((prev) => ({
                  ...prev,
                  maxPrice: event.target.value,
                }))
              }
              onBlur={() =>
                onPriceChange(priceInputs.minPrice, priceInputs.maxPrice)
              }
              className="w-full rounded-lg border border-border bg-card p-2"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="mb-3 font-semibold">Amenities</legend>

        <div className="flex flex-col gap-3">
          {amenities.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={(event) => onChange(value, event.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
