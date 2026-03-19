export interface Loan {
  id: string;
  name: string;
  lender: string;
  loanType: "home" | "personal" | "car" | "education" | "gold" | "other";
  principalAmount: string;
  outstandingAmount: string;
  interestRate: string;
  emiAmount: string;
  emiDay: number;
  startDate: string;
  endDate: string;
  totalEmis: number;
  emisPaid: number;
  color: string;
  status: "active" | "closed";
  createdAt: string;
  updatedAt: string;
}

export type LoanInput = Omit<Loan, "id" | "createdAt" | "updatedAt">;
