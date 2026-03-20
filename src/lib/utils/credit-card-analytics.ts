import { differenceInDays, addMonths, isBefore, isAfter, isSameDay } from "date-fns";
import Decimal from "decimal.js";
import type { CreditCard } from "@/lib/types/credit-card";
import { getBillingCycleRange, getDueDate } from "@/lib/utils/date";

// ==================== TYPES ====================

export type UtilizationSeverity = "healthy" | "moderate" | "high" | "critical";

export interface CardUtilization {
  used: Decimal;
  limit: Decimal;
  available: Decimal;
  percentage: number;
  severity: UtilizationSeverity;
}

export interface OverallUtilization {
  totalOutstanding: Decimal;
  totalLimit: Decimal;
  totalAvailable: Decimal;
  overallPercentage: number;
  severity: UtilizationSeverity;
  activeCardCount: number;
}

export type CyclePhase = "billing" | "grace" | "due-today" | "overdue";

export interface CardCyclePhase {
  phase: CyclePhase;
  cycleStart: Date;
  statementDate: Date;
  dueDate: Date;
  daysIntoBillingCycle: number;
  daysLeftInBillingCycle: number;
  billingCycleDays: number;
  gracePeriodDays: number;
  daysUntilDue: number;
  billingProgressPercent: number;
  totalProgressPercent: number;
}

export interface CardRecommendation {
  card: CreditCard;
  interestFreeDays: number;
  phase: CyclePhase;
}

export interface BestCardResult {
  recommended: CreditCard;
  interestFreeDays: number;
  reason: string;
  allCards: CardRecommendation[];
}

export type PaymentUrgency = "overdue" | "due-today" | "urgent" | "this-week" | "upcoming";

export interface UpcomingPayment {
  card: CreditCard;
  dueDate: Date;
  daysUntil: number;
  urgency: PaymentUrgency;
  totalAmountDue: string;
}

export type InsightType = "warning" | "info" | "success";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  cardId?: string;
}

// ==================== UTILIZATION ====================

/**
 * CIBIL utilization severity thresholds.
 * Below 30% is healthy for credit score in India.
 */
function getSeverity(percentage: number): UtilizationSeverity {
  if (percentage < 30) return "healthy";
  if (percentage < 50) return "moderate";
  if (percentage < 75) return "high";
  return "critical";
}

export function getCardUtilization(card: CreditCard): CardUtilization {
  const used = new Decimal(card.currentBalance || "0");
  const limit = new Decimal(card.creditLimit || "0");
  const available = limit.minus(used).clampedTo(0, limit);
  const percentage = limit.isZero() ? 0 : used.div(limit).times(100).toNumber();
  const clampedPct = Math.min(100, Math.max(0, percentage));

  return {
    used,
    limit,
    available,
    percentage: clampedPct,
    severity: getSeverity(clampedPct),
  };
}

export function getOverallUtilization(cards: CreditCard[]): OverallUtilization {
  const activeCards = cards.filter((c) => c.status === "active");

  const totalOutstanding = activeCards.reduce(
    (sum, c) => sum.plus(new Decimal(c.currentBalance || "0")),
    new Decimal(0)
  );
  const totalLimit = activeCards.reduce(
    (sum, c) => sum.plus(new Decimal(c.creditLimit || "0")),
    new Decimal(0)
  );
  const totalAvailable = totalLimit.minus(totalOutstanding).clampedTo(0, totalLimit);
  const overallPercentage = totalLimit.isZero()
    ? 0
    : totalOutstanding.div(totalLimit).times(100).toNumber();
  const clampedPct = Math.min(100, Math.max(0, overallPercentage));

  return {
    totalOutstanding,
    totalLimit,
    totalAvailable,
    overallPercentage: clampedPct,
    severity: getSeverity(clampedPct),
    activeCardCount: activeCards.length,
  };
}

// ==================== BILLING CYCLE PHASE ====================

/**
 * Determines where today falls in a card's billing → grace → due lifecycle.
 *
 * Terminology (per Indian banking standards):
 * - Billing Period: billingCycleStartDay → billingCycleEndDay (charges recorded)
 * - Statement Date: billingCycleEndDay (when bill is generated)
 * - Grace Period: statementDate → dueDate (pay without interest)
 * - Due Date: paymentDueDay (last day to pay total amount due)
 */
