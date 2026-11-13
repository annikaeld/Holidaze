import { z } from "zod";

export const avatarSchema = z.object({
  url: z
    .url("Please enter a valid image URL.")
    .refine((url) => url.startsWith("https://"), "Image URL must use HTTPS."),
  alt: z
    .string()
    .trim()
    .min(2, "Please describe your avatar.")
    .max(120, "Alt text must be 120 characters or less."),
});

export type AvatarFormData = z.infer<typeof avatarSchema>;
