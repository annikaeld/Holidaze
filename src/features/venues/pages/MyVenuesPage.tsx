import { Link, Navigate } from "react-router";
import { useAuth } from "@/features/auth/context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getManagedVenues } from "../services/venuesApi";
import { OverviewCard } from "../components/OverviewCard";

export function MyVenuesPage() {
  const { user } = useAuth();
  const {
    data: venues = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["managed-venues", user?.name],
    queryFn: () => getManagedVenues(user!.name, user!.accessToken),
    enabled: Boolean(user?.venueManager),
    retry: false,
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/list-venue" replace />;
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1>My venues</h1>
        <p className="mt-8 text-muted-foreground">Loading your venues...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1>My venues</h1>
        <p role="alert" className="mt-8 text-error">
          Unable to load your venues. Please try again.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1>My venues</h1>

        {venues.length > 0 && (
          <Link
            to="/my-venues/create"
            className="btn-primary btn-primary-compact"
          >
            Create venue
          </Link>
        )}
      </div>

      {venues.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h2>Ready to list your first venue?</h2>

          <p className="mt-3 text-muted-foreground">
            Create your first listing and start welcoming guests.
          </p>

          <Link
            to="/my-venues/create"
            className="btn-primary btn-primary-compact mt-6"
          >
            Create venue
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {venues.map((venue) => (
            <OverviewCard
              key={venue.id}
              title={venue.name}
              image={venue.media?.[0]}
              actions={
                <Link
                  to={`/venues/${venue.id}`}
                  className="text-sm font-semibold text-heading underline-offset-4 hover:underline"
                >
                  View venue
                </Link>
              }
            >
              <p className="text-sm">
                NOK {venue.price.toLocaleString("nb-NO")} / night
              </p>

              <p className="text-sm">Up to {venue.maxGuests} guests</p>
            </OverviewCard>
          ))}
        </div>
      )}
    </main>
  );
}
