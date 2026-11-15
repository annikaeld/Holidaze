import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth";
import { getVenue, updateVenue } from "../services/venuesApi";
import { VenueForm } from "../components/VenueForm";
import type { VenueFormData } from "../schemas/venueSchema";
import { PageMessage } from "@/shared/components/PageMessage";

export function EditVenuePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: VenueFormData) => {
      if (!user || !id) {
        throw new Error("Unable to update venue.");
      }

      return updateVenue(id, data, user.accessToken);
    },

    onSuccess: (updatedVenue) => {
      queryClient.setQueryData(["venue", id], updatedVenue);
      queryClient.invalidateQueries({ queryKey: ["managed-venues"] });

      toast.success("Venue updated successfully!");
      navigate("/my-venues");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    data: venue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenue(id!),
    enabled: Boolean(id && user?.venueManager),
    retry: false,
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/list-venue" replace />;
  }

  if (isLoading) {
    return <PageMessage>Loading venue...</PageMessage>;
  }

  if (isError || !venue) {
    return <PageMessage isError>Unable to load venue.</PageMessage>;
  }

  if (venue.owner?.name !== user.name) {
    return <PageMessage isError>You can only edit venues you own.</PageMessage>;
  }

  const initialValues: VenueFormData = {
    name: venue.name,
    description: venue.description,
    price: venue.price,
    maxGuests: venue.maxGuests,
    rating: venue.rating,
    media: venue.media,
    meta: venue.meta,
    location: {
      country: venue.location.country ?? "",
      city: venue.location.city ?? "",
      address: venue.location.address ?? "",
    },
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/my-venues"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My venues
      </Link>

      <h1 className="mb-8">Edit venue</h1>

      <VenueForm
        initialValues={initialValues}
        onSubmit={(data) => updateMutation.mutate(data)}
        isPending={updateMutation.isPending}
        submitLabel="Save changes"
      />
    </main>
  );
}
