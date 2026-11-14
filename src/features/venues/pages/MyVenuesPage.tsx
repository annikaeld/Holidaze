import { Link, Navigate } from "react-router";
import { useAuth } from "@/features/auth/context/useAuth";

export function MyVenuesPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.venueManager) {
    return <Navigate to="/list-venue" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1>My venues</h1>

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
    </main>
  );
}