export function getCardCyclePhase(card: CreditCard, today: Date): CardCyclePhase {
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonth = addMonths(currentMonth, -1);

  // Check current and previous month cycles to find which one today falls in
  for (const refMonth of [currentMonth, prevMonth]) {
    const { start, end } = getBillingCycleRange(card, refMonth);
    const dueDate = getDueDate(card, refMonth);

    const billingCycleDays = differenceInDays(end, start) + 1;
    const gracePeriodDays = differenceInDays(dueDate, end);

    // Today is within billing period
    if (
      (isAfter(today, start) || isSameDay(today, start)) &&
      (isBefore(today, end) || isSameDay(today, end))
    ) {
      const daysInto = differenceInDays(today, start);
      const daysLeft = differenceInDays(end, today);
      const daysUntilDue = differenceInDays(dueDate, today);
      const billingProgress = billingCycleDays > 0
        ? (daysInto / billingCycleDays) * 100
        : 0;
      const totalDays = billingCycleDays + gracePeriodDays;
      const totalProgress = totalDays > 0 ? (daysInto / totalDays) * 100 : 0;

      return {
        phase: "billing",
        cycleStart: start,
        statementDate: end,
        dueDate,
        daysIntoBillingCycle: daysInto,
        daysLeftInBillingCycle: daysLeft,
        billingCycleDays,
        gracePeriodDays,
        daysUntilDue,
        billingProgressPercent: Math.min(100, billingProgress),
        totalProgressPercent: Math.min(100, totalProgress),
      };
    }

    // Today is in grace period (after statement date, before or on due date)
    if (isAfter(today, end) && (isBefore(today, dueDate) || isSameDay(today, dueDate))) {
      const daysInto = billingCycleDays + differenceInDays(today, end);
      const daysUntilDue = differenceInDays(dueDate, today);
      const totalDays = billingCycleDays + gracePeriodDays;
      const totalProgress = totalDays > 0 ? (daysInto / totalDays) * 100 : 0;

      return {
        phase: isSameDay(today, dueDate) ? "due-today" : "grace",
        cycleStart: start,
        statementDate: end,
        dueDate,
        daysIntoBillingCycle: billingCycleDays,
        daysLeftInBillingCycle: 0,
        billingCycleDays,
        gracePeriodDays,
        daysUntilDue,
        billingProgressPercent: 100,
        totalProgressPercent: Math.min(100, totalProgress),
      };
    }
  }

  // Fallback: compute for current month cycle
  const { start, end } = getBillingCycleRange(card, currentMonth);
  const dueDate = getDueDate(card, currentMonth);
  const billingCycleDays = differenceInDays(end, start) + 1;
  const gracePeriodDays = differenceInDays(dueDate, end);

  return {
    phase: isAfter(today, dueDate) ? "overdue" : "billing",
    cycleStart: start,
    statementDate: end,
    dueDate,
    daysIntoBillingCycle: 0,
    daysLeftInBillingCycle: billingCycleDays,
    billingCycleDays,
    gracePeriodDays,
    daysUntilDue: differenceInDays(dueDate, today),
    billingProgressPercent: 0,
    totalProgressPercent: 0,
  };
}

// ==================== INTEREST-FREE PERIOD ====================

/**
 * How many interest-free days a NEW purchase made today would get.
 *
 * If in billing period: remaining billing days + full grace period
 * If in grace period: only days until due date (purchase goes to NEXT cycle though)
 *
 * Per Indian banking: max ~50 days (purchase on Day 1 of billing cycle),
 * min ~20 days (purchase on last day before statement date).
 */
export function getInterestFreeDays(card: CreditCard, today: Date): number {
  const phase = getCardCyclePhase(card, today);

  if (phase.phase === "billing") {
    // Purchase today gets billed in current cycle statement
    // Interest-free = days left in billing + grace period
    return phase.daysLeftInBillingCycle + phase.gracePeriodDays;
  }

  if (phase.phase === "grace" || phase.phase === "due-today") {
    // Purchase during grace period goes into the NEXT billing cycle
    // So interest-free = remaining grace + next full billing cycle + next grace
    // Simplified: next cycle's full interest-free period
    const nextMonth = addMonths(phase.cycleStart, 1);
    const nextCycle = getBillingCycleRange(card, nextMonth);
    const nextDue = getDueDate(card, nextMonth);
    const nextBillingDays = differenceInDays(nextCycle.end, nextCycle.start) + 1;
    const nextGraceDays = differenceInDays(nextDue, nextCycle.end);
    // Days until next cycle starts + full next cycle interest-free
    const daysUntilNextCycleStart = differenceInDays(nextCycle.start, today);
    return daysUntilNextCycleStart + nextBillingDays + nextGraceDays;
  }

  // Overdue — still compute for next cycle
  return 0;
}

// ==================== BEST CARD RECOMMENDATION ====================

export function getBestCardForPurchases(
  cards: CreditCard[],
  today: Date
): BestCardResult | null {
  const activeCards = cards.filter((c) => c.status === "active");
  if (activeCards.length === 0) return null;

  const allCards: CardRecommendation[] = activeCards.map((card) => ({
    card,
    interestFreeDays: getInterestFreeDays(card, today),
    phase: getCardCyclePhase(card, today).phase,
  }));

  allCards.sort((a, b) => b.interestFreeDays - a.interestFreeDays);

  const best = allCards[0];
  const phase = getCardCyclePhase(best.card, today);

  let reason: string;
  if (phase.phase === "billing" && phase.daysIntoBillingCycle <= 5) {
    reason = `Billing cycle started ${phase.daysIntoBillingCycle} days ago \u2014 ${best.interestFreeDays} days interest-free`;
  } else if (phase.phase === "billing") {
    reason = `${phase.daysLeftInBillingCycle} days left in billing cycle + ${phase.gracePeriodDays} days grace period`;
  } else if (phase.phase === "grace") {
    reason = `In grace period \u2014 new purchases go to next cycle with ${best.interestFreeDays} days interest-free`;
  } else {
    reason = `${best.interestFreeDays} days interest-free period`;
  }

  return {
    recommended: best.card,
    interestFreeDays: best.interestFreeDays,
    reason,
    allCards,
  };
}

