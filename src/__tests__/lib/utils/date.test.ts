import { describe, it, expect } from "vitest";
import {
  getBillingCycleRange,
  getDueDate,
  isWithinBillingCycle,
  isDueDate,
  formatINR,
  getMonthDays,
} from "@/lib/utils/date";
import type { CreditCard } from "@/lib/types/credit-card";

const makeCard = (overrides: Partial<CreditCard> = {}): CreditCard => ({
  id: "test-1",
  nickname: "Test Card",
  bankName: "Test Bank",
  lastFourDigits: "1234",
  network: "visa",
  billingCycleStartDay: 5,
  billingCycleEndDay: 4,
  paymentDueDay: 20,
  creditLimit: "100000",
  currentBalance: "5000",
  color: "#FF0000",
  status: "active",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  ...overrides,
});

describe("getBillingCycleRange", () => {
  it("returns cycle within same month when end >= start", () => {
    const card = makeCard({ billingCycleStartDay: 1, billingCycleEndDay: 28 });
    const result = getBillingCycleRange(card, new Date(2026, 0, 1));
    expect(result.start.getDate()).toBe(1);
    expect(result.end.getDate()).toBe(28);
    expect(result.start.getMonth()).toBe(0);
    expect(result.end.getMonth()).toBe(0);
  });

  it("returns cycle crossing month boundary when end < start", () => {
    const card = makeCard({ billingCycleStartDay: 5, billingCycleEndDay: 4 });
    const result = getBillingCycleRange(card, new Date(2026, 0, 1)); // Jan
    expect(result.start.getDate()).toBe(5);
    expect(result.start.getMonth()).toBe(0); // Jan
    expect(result.end.getDate()).toBe(4);
    expect(result.end.getMonth()).toBe(1); // Feb
  });

  it("handles December crossing into January", () => {
    const card = makeCard({ billingCycleStartDay: 15, billingCycleEndDay: 14 });
    const result = getBillingCycleRange(card, new Date(2026, 11, 1)); // Dec
    expect(result.start.getMonth()).toBe(11); // Dec
    expect(result.end.getMonth()).toBe(0); // Jan next year
    expect(result.end.getFullYear()).toBe(2027);
  });
});

describe("getDueDate", () => {
  it("returns due date in the month after billing cycle ends", () => {
    const card = makeCard({
      billingCycleStartDay: 5,
      billingCycleEndDay: 4,
      paymentDueDay: 20,
    });
    // Cycle: Jan 5 - Feb 4, due: Feb 20
    const due = getDueDate(card, new Date(2026, 0, 1));
    expect(due.getMonth()).toBe(1); // Feb
    expect(due.getDate()).toBe(20);
  });
});

describe("isWithinBillingCycle", () => {
  it("returns true for a date within the billing cycle", () => {
    const card = makeCard({ billingCycleStartDay: 5, billingCycleEndDay: 4 });
    // Jan 10 should be in the Jan 5 - Feb 4 cycle
    expect(isWithinBillingCycle(new Date(2026, 0, 10), card)).toBe(true);
  });

  it("returns true for the start day", () => {
    const card = makeCard({ billingCycleStartDay: 5, billingCycleEndDay: 4 });
    expect(isWithinBillingCycle(new Date(2026, 0, 5), card)).toBe(true);
  });

  it("returns true for the end day", () => {
    const card = makeCard({ billingCycleStartDay: 5, billingCycleEndDay: 4 });
    // Feb 4 should be in the Jan 5 - Feb 4 cycle
    expect(isWithinBillingCycle(new Date(2026, 1, 4), card)).toBe(true);
  });
});

describe("isDueDate", () => {
  it("returns true when date matches a due date", () => {
    const card = makeCard({
      billingCycleStartDay: 5,
      billingCycleEndDay: 4,
      paymentDueDay: 20,
    });
    // Jan cycle -> Feb 20 due
    expect(isDueDate(new Date(2026, 1, 20), card)).toBe(true);
  });

  it("returns false for non-due dates", () => {
    const card = makeCard({ paymentDueDay: 20 });
    expect(isDueDate(new Date(2026, 1, 15), card)).toBe(false);
  });
});

describe("formatINR", () => {
  it("formats amounts in INR", () => {
    const result = formatINR("200000");
    expect(result).toContain("2,00,000");
  });

  it("handles zero", () => {
    const result = formatINR("0");
    expect(result).toContain("0");
  });

  it("handles invalid input gracefully", () => {
    expect(formatINR("abc")).toBe("abc");
  });
});

describe("getMonthDays", () => {
  it("returns correct number of days for January", () => {
    const days = getMonthDays(new Date(2026, 0, 1));
    expect(days.length).toBe(31);
  });

  it("returns correct number of days for February 2026 (non-leap)", () => {
    const days = getMonthDays(new Date(2026, 1, 1));
    expect(days.length).toBe(28);
  });
});
