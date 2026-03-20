"use client";

import type { OverallUtilization } from "@/lib/utils/credit-card-analytics";
import { formatINR } from "@/lib/utils/date";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CreditCard, Wallet, Gauge } from "lucide-react";

interface CreditHealthSummaryProps {
  overall: OverallUtilization;
}

const severityColors: Record<string, string> = {
  healthy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const severityLabels: Record<string, string> = {
  healthy: "Healthy",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

export function CreditHealthSummary({ overall }: CreditHealthSummaryProps) {
  const stats = [
    {
      label: "Total Outstanding",
      value: formatINR(overall.totalOutstanding.toFixed(0)),
      icon: IndianRupee,
    },
    {
      label: "Total Credit Limit",
      value: formatINR(overall.totalLimit.toFixed(0)),
      icon: CreditCard,
    },
    {
      label: "Available Credit",
      value: formatINR(overall.totalAvailable.toFixed(0)),
      icon: Wallet,
    },
    {
      label: "CIBIL Utilization",
      value: overall.overallPercentage.toFixed(1) + "%",
      icon: Gauge,
      badge: true,
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
              <div className="mt-1 flex items-center gap-2">
                <p className="text-lg font-semibold">{stat.value}</p>
                {stat.badge && (
                  <Badge
                    variant="secondary"
                    className={severityColors[overall.severity]}
                  >
                    {severityLabels[overall.severity]}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
