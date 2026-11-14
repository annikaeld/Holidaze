import { useMutation } from "@tanstack/react-query";
import { Navigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth";
import { updateProfile } from "@/features/auth/services/authApi";

export function BecomeVenueManagerPage() {
  const { user, login } = useAuth();

  const mutation = useMutation({
    mutationFn: () => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return updateProfile(user.name, user.accessToken, {
        venueManager: true,
      });
    },
    onSuccess: (response) => {
      if (!user || response.data.venueManager !== true) {
        toast.error("Could not activate venue manager. Please try again.");
        return;
      }

      login({
        ...user,
        venueManager: response.data.venueManager,
      });

      toast.success("You're now a venue manager!");
    },
    onError: () => {
      toast.error("Could not activate venue manager. Please try again.");
    },
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.venueManager) {
    return <Navigate to="/my-venues" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1>Become a venue manager</h1>

      <p className="mt-4 text-muted-foreground">
        Have a place you'd like to share? Become a venue manager to create
        listings and manage bookings, all from your existing Holidaze account.
      </p>

      <button
        type="button"
        className="btn-primary mt-8"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? "Activating..." : "Become a venue manager"}
      </button>
    </main>
  );
}
