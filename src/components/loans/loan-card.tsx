"use client";

import type { Loan } from "@/lib/types/loan";
import { formatINR } from "@/lib/utils/date";
import { LOAN_TYPES } from "@/lib/constants/loan-types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LoanCardProps {
  loan: Loan;
  selected?: boolean;
  onClick?: () => void;
}

export function LoanCard({ loan, selected, onClick }: LoanCardProps) {
  const progress = loan.totalEmis > 0 ? (loan.emisPaid / loan.totalEmis) * 100 : 0;
  const typeLabel = LOAN_TYPES.find((t) => t.value === loan.loanType)?.label ?? loan.loanType;
  const emisRemaining = loan.totalEmis - loan.emisPaid;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md cursor-pointer",
        selected && "ring-2 ring-primary"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: loan.color }}
          />
          <div>
            <p className="font-semibold text-sm">{loan.name}</p>
            <p className="text-xs text-muted-foreground">{loan.lender}</p>
          </div>
        </div>
        <Badge variant={loan.status === "active" ? "default" : "secondary"} className="text-[10px]">
          {typeLabel}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{loan.emisPaid}/{loan.totalEmis} EMIs paid</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: loan.color }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">EMI</p>
          <p className="font-medium">{formatINR(loan.emiAmount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Outstanding</p>
          <p className="font-medium">{formatINR(loan.outstandingAmount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Remaining</p>
          <p className="font-medium">{emisRemaining} EMIs</p>
        </div>
      </div>
    </button>
  );
}
