import { z } from "zod";
import { imageSchema } from "@/shared/schemas/imageSchema";

export const avatarSchema = imageSchema;

export type AvatarFormData = z.infer<typeof avatarSchema>;
