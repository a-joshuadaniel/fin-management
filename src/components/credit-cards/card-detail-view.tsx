"use client";

import { useMemo } from "react";
import type { CreditCard } from "@/lib/types/credit-card";
import {
  getCardCyclePhase,
  getCardUtilization,
  generateInsights,
  getInterestFreeDays,
} from "@/lib/utils/credit-card-analytics";
import { formatINR } from "@/lib/utils/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface CardDetailViewProps {
  card: CreditCard;
  allCards: CreditCard[];
}

const severityColors: Record<string, string> = {
  healthy: "#10b981",
  moderate: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const severityBadge: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400",
  moderate: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
  high: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400",
  critical: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
};

const phaseLabels: Record<string, string> = {
  billing: "In Billing Period",
  grace: "In Grace Period",
  "due-today": "Due Today",
  overdue: "Overdue",
};

const phaseColors: Record<string, string> = {
  billing: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",
  grace: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
  "due-today": "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300",
};

const insightConfig = {
  success: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  warning: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20" },
  info: { icon: Info, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/20" },
} as const;

export function CardDetailView({ card, allCards }: CardDetailViewProps) {
  const today = useMemo(() => new Date(), []);

  const { phase, utilization, interestFreeDays, insights } = useMemo(() => {
    const phase = getCardCyclePhase(card, today);
    const utilization = getCardUtilization(card);
    const interestFreeDays = getInterestFreeDays(card, today);
    const allInsights = generateInsights(allCards, today);
    const insights = allInsights.filter(
      (i) => !i.cardId || i.cardId === card.id
    );
    return { phase, utilization, interestFreeDays, insights };
  }, [card, allCards, today]);

  // SVG donut
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, utilization.percentage);
  const offset = circumference * (1 - pct / 100);
  const donutColor = severityColors[utilization.severity];

  // Cycle bar percentages
  const billingWidth = phase.billingProgressPercent;
  const totalWidth = phase.totalProgressPercent;
  const inGrace = phase.phase === "grace" || phase.phase === "due-today";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <div
          className="h-4 w-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: card.color }}
        />
        <div className="flex-1">
          <p className="font-semibold">{card.nickname}</p>
          <p className="text-xs text-muted-foreground">
            {card.bankName} •••• {card.lastFourDigits}
          </p>
        </div>
        <Badge className={phaseColors[phase.phase] + " border-0"}>
          {phaseLabels[phase.phase]}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Utilization donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Credit Utilization</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <svg width="96" height="96" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={donutColor}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold tabular-nums">
                  {pct.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs text-muted-foreground">Used</p>
                <p className="text-sm font-medium tabular-nums">
                  {formatINR(utilization.used.toFixed(0))}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Limit</p>
                <p className="text-sm font-medium tabular-nums">
                  {formatINR(utilization.limit.toFixed(0))}
                </p>
              </div>
              <span
                className={
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                  severityBadge[utilization.severity]
                }
              >
                {utilization.severity.charAt(0).toUpperCase() +
                  utilization.severity.slice(1)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cycle phase */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Bar */}
            <div className="relative h-6 rounded-full overflow-hidden bg-muted">
              {/* Billing period */}
              <div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  width: `${Math.max(2, billingWidth)}%`,
                  backgroundColor: card.color,
                  opacity: inGrace ? 0.35 : 1,
                }}
              />
              {/* Grace period extension */}
              {inGrace && (
                <div
                  className="absolute top-0 h-full"
                  style={{
                    left: `${billingWidth}%`,
                    width: `${Math.max(2, totalWidth - billingWidth)}%`,
                    backgroundColor: card.color,
                    opacity: 0.65,
                  }}
                />
              )}
              {/* Today marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-foreground/80 z-10"
                style={{ left: `${Math.min(98, totalWidth)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Cycle Start</p>
                <p className="text-xs font-medium">
                  {format(phase.cycleStart, "MMM d")}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Statement</p>
                <p className="text-xs font-medium">
                  {format(phase.statementDate, "MMM d")}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Due Date</p>
                <p className="text-xs font-medium">
                  {format(phase.dueDate, "MMM d")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {phase.phase === "billing"
                  ? `${phase.daysLeftInBillingCycle}d left in cycle`
                  : phase.phase === "grace"
                  ? `Grace period — ${phase.daysUntilDue}d left`
                  : phase.phase === "due-today"
                  ? "Payment due today!"
                  : `Overdue by ${Math.abs(phase.daysUntilDue)}d`}
              </span>
              <span className="font-medium text-primary">
                {interestFreeDays}d interest-free
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights for this card */}
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.slice(0, 3).map((insight, idx) => {
            const cfg = insightConfig[insight.type as keyof typeof insightConfig];
            const Icon = cfg.icon;
            return (
              <div
                key={idx}
                className={`flex gap-3 rounded-md p-3 ${cfg.bg}`}
              >
                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
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
      )}
    </div>
  );
}
