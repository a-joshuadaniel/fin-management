"use client";

import type { CreditCard } from "@/lib/types/credit-card";
import type { CardUtilization } from "@/lib/utils/credit-card-analytics";
import { formatINR } from "@/lib/utils/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UtilizationBreakdownProps {
  utilizations: Array<{
    card: CreditCard;
    utilization: CardUtilization;
  }>;
}

const severityBarColors: Record<string, string> = {
  healthy: "",       // Uses card color
  moderate: "#f59e0b", // Amber
  high: "#f97316",     // Orange
  critical: "#ef4444", // Red
};

export function UtilizationBreakdown({ utilizations }: UtilizationBreakdownProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Credit Utilization (CIBIL)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {utilizations.map(({ card, utilization }) => {
          const barColor =
            utilization.severity === "healthy"
              ? card.color
              : severityBarColors[utilization.severity];

          return (
            <div key={card.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.color }}
                  />
                  <span className="text-sm">{card.nickname}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatINR(utilization.used.toFixed(0))} / {formatINR(utilization.limit.toFixed(0))}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(1, utilization.percentage)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <span className="text-xs font-medium tabular-nums w-10 text-right">
                  {utilization.percentage.toFixed(0)}%
                </span>
              </div>

              {/* CIBIL threshold marker */}
              {utilization.percentage > 0 && (
                <div className="relative h-0.5">
                  <div
                    className="absolute top-0 w-px h-2 bg-muted-foreground/40"
                    style={{ left: "30%" }}
                  />
                </div>
              )}
            </div>
          );
        })}

        <p className="text-[11px] text-muted-foreground pt-1 border-t">
          CIBIL recommends keeping utilization below 30% for a healthy credit score.
        </p>
      </CardContent>
    </Card>
  );
}
