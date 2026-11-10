import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .endsWith("@stud.noroff.no", "Email must end with @stud.noroff.no"),

  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
