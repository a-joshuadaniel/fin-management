"use client";

import { useState } from "react";
import { addMonths, subMonths, startOfMonth } from "date-fns";
import type { CreditCard } from "@/lib/types/credit-card";
import { TimelineMonth } from "./timeline-month";
import { TimelineLegend } from "./timeline-legend";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "@/lib/utils/date";

interface TimelineViewProps {
  cards: CreditCard[];
}

export function TimelineView({ cards }: TimelineViewProps) {
  const [startMonth, setStartMonth] = useState(() =>
    startOfMonth(new Date(2026, 0, 1))
  );

  const months = Array.from({ length: 4 }, (_, i) => addMonths(startMonth, i));

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStartMonth(subMonths(startMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {formatMonth(months[0])} — {formatMonth(months[months.length - 1])}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStartMonth(addMonths(startMonth, 1))}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Timeline grid */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <div className="min-w-[800px]">
          {/* Month headers */}
          <div className="grid grid-cols-4 border-b">
            {months.map((month) => (
              <div
                key={month.toISOString()}
                className="border-r last:border-r-0 px-3 py-2 text-center text-sm font-medium"
              >
                {formatMonth(month)}
              </div>
            ))}
          </div>

          {/* Card rows */}
          {cards.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No credit cards added yet
            </div>
          ) : (
            cards
              .filter((c) => c.status === "active")
              .map((card) => (
                <div key={card.id} className="grid grid-cols-4 border-b last:border-b-0">
                  {months.map((month) => (
                    <TimelineMonth
                      key={month.toISOString()}
                      card={card}
                      month={month}
                    />
                  ))}
                </div>
              ))
          )}
        </div>
      </div>

      {/* Legend */}
      {cards.length > 0 && <TimelineLegend cards={cards} />}
    </div>
  );
}
