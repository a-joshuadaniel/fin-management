"use client";

import { endOfMonth } from "date-fns";
import type { CreditCard } from "@/lib/types/credit-card";
import { getBillingCycleRange, getDueDate } from "@/lib/utils/date";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, addMonths } from "date-fns";

interface TimelineMonthProps {
  card: CreditCard;
  month: Date;
}

export function TimelineMonth({ card, month }: TimelineMonthProps) {
  const daysInMonth = endOfMonth(month).getDate();
  const monthStart = month.getTime();
  const monthEnd = endOfMonth(month).getTime();

  // Check current month's cycle and previous month's cycle
  const cycles = [month, addMonths(month, -1)].map((refMonth) => {
    const { start, end } = getBillingCycleRange(card, refMonth);
    return { start, end, refMonth };
  });

  // Calculate bar positions for this month
  const bars: { left: number; width: number; refMonth: Date }[] = [];

  for (const cycle of cycles) {
    const cycleStart = cycle.start.getTime();
    const cycleEnd = cycle.end.getTime();

    // Check if this cycle overlaps with this month
    if (cycleEnd < monthStart || cycleStart > monthEnd) continue;

    const clampedStart = Math.max(cycleStart, monthStart);
    const clampedEnd = Math.min(cycleEnd, monthEnd);

    const startDay = new Date(clampedStart).getDate();
    const endDay = new Date(clampedEnd).getDate();

    const left = ((startDay - 1) / daysInMonth) * 100;
    const width = ((endDay - startDay + 1) / daysInMonth) * 100;

    bars.push({ left, width, refMonth: cycle.refMonth });
  }

  // Check if due date falls in this month
  const dueDates: Date[] = [];
  for (const refMonth of [addMonths(month, -2), addMonths(month, -1), month]) {
    const due = getDueDate(card, refMonth);
    if (
      due.getMonth() === month.getMonth() &&
      due.getFullYear() === month.getFullYear()
    ) {
      dueDates.push(due);
    }
  }

  return (
    <div className="relative h-12 border-r last:border-r-0">
      {/* Billing cycle bars */}
      {bars.map((bar, i) => (
        <Tooltip key={i}>
          <TooltipTrigger
            className="absolute top-2 h-4 rounded-sm opacity-60 hover:opacity-80 transition-opacity"
            style={{
              left: `${bar.left}%`,
              width: `${Math.max(bar.width, 2)}%`,
              backgroundColor: card.color,
            }}
          />
          <TooltipContent>
            <p className="text-xs">
              {card.nickname}: Billing cycle
            </p>
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Due date markers */}
      {dueDates.map((due, i) => {
        const pos = ((due.getDate() - 1) / daysInMonth) * 100;
        return (
          <Tooltip key={`due-${i}`}>
            <TooltipTrigger
              className="absolute top-1 h-6 w-1.5 rounded-full"
              style={{
                left: `${pos}%`,
                backgroundColor: card.color,
              }}
            />
            <TooltipContent>
              <p className="text-xs font-medium">
                {card.nickname}: Due {format(due, "MMM d")}
              </p>
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* Card label */}
      <span
        className="absolute bottom-0.5 left-1 text-[10px] truncate max-w-[90%]"
        style={{ color: card.color }}
      >
        {card.nickname}
      </span>
    </div>
  );
}
