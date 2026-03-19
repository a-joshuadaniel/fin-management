import { apiRequest } from "./client";
import type { CreditCard, CreditCardInput } from "@/lib/types/credit-card";

export async function fetchCreditCards(): Promise<CreditCard[]> {
  return apiRequest<CreditCard[]>("getCreditCards");
}

export async function createCreditCard(
  data: CreditCardInput
): Promise<CreditCard> {
  return apiRequest<CreditCard>("createCreditCard", { card: data });
}

export async function updateCreditCard(
  id: string,
  data: Partial<CreditCardInput>
): Promise<CreditCard> {
  return apiRequest<CreditCard>("updateCreditCard", { id, card: data });
}

export async function deleteCreditCard(id: string): Promise<void> {
  await apiRequest<void>("deleteCreditCard", { id });
}
