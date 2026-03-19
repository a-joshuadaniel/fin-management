import { describe, it, expect } from "vitest";
import { creditCardSchema } from "@/lib/db/schemas";

describe("creditCardSchema", () => {
  const validCard = {
    nickname: "Test Card",
    bankName: "Test Bank",
    lastFourDigits: "1234",
    network: "visa",
    billingCycleStartDay: 5,
    billingCycleEndDay: 4,
    paymentDueDay: 20,
    creditLimit: "200000",
    currentBalance: "15432.50",
    color: "#FF6B00",
    status: "active",
  };

  it("accepts valid card data", () => {
    const result = creditCardSchema.safeParse(validCard);
    expect(result.success).toBe(true);
  });

  it("rejects empty nickname", () => {
    const result = creditCardSchema.safeParse({ ...validCard, nickname: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid last four digits", () => {
    const result = creditCardSchema.safeParse({
      ...validCard,
      lastFourDigits: "12",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric last four digits", () => {
    const result = creditCardSchema.safeParse({
      ...validCard,
      lastFourDigits: "abcd",
    });
    expect(result.success).toBe(false);
  });

  it("rejects billing cycle day out of range", () => {
    const result = creditCardSchema.safeParse({
      ...validCard,
      billingCycleStartDay: 29,
    });
    expect(result.success).toBe(false);
  });

  it("rejects billing cycle day below 1", () => {
    const result = creditCardSchema.safeParse({
      ...validCard,
      billingCycleStartDay: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid color hex", () => {
    const result = creditCardSchema.safeParse({ ...validCard, color: "red" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid network", () => {
    const result = creditCardSchema.safeParse({
      ...validCard,
      network: "diners",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid networks", () => {
    for (const network of ["visa", "mastercard", "rupay", "amex", "other"]) {
      const result = creditCardSchema.safeParse({ ...validCard, network });
      expect(result.success).toBe(true);
    }
  });

  it("rejects string numbers for billing cycle days", () => {
    const result = creditCardSchema.safeParse({
      ...validCard,
      billingCycleStartDay: "5",
    });
    expect(result.success).toBe(false);
  });
});
