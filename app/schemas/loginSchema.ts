import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
