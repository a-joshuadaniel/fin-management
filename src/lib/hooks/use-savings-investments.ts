"use client";

import { useState, useCallback } from "react";
import type {
  SavingsAccount,
  Investment,
  SavingsInput,
  InvestmentInput,
} from "@/lib/types/savings";

const SAVINGS_KEY = "fin_savings";
const INVESTMENTS_KEY = "fin_investments";

function loadFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useSavingsInvestments() {
  const [savings, setSavings] = useState<SavingsAccount[]>(() =>
    loadFromStorage<SavingsAccount>(SAVINGS_KEY)
  );
  const [investments, setInvestments] = useState<Investment[]>(() =>
    loadFromStorage<Investment>(INVESTMENTS_KEY)
  );

  const addSavingsAccount = useCallback((data: SavingsInput) => {
    const now = new Date().toISOString();
    const account: SavingsAccount = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setSavings((prev) => {
      const next = [...prev, account];
      saveToStorage(SAVINGS_KEY, next);
      return next;
    });
  }, []);

  const editSavingsAccount = useCallback(
    (id: string, data: Partial<SavingsInput>) => {
      setSavings((prev) => {
        const next = prev.map((a) =>
          a.id === id
            ? { ...a, ...data, updatedAt: new Date().toISOString() }
            : a
        );
        saveToStorage(SAVINGS_KEY, next);
        return next;
      });
    },
    []
  );

  const removeSavingsAccount = useCallback((id: string) => {
    setSavings((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveToStorage(SAVINGS_KEY, next);
      return next;
    });
  }, []);

  const addInvestment = useCallback((data: InvestmentInput) => {
    const now = new Date().toISOString();
    const investment: Investment = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setInvestments((prev) => {
      const next = [...prev, investment];
      saveToStorage(INVESTMENTS_KEY, next);
      return next;
    });
  }, []);

  const editInvestment = useCallback(
    (id: string, data: Partial<InvestmentInput>) => {
      setInvestments((prev) => {
        const next = prev.map((i) =>
          i.id === id
            ? { ...i, ...data, updatedAt: new Date().toISOString() }
            : i
        );
        saveToStorage(INVESTMENTS_KEY, next);
        return next;
      });
    },
    []
  );

  const removeInvestment = useCallback((id: string) => {
    setInvestments((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveToStorage(INVESTMENTS_KEY, next);
      return next;
    });
  }, []);

  return {
    savings,
    investments,
    addSavingsAccount,
    editSavingsAccount,
    removeSavingsAccount,
    addInvestment,
    editInvestment,
    removeInvestment,
  };
}
