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
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio ?? "");

  const avatarMutation = useMutation({
    networkMode: "always",
    mutationFn: (data: AvatarFormData) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return updateProfile(user.name, user.accessToken, {
        avatar: data,
      });
    },
  });

  async function handleSaveAvatar(data: AvatarFormData): Promise<void> {
    if (!user) return;

    const response = await avatarMutation.mutateAsync(data).catch(() => null);
    if (!response) return;

    login({
      ...user,
      avatar: response.data.avatar,
    });
    setIsAvatarDialogOpen(false);
    toast.success("Your avatar has been updated.");
  }

  const bioMutation = useMutation({
    networkMode: "always",
    mutationFn: (newBio: string) => {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      return updateProfile(user.name, user.accessToken, {
        bio: newBio,
      });
    },
  });

  async function handleSaveBio() {
    if (!user) return;

    try {
      const response = await bioMutation.mutateAsync(bio.trim());

      login({
        ...user,
        bio: response.data.bio,
      });

      setBio(response.data.bio);
      setIsEditingBio(false);
      toast.success("Your bio has been updated.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update bio. Please try again.",
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
              onClick={() => {
                avatarMutation.reset();
                setIsAvatarDialogOpen(true);
              }}
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
        <div className="mt-6 border-t border-card-border pt-4">
          <h3 className="text-sm font-semibold">About me</h3>

          {isEditingBio ? (
            <div className="mt-3">
              <label htmlFor="profile-bio" className="sr-only">
                About me
              </label>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={160}
                rows={4}
                className="w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {bio.length}/160 characters
              </p>

              <div className="mt-3 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setBio(user.bio ?? "");
                    setIsEditingBio(false);
                  }}
                  disabled={bioMutation.isPending}
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-field-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveBio}
                  disabled={bioMutation.isPending}
                  className="btn-primary btn-primary-compact"
                >
                  {bioMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                {user.bio || "No bio added yet"}
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingBio(true)}
                  className="cursor-pointer text-sm font-medium text-heading underline underline-offset-4 hover:text-primary"
                >
                  {user.bio ? "Edit" : "Add bio"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-6">
        <Link
          to="/my-bookings"
          className="text-sm font-medium text-heading underline underline-offset-4 hover:text-primary"
        >
          My bookings
        </Link>

        <Link
          to={user.venueManager ? "/my-venues" : "/list-venue"}
          className="text-sm font-medium text-heading underline underline-offset-4 hover:text-primary"
        >
          {user.venueManager ? "My venues" : "Become a venue manager"}
        </Link>
      </div>
      {isAvatarDialogOpen && (
        <EditAvatarDialog
          currentAvatar={user.avatar}
          onClose={() => setIsAvatarDialogOpen(false)}
          onSave={handleSaveAvatar}
          isPending={avatarMutation.isPending}
          errorMessage={avatarMutation.error?.message}
        />
      )}
    </main>
  );
}
