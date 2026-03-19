import { apiRequest } from "./client";
import type { Loan, LoanInput } from "@/lib/types/loan";

export async function fetchLoans(): Promise<Loan[]> {
  return apiRequest<Loan[]>("getLoans");
}

export async function createLoan(data: LoanInput): Promise<Loan> {
  return apiRequest<Loan>("createLoan", { loan: data });
}

export async function updateLoan(
  id: string,
  data: Partial<LoanInput>
): Promise<Loan> {
  return apiRequest<Loan>("updateLoan", { id, loan: data });
}

export async function deleteLoan(id: string): Promise<void> {
  await apiRequest<void>("deleteLoan", { id });
}
