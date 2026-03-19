import { z } from "zod/v4";

export const creditCardSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  bankName: z.string().min(1, "Bank name is required").max(50),
  lastFourDigits: z.string().regex(/^\d{4}$/, "Must be exactly 4 digits"),
  network: z.enum(["visa", "mastercard", "rupay", "amex", "other"]),
  billingCycleStartDay: z
    .number()
    .int()
    .min(1, "Must be 1-28")
    .max(28, "Must be 1-28"),
  billingCycleEndDay: z
    .number()
    .int()
    .min(1, "Must be 1-28")
    .max(28, "Must be 1-28"),
  paymentDueDay: z
    .number()
    .int()
    .min(1, "Must be 1-28")
    .max(28, "Must be 1-28"),
  creditLimit: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  currentBalance: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  status: z.enum(["active", "inactive"]),
});

export type CreditCardFormData = z.infer<typeof creditCardSchema>;
