"use client";

import type { BestCardResult, CardCyclePhase } from "@/lib/utils/credit-card-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BestCardPickerProps {
  recommendation: BestCardResult;
  phases: Map<string, CardCyclePhase>;
}

export function BestCardPicker({ recommendation, phases }: BestCardPickerProps) {
  const { recommended, interestFreeDays, reason, allCards } = recommendation;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Best Card for Purchases Today
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Highlighted recommendation */}
        <div
          className="rounded-lg border-2 p-4 space-y-2"
          style={{ borderColor: recommended.color + "80" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-3.5 w-3.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: recommended.color }}
            />
            <span className="font-medium text-sm">{recommended.nickname}</span>
            <span className="text-xs text-muted-foreground">{recommended.bankName}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums">{interestFreeDays}</span>
            <span className="text-sm text-muted-foreground">days interest-free</span>
          </div>
          <p className="text-xs text-muted-foreground">{reason}</p>
        </div>

        {/* All cards ranked */}
        {allCards.length > 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">All cards ranked</p>
            {allCards.map(({ card, interestFreeDays: days, phase }, idx) => (
              <div
                key={card.id}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{idx + 1}.</span>
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.color }}
                  />
                  <span className="text-sm">{card.nickname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs tabular-nums">
                    {days}d
                  </Badge>
                  <span className="text-[10px] text-muted-foreground w-14 text-right capitalize">
                    {phase === "due-today" ? "Due" : phase}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
