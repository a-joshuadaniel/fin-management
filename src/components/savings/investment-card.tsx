"use client";

import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils/date";
import type { Investment } from "@/lib/types/savings";

interface InvestmentCardProps {
  investment: Investment;
  onEdit: () => void;
  onDelete: () => void;
}

const investmentTypeLabels: Record<Investment["investmentType"], string> = {
  stocks: "Stocks",
  mf: "Mutual Fund",
  gold: "Gold",
  real_estate: "Real Estate",
  crypto: "Crypto",
  nps: "NPS",
  other: "Other",
};

export function InvestmentCard({
  investment,
  onEdit,
  onDelete,
}: InvestmentCardProps) {
  const invested = parseFloat(investment.investedAmount) || 0;
  const current = parseFloat(investment.currentValue) || 0;
  const gainLoss = current - invested;
  const gainLossPct = invested > 0 ? (gainLoss / invested) * 100 : 0;
  const isGain = gainLoss >= 0;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-3 w-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: investment.color }}
          />
          <div className="min-w-0">
            <p className="font-medium truncate">{investment.name}</p>
            <p className="text-xs text-muted-foreground">{investment.platform}</p>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tabular-nums">
            {formatINR(investment.currentValue)}
          </p>
          <p className="text-xs text-muted-foreground">
            Invested: {formatINR(investment.investedAmount)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="secondary" className="text-xs">
            {investmentTypeLabels[investment.investmentType]}
          </Badge>
          {invested > 0 && (
            <div
              className={`flex items-center gap-0.5 text-xs font-medium ${
                isGain
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isGain ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isGain ? "+" : ""}
              {gainLossPct.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
