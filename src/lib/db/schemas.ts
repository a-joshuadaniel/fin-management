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

export const savingsAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  institution: z.string().min(1, "Institution is required").max(50),
  accountType: z.enum(["savings", "fd", "rd", "ppf", "epf", "other"]),
  balance: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  interestRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate"),
  maturityDate: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  status: z.enum(["active", "inactive"]),
});

export const investmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  platform: z.string().min(1, "Platform is required").max(50),
  investmentType: z.enum([
    "stocks",
    "mf",
    "gold",
    "real_estate",
    "crypto",
    "nps",
    "other",
  ]),
  investedAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  currentValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  units: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  status: z.enum(["active", "inactive"]),
});

export type SavingsAccountFormData = z.infer<typeof savingsAccountSchema>;
export type InvestmentFormData = z.infer<typeof investmentSchema>;
