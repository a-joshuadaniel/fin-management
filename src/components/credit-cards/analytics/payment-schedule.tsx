"use client";

import { format } from "date-fns";
import type { UpcomingPayment } from "@/lib/utils/credit-card-analytics";
import { formatINR } from "@/lib/utils/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentScheduleProps {
  payments: UpcomingPayment[];
}

const urgencyConfig: Record<string, { label: string; className: string }> = {
  overdue: {
    label: "Overdue",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  "due-today": {
    label: "Today",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  urgent: {
    label: "",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  "this-week": {
    label: "",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  upcoming: {
    label: "",
    className: "bg-muted text-muted-foreground",
  },
};

function getUrgencyLabel(payment: UpcomingPayment): string {
  const config = urgencyConfig[payment.urgency];
  if (config.label) return config.label;
  if (payment.daysUntil === 1) return "Tomorrow";
  return `${payment.daysUntil} days`;
}

export function PaymentSchedule({ payments }: PaymentScheduleProps) {
  // Show first 4 upcoming payments
  const visible = payments.slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Upcoming Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No upcoming payments
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((payment, idx) => {
              const config = urgencyConfig[payment.urgency];
              return (
                <div
                  key={`${payment.card.id}-${idx}`}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 ${
                    payment.urgency === "overdue" || payment.urgency === "due-today"
                      ? "bg-red-50 dark:bg-red-950/20"
                      : payment.urgency === "urgent"
                        ? "bg-orange-50 dark:bg-orange-950/20"
                        : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: payment.card.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {payment.card.nickname}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(payment.dueDate, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-medium tabular-nums">
                      {formatINR(payment.totalAmountDue)}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${config.className}`}
                    >
                      {getUrgencyLabel(payment)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
