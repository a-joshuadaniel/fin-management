"use client";

import type { Loan } from "@/lib/types/loan";
import { formatINR } from "@/lib/utils/date";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, TrendingDown, Calendar, Percent } from "lucide-react";

interface LoanSummaryProps {
  loans: Loan[];
}

export function LoanSummary({ loans }: LoanSummaryProps) {
  const activeLoans = loans.filter((l) => l.status === "active");

  const totalOutstanding = activeLoans.reduce(
    (sum, l) => sum + parseFloat(l.outstandingAmount || "0"),
    0
  );
  const totalMonthlyEmi = activeLoans.reduce(
    (sum, l) => sum + parseFloat(l.emiAmount || "0"),
    0
  );
  const totalEmisRemaining = activeLoans.reduce(
    (sum, l) => sum + (l.totalEmis - l.emisPaid),
    0
  );
  const avgInterestRate =
    activeLoans.length > 0
      ? activeLoans.reduce((sum, l) => sum + parseFloat(l.interestRate || "0"), 0) /
        activeLoans.length
      : 0;

  const stats = [
    {
      label: "Total Outstanding",
      value: formatINR(totalOutstanding.toFixed(0)),
      icon: IndianRupee,
    },
    {
      label: "Monthly EMI Outflow",
      value: formatINR(totalMonthlyEmi.toFixed(0)),
      icon: TrendingDown,
    },
    {
      label: "EMIs Remaining",
      value: totalEmisRemaining.toString(),
      icon: Calendar,
    },
    {
      label: "Avg Interest Rate",
      value: avgInterestRate.toFixed(1) + "%",
      icon: Percent,
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="mt-1 text-lg font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
