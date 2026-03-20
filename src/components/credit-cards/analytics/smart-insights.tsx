"use client";

import type { Insight } from "@/lib/utils/credit-card-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface SmartInsightsProps {
  insights: Insight[];
}

const insightConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/20",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
};

export function SmartInsights({ insights }: SmartInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {insights.map((insight, idx) => {
            const config = insightConfig[insight.type];
            const Icon = config.icon;

            return (
              <div
                key={idx}
                className={`flex gap-3 rounded-md p-3 ${config.bg}`}
              >
                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
