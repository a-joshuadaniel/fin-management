"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils/date";

interface NetWorthCardProps {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  loading?: boolean;
}

export function NetWorthCard({
  netWorth,
  totalAssets,
  totalLiabilities,
  loading = false,
}: NetWorthCardProps) {
  const isPositive = netWorth >= 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Net Worth
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="h-10 w-40 rounded bg-muted animate-pulse" />
        ) : (
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
            <span
              className={`text-3xl font-bold tabular-nums ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "" : "-"}
              {formatINR(Math.abs(netWorth).toFixed(0))}
            </span>
          </div>
        )}

        <div className="space-y-2 border-t pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Assets</span>
            <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
              {loading ? "—" : formatINR(totalAssets.toFixed(0))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Liabilities</span>
            <span className="font-medium tabular-nums text-red-600 dark:text-red-400">
              {loading ? "—" : formatINR(totalLiabilities.toFixed(0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
