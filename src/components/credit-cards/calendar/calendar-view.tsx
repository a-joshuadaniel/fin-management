"use client";

import { useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import type { CreditCard } from "@/lib/types/credit-card";
import { isWithinBillingCycle, isDueDate, formatMonth } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarViewProps {
  cards: CreditCard[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({ cards }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date(2026, 0, 1))
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const activeCards = cards.filter((c) => c.status === "active");

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold">{formatMonth(currentMonth)}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const inMonth = isSameMonth(day, currentMonth);
            const today = isToday(day);

            // Find which cards have billing cycle on this day
            const billingCards = activeCards.filter((card) =>
              isWithinBillingCycle(day, card)
            );
            const dueCards = activeCards.filter((card) =>
              isDueDate(day, card)
            );

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative min-h-[72px] border-b border-r p-1",
                  !inMonth && "bg-muted/30"
                )}
              >
                {/* Date number */}
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    !inMonth && "text-muted-foreground/50",
                    today && "bg-primary text-primary-foreground font-bold"
                  )}
                >
                  {format(day, "d")}
                </span>

                {/* Billing cycle indicators */}
                <div className="mt-0.5 flex flex-wrap gap-0.5">
                  {billingCards.map((card) => (
                    <Tooltip key={card.id}>
                      <TooltipTrigger
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: card.color }}
                      />
                      <TooltipContent>
                        <p className="text-xs">{card.nickname}: In billing cycle</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                {/* Due date badges */}
                {dueCards.map((card) => (
                  <Tooltip key={`due-${card.id}`}>
                    <TooltipTrigger
                      className="mt-0.5 block rounded px-1 py-0.5 text-[9px] font-bold text-white truncate"
                      style={{ backgroundColor: card.color }}
                    >
                      DUE
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs font-medium">
                        {card.nickname}: Payment due
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
