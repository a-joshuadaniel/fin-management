"use client";

import { PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/utils/date";

interface SavingsSummaryProps {
  totalSavings: number;
  totalInvestments: number;
  totalAssets: number;
}

export function SavingsSummary({
  totalSavings,
  totalInvestments,
  totalAssets,
}: SavingsSummaryProps) {
  const stats = [
    {
      label: "Total Savings",
      value: formatINR(totalSavings.toFixed(0)),
      icon: PiggyBank,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: "Total Investments",
      value: formatINR(totalInvestments.toFixed(0)),
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Total Assets",
      value: formatINR(totalAssets.toFixed(0)),
      icon: Wallet,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold tabular-nums">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
