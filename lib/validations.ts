import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Za-z]/, "Password must include at least one letter")
  .regex(/\d/, "Password must include at least one number");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: passwordSchema,
});

export const deckSchema = z.object({
  name: z.string().trim().min(1, "Deck name is required").max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const cardSchema = z.object({
  front: z.string().trim().min(1, "Front is required").max(500),
  back: z.string().trim().min(1, "Back is required").max(500),
});

export const generateSchema = z.object({
  sourceText: z.string().trim().min(50, "Source text must be at least 50 characters").max(10000),
  count: z.coerce.number().int().min(1).max(20).default(5),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type DeckValues = z.infer<typeof deckSchema>;
export type CardValues = z.infer<typeof cardSchema>;
export type GenerateValues = z.infer<typeof generateSchema>;
