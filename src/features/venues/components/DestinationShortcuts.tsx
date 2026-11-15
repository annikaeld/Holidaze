import { Link } from "react-router";
import {
  Globe2,
  Landmark,
  Mountain,
  Sun,
  Trees,
  Waves,
  Snowflake,
} from "lucide-react";

const destinations = [
  { label: "All destinations", href: "/venues", Icon: Globe2 },
  { label: "Europe", href: "/venues?region=europe", Icon: Landmark },
  { label: "Asia", href: "/venues?region=asia", Icon: Mountain },
  { label: "Africa", href: "/venues?region=africa", Icon: Sun },
  { label: "Americas", href: "/venues?region=americas", Icon: Trees },
  { label: "Oceania", href: "/venues?region=oceania", Icon: Waves },
  { label: "Nordics", href: "/venues?region=nordic", Icon: Snowflake },
];

export function DestinationShortcuts() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-8 text-center">
        What type of destination are you looking for?
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory sm:flex-wrap sm:justify-center sm:gap-6 sm:overflow-visible">
        {destinations.map(({ label, href, Icon }) => (
          <Link
            key={label}
            to={href}
            className="group flex w-20 shrink-0 snap-start flex-col items-center gap-3 text-center sm:w-24"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-placeholder transition-colors group-hover:bg-hero">
              <Icon
                size={30}
                strokeWidth={1.5}
                className="text-heading"
                aria-hidden="true"
              />
            </span>

            <span className="text-sm">{label}</span>
          </Link>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground sm:hidden">
        Swipe to see more
      </p>
    </section>
  );
}
