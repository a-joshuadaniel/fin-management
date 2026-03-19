export interface CreditCard {
  id: string;
  nickname: string;
  bankName: string;
  lastFourDigits: string;
  network: "visa" | "mastercard" | "rupay" | "amex" | "other";
  billingCycleStartDay: number;
  billingCycleEndDay: number;
  paymentDueDay: number;
  creditLimit: string;
  currentBalance: string;
  color: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export type CreditCardInput = Omit<
  CreditCard,
  "id" | "createdAt" | "updatedAt"
>;
