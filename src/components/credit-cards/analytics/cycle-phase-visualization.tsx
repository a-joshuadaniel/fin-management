"use client";

import { format } from "date-fns";
import type { CreditCard } from "@/lib/types/credit-card";
import type { CardCyclePhase } from "@/lib/utils/credit-card-analytics";
import { getInterestFreeDays } from "@/lib/utils/credit-card-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface CyclePhaseVisualizationProps {
  phases: Array<{
    card: CreditCard;
    phase: CardCyclePhase;
  }>;
  today: Date;
}

const phaseLabels: Record<string, string> = {
  billing: "Billing Period",
  grace: "Grace Period",
  "due-today": "Due Today",
  overdue: "Overdue",
};

const phaseBadgeColors: Record<string, string> = {
  billing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  grace: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "due-today": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function CyclePhaseVisualization({ phases, today }: CyclePhaseVisualizationProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Billing Cycle vs Payment Cycle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {phases.map(({ card, phase }) => {
          const interestFreeDays = getInterestFreeDays(card, today);
          const totalDays = phase.billingCycleDays + phase.gracePeriodDays;
          const billingWidthPct = totalDays > 0
            ? (phase.billingCycleDays / totalDays) * 100
            : 60;
          const graceWidthPct = totalDays > 0
            ? (phase.gracePeriodDays / totalDays) * 100
            : 40;

          return (
            <div key={card.id} className="space-y-2">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.color }}
                  />
                  <span className="text-sm font-medium">{card.nickname}</span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 ${phaseBadgeColors[phase.phase]}`}
                  >
                    {phaseLabels[phase.phase]}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {interestFreeDays > 0
                    ? `${interestFreeDays} days interest-free`
                    : "No interest-free period"}
                </span>
              </div>

              {/* Phase bar */}
              <div className="relative">
                <div className="flex h-8 rounded-md overflow-hidden border">
                  {/* Billing period section */}
                  <Tooltip>
                    <TooltipTrigger className="contents">
                      <div
                        className="relative flex items-center justify-center text-[10px] font-medium text-white"
                        style={{
                          width: `${billingWidthPct}%`,
                          backgroundColor: card.color,
                          opacity: 0.8,
                        }}
                      >
                        Billing Period
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Billing: {format(phase.cycleStart, "MMM d")} → {format(phase.statementDate, "MMM d")}
                        <br />
                        {phase.billingCycleDays} days — transactions recorded
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Grace period section */}
                  <Tooltip>
                    <TooltipTrigger className="contents">
                      <div
                        className="relative flex items-center justify-center text-[10px] font-medium"
                        style={{
                          width: `${graceWidthPct}%`,
                          backgroundColor: card.color,
                          opacity: 0.25,
                        }}
                      >
                        <span className="text-foreground">Grace Period</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Grace: {format(phase.statementDate, "MMM d")} → {format(phase.dueDate, "MMM d")}
                        <br />
                        {phase.gracePeriodDays} days — pay without interest
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Due date marker */}
                  <Tooltip>
                    <TooltipTrigger className="contents">
                      <div
                        className="flex items-center justify-center text-[10px] font-bold text-white px-2 flex-shrink-0"
                        style={{
                          backgroundColor:
                            phase.phase === "due-today" || phase.phase === "overdue"
                              ? "#ef4444"
                              : "#6b7280",
                          minWidth: "32px",
                        }}
                      >
                        DUE
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Due Date: {format(phase.dueDate, "MMM d, yyyy")}
                        <br />
                        {phase.daysUntilDue > 0
                          ? `${phase.daysUntilDue} days remaining`
                          : phase.daysUntilDue === 0
                            ? "Payment due today!"
                            : `${Math.abs(phase.daysUntilDue)} days overdue`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Today marker */}
                {phase.totalProgressPercent > 0 && phase.totalProgressPercent < 100 && (
                  <div
                    className="absolute top-0 w-0.5 h-full bg-foreground z-10"
                    style={{ left: `${phase.totalProgressPercent}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-foreground" />
                  </div>
                )}
              </div>

              {/* Info row */}
              <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
                <span>
                  {phase.phase === "billing"
                    ? `Day ${phase.daysIntoBillingCycle + 1} of ${phase.billingCycleDays}`
                    : phase.phase === "grace"
                      ? `Grace: ${phase.daysUntilDue} days until due`
                      : phase.phase === "due-today"
                        ? "Payment due today!"
                        : `Overdue by ${Math.abs(phase.daysUntilDue)} days`}
                </span>
                <span>
                  Statement: {format(phase.statementDate, "MMM d")} · Due: {format(phase.dueDate, "MMM d")}
                </span>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex items-center gap-4 pt-2 border-t text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-primary/80" />
            <span>Billing Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-primary/25" />
            <span>Grace Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-gray-500" />
            <span>Due Date</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
