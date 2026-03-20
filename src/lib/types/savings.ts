export interface SavingsAccount {
  id: string;
  name: string;
  institution: string;
  accountType: "savings" | "fd" | "rd" | "ppf" | "epf" | "other";
  balance: string;
  interestRate: string;
  maturityDate?: string;
  color: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  name: string;
  platform: string;
  investmentType:
    | "stocks"
    | "mf"
    | "gold"
    | "real_estate"
    | "crypto"
    | "nps"
    | "other";
  investedAmount: string;
  currentValue: string;
  units?: string;
  color: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export type SavingsInput = Omit<SavingsAccount, "id" | "createdAt" | "updatedAt">;
export type InvestmentInput = Omit<Investment, "id" | "createdAt" | "updatedAt">;
