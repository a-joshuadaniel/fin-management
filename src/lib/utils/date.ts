import {
  setDate,
  addMonths,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import type { CreditCard } from "@/lib/types/credit-card";

/**
 * Get the billing cycle range for a card in a given reference month.
 * A billing cycle starts on billingCycleStartDay and ends on billingCycleEndDay.
 * If endDay < startDay, the cycle crosses into the next month.
 */
export function getBillingCycleRange(
  card: CreditCard,
  referenceMonth: Date
): { start: Date; end: Date } {
  const year = referenceMonth.getFullYear();
  const month = referenceMonth.getMonth();

  const start = new Date(year, month, card.billingCycleStartDay);
  let end: Date;

  if (card.billingCycleEndDay >= card.billingCycleStartDay) {
    end = new Date(year, month, card.billingCycleEndDay);
  } else {
    // Cycle crosses into next month
    end = new Date(year, month + 1, card.billingCycleEndDay);
  }

  return { start, end };
}

/**
 * Get the payment due date for charges from a billing cycle
 * starting in the given reference month.
 * Due date is in the month AFTER the billing cycle ends.
 */
export function getDueDate(card: CreditCard, referenceMonth: Date): Date {
  const { end } = getBillingCycleRange(card, referenceMonth);
  const dueMonth = addMonths(
    new Date(end.getFullYear(), end.getMonth(), 1),
    card.billingCycleEndDay >= card.billingCycleStartDay ? 1 : 0
  );
  return setDate(dueMonth, card.paymentDueDay);
}

/**
 * Get all days in a given month.
 */
export function getMonthDays(month: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
}

/**
 * Check if a date falls within any billing cycle of a card.
 * Checks both the current month's cycle and the previous month's cycle
 * (in case it extends into this month).
 */
export function isWithinBillingCycle(date: Date, card: CreditCard): boolean {
  const month = new Date(date.getFullYear(), date.getMonth(), 1);
  const prevMonth = addMonths(month, -1);

  for (const refMonth of [prevMonth, month]) {
    const { start, end } = getBillingCycleRange(card, refMonth);
    if (
      isWithinInterval(date, { start, end }) ||
      isSameDay(date, start) ||
      isSameDay(date, end)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a date is a due date for a card.
 */
export function isDueDate(date: Date, card: CreditCard): boolean {
  const month = new Date(date.getFullYear(), date.getMonth(), 1);
  const prevMonth = addMonths(month, -1);
  const prevPrevMonth = addMonths(month, -2);

  for (const refMonth of [prevPrevMonth, prevMonth, month]) {
    const due = getDueDate(card, refMonth);
    if (isSameDay(date, due)) return true;
  }
  return false;
}

/**
 * Get a position fraction (0-1) for a day within a month.
 */
export function getDayPosition(date: Date, monthStart: Date): number {
  const daysInMonth = endOfMonth(monthStart).getDate();
  return (date.getDate() - 1) / (daysInMonth - 1);
}

/**
 * Format currency in Indian format (e.g., 2,00,000.00)
 */
export function formatINR(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a month for display.
 */
export function formatMonth(date: Date): string {
  return format(date, "MMM yyyy");
}
