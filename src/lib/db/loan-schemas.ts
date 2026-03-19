import { z } from "zod/v4";

export const loanSchema = z.object({
  name: z.string().min(1, "Loan name is required").max(50),
  lender: z.string().min(1, "Lender is required").max(50),
  loanType: z.enum(["home", "personal", "car", "education", "gold", "other"]),
  principalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  outstandingAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  interestRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rate"),
  emiAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  emiDay: z.number().int().min(1, "Must be 1-28").max(28, "Must be 1-28"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalEmis: z.number().int().min(1, "Must be at least 1"),
  emisPaid: z.number().int().min(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color"),
  status: z.enum(["active", "closed"]),
});

export type LoanFormData = z.infer<typeof loanSchema>;
