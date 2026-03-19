"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { LoanCard } from "@/components/loans/loan-card";
import { LoanFormDialog } from "@/components/loans/loan-form-dialog";
import { LoanSummary } from "@/components/loans/loan-summary";
import { useLoans } from "@/lib/hooks/use-loans";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Landmark, Settings, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { LoanInput } from "@/lib/types/loan";
import { formatINR } from "@/lib/utils/date";
import { LOAN_TYPES } from "@/lib/constants/loan-types";

export default function LoansPage() {
  const { loans, loading, error, configured, addLoan, editLoan, removeLoan } =
    useLoans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

  const loanToEdit = loans.find((l) => l.id === editingLoan);

  if (!configured) {
    return (
      <div>
        <Header title="Loans & EMIs" description="Track your loan repayments and EMI schedules" />
        <div className="p-6">
          <EmptyState icon={Settings} title="API Not Configured" description="Set up your Google Apps Script URL in Settings to get started.">
            <Link href="/settings"><Button>Go to Settings</Button></Link>
          </EmptyState>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Header title="Loans & EMIs" description="Track your loan repayments and EMI schedules" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Loans & EMIs" description="Track your loan repayments and EMI schedules" />
        <div className="p-6">
          <EmptyState icon={Landmark} title="Error Loading Loans" description={error}>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </EmptyState>
        </div>
      </div>
    );
  }

  const selected = loans.find((l) => l.id === selectedLoan);

  return (
    <div>
      <Header title="Loans & EMIs" description="Track your loan repayments and EMI schedules" />

      <div className="space-y-6 p-6">
        {/* Summary cards */}
        {loans.length > 0 && <LoanSummary loans={loans} />}

        {/* Add button */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-muted-foreground">
            {loans.length} {loans.length === 1 ? "Loan" : "Loans"}
          </h3>
          <Button size="sm" onClick={() => { setEditingLoan(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Loan
          </Button>
        </div>

        {/* Loan list */}
        {loans.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No Loans Added"
            description="Add your first loan or EMI to start tracking repayments."
          >
            <Button onClick={() => { setEditingLoan(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add Your First Loan
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                selected={selectedLoan === loan.id}
                onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
              />
            ))}
          </div>
        )}

        {/* Selected loan details */}
        {selected && (
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selected.color }} />
                <div>
                  <p className="font-medium">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.lender}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingLoan(selected.id); setDialogOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={async () => { if (confirm(`Delete ${selected.name}?`)) { await removeLoan(selected.id); setSelectedLoan(null); } }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Type</p>
                <p className="font-medium">{LOAN_TYPES.find((t) => t.value === selected.loanType)?.label}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Principal</p>
                <p className="font-medium">{formatINR(selected.principalAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Interest Rate</p>
                <p className="font-medium">{selected.interestRate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">EMI Day</p>
                <p className="font-medium">{selected.emiDay}th of every month</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Start Date</p>
                <p className="font-medium">{selected.startDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">End Date</p>
                <p className="font-medium">{selected.endDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Progress</p>
                <p className="font-medium">{selected.emisPaid}/{selected.totalEmis} EMIs</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Outstanding</p>
                <p className="font-medium">{formatINR(selected.outstandingAmount)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit dialog */}
      <LoanFormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingLoan(null); }}
        onSubmit={async (data: LoanInput) => {
          if (editingLoan) {
            await editLoan(editingLoan, data);
          } else {
            await addLoan(data);
          }
        }}
        defaultValues={loanToEdit ?? undefined}
        mode={editingLoan ? "edit" : "add"}
      />
    </div>
  );
}
