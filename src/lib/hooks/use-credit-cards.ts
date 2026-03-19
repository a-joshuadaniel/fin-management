"use client";

import { useState, useEffect, useCallback } from "react";
import type { CreditCard, CreditCardInput } from "@/lib/types/credit-card";
import {
  fetchCreditCards,
  createCreditCard as apiCreate,
  updateCreditCard as apiUpdate,
  deleteCreditCard as apiDelete,
} from "@/lib/api/credit-cards";
import { getApiUrl } from "@/lib/api/client";

interface UseCreditCardsReturn {
  cards: CreditCard[];
  loading: boolean;
  error: string | null;
  configured: boolean;
  refresh: () => Promise<void>;
  addCard: (data: CreditCardInput) => Promise<void>;
  editCard: (id: string, data: Partial<CreditCardInput>) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
}

export function useCreditCards(): UseCreditCardsReturn {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  const refresh = useCallback(async () => {
    const url = getApiUrl();
    if (!url) {
      setConfigured(false);
      setLoading(false);
      return;
    }
    setConfigured(true);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCreditCards();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCard = useCallback(
    async (data: CreditCardInput) => {
      await apiCreate(data);
      await refresh();
    },
    [refresh]
  );

  const editCard = useCallback(
    async (id: string, data: Partial<CreditCardInput>) => {
      await apiUpdate(id, data);
      await refresh();
    },
    [refresh]
  );

  const removeCard = useCallback(
    async (id: string) => {
      await apiDelete(id);
      await refresh();
    },
    [refresh]
  );

  return { cards, loading, error, configured, refresh, addCard, editCard, removeCard };
}
