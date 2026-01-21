    // lib/schemas/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(18, "User must be 18 or older"),
});

// Type inference (stop duplicating types manually)
export type UserInput = z.infer<typeof userSchema>;
