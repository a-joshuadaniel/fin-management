"use client";

import { useState, useEffect, useCallback } from "react";
import type { Loan, LoanInput } from "@/lib/types/loan";
import {
  fetchLoans,
  createLoan as apiCreate,
  updateLoan as apiUpdate,
  deleteLoan as apiDelete,
} from "@/lib/api/loans";
import { getApiUrl } from "@/lib/api/client";

interface UseLoansReturn {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  configured: boolean;
  refresh: () => Promise<void>;
  addLoan: (data: LoanInput) => Promise<void>;
  editLoan: (id: string, data: Partial<LoanInput>) => Promise<void>;
  removeLoan: (id: string) => Promise<void>;
}

export function useLoans(): UseLoansReturn {
  const [loans, setLoans] = useState<Loan[]>([]);
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
      const data = await fetchLoans();
      setLoans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLoan = useCallback(
    async (data: LoanInput) => {
      await apiCreate(data);
      await refresh();
    },
    [refresh]
  );

  const editLoan = useCallback(
    async (id: string, data: Partial<LoanInput>) => {
      await apiUpdate(id, data);
      await refresh();
    },
    [refresh]
  );

  const removeLoan = useCallback(
    async (id: string) => {
      await apiDelete(id);
      await refresh();
    },
    [refresh]
  );

  return { loans, loading, error, configured, refresh, addLoan, editLoan, removeLoan };
}
