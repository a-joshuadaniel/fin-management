"use client";

import { useMemo } from "react";
import type { CreditCard } from "@/lib/types/credit-card";
import {
  getOverallUtilization,
  getCardUtilization,
  getCardCyclePhase,
  getBestCardForPurchases,
  getUpcomingPayments,
  generateInsights,
} from "@/lib/utils/credit-card-analytics";
import { CreditHealthSummary } from "./credit-health-summary";
import { CyclePhaseVisualization } from "./cycle-phase-visualization";
import { BestCardPicker } from "./best-card-picker";
import { PaymentSchedule } from "./payment-schedule";
import { UtilizationBreakdown } from "./utilization-breakdown";
import { SmartInsights } from "./smart-insights";

interface AnalyticsViewProps {
  cards: CreditCard[];
}

export function AnalyticsView({ cards }: AnalyticsViewProps) {
  const today = useMemo(() => new Date(), []);
  const activeCards = useMemo(
    () => cards.filter((c) => c.status === "active"),
    [cards]
  );

  const analytics = useMemo(() => {
    const overall = getOverallUtilization(cards);

    const utilizations = activeCards.map((card) => ({
      card,
      utilization: getCardUtilization(card),
    }));

    const phases = activeCards.map((card) => ({
      card,
      phase: getCardCyclePhase(card, today),
    }));

    const phaseMap = new Map(phases.map(({ card, phase }) => [card.id, phase]));

    const bestCard = getBestCardForPurchases(cards, today);
    const payments = getUpcomingPayments(cards, today);
    const insights = generateInsights(cards, today);

    return { overall, utilizations, phases, phaseMap, bestCard, payments, insights };
  }, [cards, activeCards, today]);

  if (activeCards.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <p className="text-sm">Add credit cards to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <CreditHealthSummary overall={analytics.overall} />

      {/* Billing cycle visualization - full width */}
      <CyclePhaseVisualization phases={analytics.phases} today={today} />

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {analytics.bestCard && (
            <BestCardPicker
              recommendation={analytics.bestCard}
              phases={analytics.phaseMap}
            />
          )}
          <UtilizationBreakdown utilizations={analytics.utilizations} />
        </div>
        <div className="space-y-6">
          <PaymentSchedule payments={analytics.payments} />
        </div>
      </div>

      {/* Smart insights - full width */}
      <SmartInsights insights={analytics.insights} />
    </div>
  );
}
