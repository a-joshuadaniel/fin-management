"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { SavingsSummary } from "@/components/savings/savings-summary";
import { SavingsAccountCard } from "@/components/savings/savings-account-card";
import { InvestmentCard } from "@/components/savings/investment-card";
import { SavingsFormDialog } from "@/components/savings/savings-form-dialog";
import { InvestmentFormDialog } from "@/components/savings/investment-form-dialog";
import { useSavingsInvestments } from "@/lib/hooks/use-savings-investments";
import type { SavingsAccountFormData, InvestmentFormData } from "@/lib/db/schemas";
import type { SavingsAccount, Investment } from "@/lib/types/savings";
import { PiggyBank, TrendingUp, Plus } from "lucide-react";

export default function SavingsPage() {
  const {
    savings,
    investments,
    addSavingsAccount,
    editSavingsAccount,
    removeSavingsAccount,
    addInvestment,
    editInvestment,
    removeInvestment,
  } = useSavingsInvestments();

  const [savingsDialogOpen, setSavingsDialogOpen] = useState(false);
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [editingSavings, setEditingSavings] = useState<string | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<string | null>(null);

  const savingsToEdit = savings.find((s) => s.id === editingSavings);
  const investmentToEdit = investments.find((i) => i.id === editingInvestment);

  const { totalSavings, totalInvestments, totalAssets } = useMemo(() => {
    const totalSavings = savings
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + parseFloat(s.balance || "0"), 0);
    const totalInvestments = investments
      .filter((i) => i.status === "active")
      .reduce((sum, i) => sum + parseFloat(i.currentValue || "0"), 0);
    return {
      totalSavings,
      totalInvestments,
      totalAssets: totalSavings + totalInvestments,
    };
  }, [savings, investments]);

  return (
    <div>
      <Header
        title="Savings & Investments"
        description="Track your savings accounts and investment portfolio"
      />

      <div className="space-y-6 p-6">
        <SavingsSummary
          totalSavings={totalSavings}
          totalInvestments={totalInvestments}
          totalAssets={totalAssets}
        />

        <Tabs defaultValue="savings">
          <TabsList>
            <TabsTrigger value="savings">
              Savings ({savings.filter((s) => s.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="investments">
              Investments ({investments.filter((i) => i.status === "active").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="savings" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingSavings(null);
                    setSavingsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Account
                </Button>
              </div>

              {savings.length === 0 ? (
                <EmptyState
                  icon={PiggyBank}
                  title="No savings accounts yet"
                  description="Add your bank accounts, FDs, PPF or other savings to track your balance."
                >
                  <Button
                    onClick={() => {
                      setEditingSavings(null);
                      setSavingsDialogOpen(true);
                    }}
                  >
                    Add First Account
                  </Button>
                </EmptyState>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {savings.map((account) => (
                    <SavingsAccountCard
                      key={account.id}
                      account={account}
                      onEdit={() => {
                        setEditingSavings(account.id);
                        setSavingsDialogOpen(true);
                      }}
                      onDelete={() => {
                        if (confirm(`Delete "${account.name}"?`)) {
                          removeSavingsAccount(account.id);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="investments" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingInvestment(null);
                    setInvestmentDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Investment
                </Button>
              </div>

              {investments.length === 0 ? (
                <EmptyState
                  icon={TrendingUp}
                  title="No investments yet"
                  description="Track your mutual funds, stocks, gold, NPS and other investments."
                >
                  <Button
                    onClick={() => {
                      setEditingInvestment(null);
                      setInvestmentDialogOpen(true);
                    }}
                  >
                    Add First Investment
                  </Button>
                </EmptyState>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {investments.map((investment) => (
                    <InvestmentCard
                      key={investment.id}
                      investment={investment}
                      onEdit={() => {
                        setEditingInvestment(investment.id);
                        setInvestmentDialogOpen(true);
                      }}
                      onDelete={() => {
                        if (confirm(`Delete "${investment.name}"?`)) {
                          removeInvestment(investment.id);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SavingsFormDialog
        open={savingsDialogOpen}
        onClose={() => {
          setSavingsDialogOpen(false);
          setEditingSavings(null);
        }}
        onSubmit={editingSavings
          ? (data: SavingsAccountFormData) => editSavingsAccount(editingSavings, data)
          : (data: SavingsAccountFormData) => addSavingsAccount(data)
        }
        defaultValues={savingsToEdit as SavingsAccount | undefined}
        mode={editingSavings ? "edit" : "add"}
      />

      <InvestmentFormDialog
        open={investmentDialogOpen}
        onClose={() => {
          setInvestmentDialogOpen(false);
          setEditingInvestment(null);
        }}
        onSubmit={editingInvestment
          ? (data: InvestmentFormData) => editInvestment(editingInvestment, data)
          : (data: InvestmentFormData) => addInvestment(data)
        }
        defaultValues={investmentToEdit as Investment | undefined}
        mode={editingInvestment ? "edit" : "add"}
      />
    </div>
  );
}
