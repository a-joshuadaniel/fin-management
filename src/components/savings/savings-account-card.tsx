"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils/date";
import type { SavingsAccount } from "@/lib/types/savings";

interface SavingsAccountCardProps {
  account: SavingsAccount;
  onEdit: () => void;
  onDelete: () => void;
}

const accountTypeLabels: Record<SavingsAccount["accountType"], string> = {
  savings: "Savings",
  fd: "Fixed Deposit",
  rd: "Recurring Deposit",
  ppf: "PPF",
  epf: "EPF",
  other: "Other",
};

export function SavingsAccountCard({
  account,
  onEdit,
  onDelete,
}: SavingsAccountCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-3 w-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: account.color }}
          />
          <div className="min-w-0">
            <p className="font-medium truncate">{account.name}</p>
            <p className="text-xs text-muted-foreground">{account.institution}</p>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tabular-nums">
            {formatINR(account.balance)}
          </p>
          {account.interestRate !== "0" && (
            <p className="text-xs text-muted-foreground">
              {account.interestRate}% p.a.
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="secondary" className="text-xs">
            {accountTypeLabels[account.accountType]}
          </Badge>
          {account.maturityDate && (
            <p className="text-[11px] text-muted-foreground">
              Matures: {account.maturityDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
