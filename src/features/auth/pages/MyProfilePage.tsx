import { Link, Navigate } from "react-router";
import { Pencil } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditAvatarDialog } from "@/features/auth/components/EditAvatarDialog";
import { updateProfile } from "@/features/auth/services/authApi";
import type { AvatarFormData } from "@/features/auth/schemas/avatarSchema";
import { AvatarImage } from "@/features/auth/components/AvatarImage";

export function MyProfilePage() {
  const { user, login } = useAuth();

  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const avatarMutation = useMutation({
    mutationFn: (data: AvatarFormData) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return updateProfile(user.name, user.accessToken, {
        avatar: data,
      });
    },
  });

  async function handleSaveAvatar(data: AvatarFormData) {
    if (!user) return;

    try {
      const response = await avatarMutation.mutateAsync(data);

      login({
        ...user,
        avatar: response.data.avatar,
      });
      setIsAvatarDialogOpen(false);
      toast.success("Your avatar has been updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update avatar. Please try again.",
      );
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <h1>My profile</h1>

      <section
        aria-label="Profile information"
        className="mt-6 rounded-2xl border border-card-border bg-card p-6"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <AvatarImage
              url={user.avatar?.url}
              alt={user.avatar?.alt || "Profile avatar"}
              size="lg"
            />

            <button
              type="button"
              aria-label="Change avatar"
              onClick={() => setIsAvatarDialogOpen(true)}
              className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <Pencil size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h2>{user.name}</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <Link
        to="/my-bookings"
        className="mt-6 inline-flex text-sm font-medium text-heading underline underline-offset-4 hover:text-primary"
      >
        My bookings
      </Link>
      {isAvatarDialogOpen && (
        <EditAvatarDialog
          currentAvatar={user.avatar}
          onClose={() => setIsAvatarDialogOpen(false)}
          onSave={handleSaveAvatar}
          isPending={avatarMutation.isPending}
        />
      )}
    </main>
  );
}
