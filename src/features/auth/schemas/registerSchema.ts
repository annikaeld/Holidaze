import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Username is required")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),

  email: z
    .email("Enter a valid email address")
    .endsWith("@stud.noroff.no", "Email must end with @stud.noroff.no"),

  password: z.string().min(8, "Password must contain at least 8 characters"),

  venueManager: z.boolean(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
