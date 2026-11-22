import { Link, Navigate, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth";
import { VenueForm } from "../components/VenueForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVenue } from "../services/venuesApi";
import type { VenueFormData } from "../schemas/venueSchema";
import { useEffect } from "react";

export function CreateVenuePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    networkMode: "always",
    mutationFn: (data: VenueFormData) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return createVenue(data, user.accessToken);
    },

    onSuccess: (venue) => {
      toast.success("Venue created successfully!");
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      navigate(`/venues/${venue.id}`);
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/list-venue" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/my-venues"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My venues
      </Link>

      <h1 className="mb-8">Create venue</h1>

      <VenueForm
        onSubmit={(data) => createMutation.mutateAsync(data)}
        isPending={createMutation.isPending}
      />
    </main>
  );
}
