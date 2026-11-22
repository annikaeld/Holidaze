import { Link, Navigate } from "react-router";
import { useAuth } from "@/features/auth/context/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getManagedVenues, deleteVenue } from "../services/venuesApi";
import { OverviewCard } from "../components/OverviewCard";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { PageMessage } from "@/shared/components/PageMessage";
import { Pagination } from "@/features/venues/components/Pagination";
import { usePagination } from "@/shared/hooks/usePagination";

export function MyVenuesPage() {
  const { user } = useAuth();
  const [venueToDelete, setVenueToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    networkMode: "always",
    mutationFn: (id: string) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return deleteVenue(id, user.accessToken);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-venues"] });
      setVenueToDelete(null);
      toast.success("Venue deleted successfully!");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const {
    visibleItems: visibleVenues,
    currentPage,
    pageCount,
    goToPage,
  } = usePagination(venues);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/list-venue" replace />;
  }

  if (isLoading) {
    return <PageMessage>Loading your venues...</PageMessage>;
  }

  if (isError) {
    return (
      <PageMessage isError>
        Unable to load your venues. Please try again.
      </PageMessage>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 id="my-venues-heading">My venues</h1>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/my-venues/bookings"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-medium hover:bg-field-active"
          >
            Guest bookings
          </Link>

          {venues.length > 0 && (
            <Link
              to="/my-venues/create"
              className="btn-primary btn-primary-compact"
            >
              Create venue
            </Link>
          )}
        </div>
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
          {visibleVenues.map((venue) => (
            <OverviewCard
              key={venue.id}
              title={venue.name}
              image={venue.media?.[0]}
              actions={
                <div className="flex w-full flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/venues/${venue.id}`}
                      state={{ from: "my-venues" }}
                      className="text-sm font-semibold text-heading underline-offset-4 hover:underline"
                    >
                      View venue
                    </Link>

                    <Link
                      to={`/my-venues/${venue.id}/edit`}
                      className="text-sm font-semibold text-heading underline-offset-4 hover:underline"
                    >
                      Edit venue
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setVenueToDelete({ id: venue.id, name: venue.name })
                    }
                    disabled={deleteMutation.isPending}
                    className="cursor-pointer text-sm font-semibold text-error disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables === venue.id
                      ? "Deleting..."
                      : "Delete venue"}
                  </button>
                </div>
              }
            >
              <p className="text-sm">
                NOK {venue.price.toLocaleString("nb-NO")} / night
              </p>

              <p className="text-sm">
                Up to {venue.maxGuests}{" "}
                {venue.maxGuests === 1 ? "guest" : "guests"}
              </p>
            </OverviewCard>
          ))}

          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={goToPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(venueToDelete)}
        title="Delete venue?"
        confirmLabel="Delete venue"
        cancelLabel="Keep venue"
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (venueToDelete) {
            deleteMutation.mutate(venueToDelete.id);
          }
        }}
        onClose={() => setVenueToDelete(null)}
      >
        {venueToDelete && (
          <>
            <p>
              Are you sure you want to delete{" "}
              <strong>{venueToDelete.name}</strong>?
            </p>

            <p className="text-muted-foreground">
              This action cannot be undone.
            </p>
          </>
        )}
      </ConfirmDialog>
    </main>
  );
}
