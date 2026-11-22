import { z } from "zod";
import { imageSchema } from "@/shared/schemas/imageSchema";

export const venueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Venue name is required")
    .max(100, "Venue name must be 100 characters or fewer."),

  description: z.string().trim().min(1, "Description is required"),

  price: z
    .number("Enter a price per night")
    .positive("Price must be greater than 0"),

  maxGuests: z
    .number("Enter the maximum number of guests")
    .int("Maximum guests must be a whole number")
    .min(1, "At least one guest is required"),

  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  media: z.array(imageSchema).min(1, "Add at least one image"),

  meta: z.object({
    wifi: z.boolean(),
    parking: z.boolean(),
    breakfast: z.boolean(),
    pets: z.boolean(),
  }),

  location: z.object({
    country: z.string().trim().min(1, "Country is required"),
    city: z.string(),
    address: z.string(),
  }),
});

export type VenueFormData = z.infer<typeof venueSchema>;
