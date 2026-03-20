"use client";

import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import type { CreditCard } from "@/lib/types/credit-card";
import { isWithinBillingCycle, isDueDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface PaymentMiniCalendarProps {
  cards: CreditCard[];
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function PaymentMiniCalendar({ cards }: PaymentMiniCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const activeCards = cards.filter((c) => c.status === "active");

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [today]);

  const monthYear = format(today, "MMMM yyyy");

  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-sm font-medium mb-3">
        Payment Calendar — {monthYear}
      </p>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium text-muted-foreground pb-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === today.getMonth();
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          const dueCards = isCurrentMonth
            ? activeCards.filter((c) => isDueDate(day, c))
            : [];
          const billingCards = isCurrentMonth
            ? activeCards.filter((c) => isWithinBillingCycle(day, c))
            : [];

          return (
            <div
              key={idx}
              className={cn(
                "relative flex flex-col items-center justify-start rounded-md py-1 min-h-[44px]",
                !isCurrentMonth && "opacity-0 pointer-events-none",
                isCurrentMonth && billingCards.length > 0 && "bg-muted/40",
                isToday && "ring-1 ring-primary"
              )}
            >
              <span
                className={cn(
                  "text-xs leading-none mb-0.5",
                  isToday
                    ? "font-bold text-primary"
                    : "text-foreground/70"
                )}
              >
                {isCurrentMonth ? day.getDate() : ""}
              </span>

              {/* DUE badges */}
              {dueCards.length > 0 && (
                <div className="flex flex-col items-center gap-px w-full px-0.5">
                  {dueCards.map((card) => (
                    <div
                      key={card.id}
                      className="w-full rounded-sm text-[8px] font-bold text-center text-white leading-tight px-0.5 py-px"
                      style={{ backgroundColor: card.color }}
                      title={`${card.nickname} payment due`}
                    >
                      DUE
                    </div>
                  ))}
                </div>
              )}

              {/* Billing cycle dots (when no DUE badge) */}
              {dueCards.length === 0 && billingCards.length > 0 && (
                <div className="flex gap-px flex-wrap justify-center px-1">
                  {billingCards.slice(0, 3).map((card) => (
                    <div
                      key={card.id}
                      className="h-1 w-1 rounded-full opacity-60"
                      style={{ backgroundColor: card.color }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {activeCards.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t pt-2">
          {activeCards.map((card) => (
            <div key={card.id} className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: card.color }}
              />
              <span className="text-[10px] text-muted-foreground">
                {card.nickname}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