// ==================== PAYMENT SCHEDULE ====================

function getPaymentUrgency(daysUntil: number): PaymentUrgency {
  if (daysUntil < 0) return "overdue";
  if (daysUntil === 0) return "due-today";
  if (daysUntil <= 3) return "urgent";
  if (daysUntil <= 7) return "this-week";
  return "upcoming";
}

export function getUpcomingPayments(
  cards: CreditCard[],
  today: Date,
  lookAheadDays: number = 60
): UpcomingPayment[] {
  const activeCards = cards.filter((c) => c.status === "active");
  const payments: UpcomingPayment[] = [];

  for (const card of activeCards) {
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Check previous, current, and next 2 months for due dates
    for (let offset = -1; offset <= 2; offset++) {
      const refMonth = addMonths(currentMonth, offset);
      const dueDate = getDueDate(card, refMonth);
      const daysUntil = differenceInDays(dueDate, today);

      if (daysUntil >= -7 && daysUntil <= lookAheadDays) {
        // Avoid duplicates
        if (!payments.some((p) => p.card.id === card.id && isSameDay(p.dueDate, dueDate))) {
          payments.push({
            card,
            dueDate,
            daysUntil,
            urgency: getPaymentUrgency(daysUntil),
            totalAmountDue: card.currentBalance,
          });
        }
      }
    }
  }

  payments.sort((a, b) => a.daysUntil - b.daysUntil);
  return payments;
}

// ==================== SMART INSIGHTS ====================

export function generateInsights(cards: CreditCard[], today: Date): Insight[] {
  const insights: Insight[] = [];
  const activeCards = cards.filter((c) => c.status === "active");

  if (activeCards.length === 0) return [];

  const overall = getOverallUtilization(cards);

  // Overall utilization health
  if (overall.severity === "healthy") {
    insights.push({
      type: "success",
      title: "CIBIL utilization healthy",
      description: `All cards below 30% utilization (${overall.overallPercentage.toFixed(1)}% overall). Good for your credit score.`,
    });
  } else if (overall.severity === "critical") {
    insights.push({
      type: "warning",
      title: "High credit utilization",
      description: `Overall utilization at ${overall.overallPercentage.toFixed(1)}%. CIBIL recommends below 30%. Consider paying down balances.`,
    });
  }

  // Per-card warnings
  for (const card of activeCards) {
    const util = getCardUtilization(card);
    const phase = getCardCyclePhase(card, today);

    // High utilization on specific card
    if (util.severity === "high" || util.severity === "critical") {
      insights.push({
        type: "warning",
        title: `${card.nickname} at ${util.percentage.toFixed(0)}% utilization`,
        description: `Pay down before statement date (Day ${card.billingCycleEndDay}) to improve CIBIL score.`,
        cardId: card.id,
      });
    }

    // Payment due soon
    if (phase.phase === "grace" && phase.daysUntilDue <= 5 && phase.daysUntilDue > 0) {
      const bal = parseFloat(card.currentBalance || "0");
      insights.push({
        type: "warning",
        title: `${card.nickname} due in ${phase.daysUntilDue} days`,
        description: `Pay total amount due (\u20b9${bal.toLocaleString("en-IN")}) to keep grace period active. Paying only minimum triggers interest on ALL purchases.`,
        cardId: card.id,
      });
    }

    // Due today
    if (phase.phase === "due-today") {
      insights.push({
        type: "warning",
        title: `${card.nickname} payment due TODAY`,
        description: `Pay the total amount due now to avoid late fees and keep your grace period.`,
        cardId: card.id,
      });
    }

    // Overdue
    if (phase.phase === "overdue") {
      insights.push({
        type: "warning",
        title: `${card.nickname} payment overdue`,
        description: `Payment was due ${Math.abs(phase.daysUntilDue)} days ago. Pay immediately to minimize late fees and interest.`,
        cardId: card.id,
      });
    }
  }

  // Best card recommendation
  const best = getBestCardForPurchases(cards, today);
  if (best && best.interestFreeDays > 0) {
    const phase = getCardCyclePhase(best.recommended, today);
    if (phase.phase === "billing" && phase.daysIntoBillingCycle <= 7) {
      insights.push({
        type: "info",
        title: `Use ${best.recommended.nickname} for purchases`,
        description: `Billing cycle started ${phase.daysIntoBillingCycle} days ago \u2014 purchases today get ${best.interestFreeDays} days interest-free.`,
        cardId: best.recommended.id,
      });
    }
  }

  return insights;
}
