"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savingsAccountSchema, type SavingsAccountFormData } from "@/lib/db/schemas";
import type { SavingsAccount } from "@/lib/types/savings";
import { CARD_COLORS } from "@/lib/constants/card-colors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SavingsFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SavingsAccountFormData) => void;
  defaultValues?: Partial<SavingsAccount>;
  mode: "add" | "edit";
}

const accountTypes = [
  { value: "savings", label: "Savings Account" },
  { value: "fd", label: "Fixed Deposit" },
  { value: "rd", label: "Recurring Deposit" },
  { value: "ppf", label: "PPF" },
  { value: "epf", label: "EPF" },
  { value: "other", label: "Other" },
] as const;

export function SavingsFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: SavingsFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SavingsAccountFormData>({
    resolver: zodResolver(savingsAccountSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      institution: defaultValues?.institution ?? "",
      accountType: defaultValues?.accountType ?? "savings",
      balance: defaultValues?.balance ?? "0",
      interestRate: defaultValues?.interestRate ?? "0",
      maturityDate: defaultValues?.maturityDate ?? "",
      color: defaultValues?.color ?? CARD_COLORS[0].value,
      status: defaultValues?.status ?? "active",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        institution: defaultValues?.institution ?? "",
        accountType: defaultValues?.accountType ?? "savings",
        balance: defaultValues?.balance ?? "0",
        interestRate: defaultValues?.interestRate ?? "0",
        maturityDate: defaultValues?.maturityDate ?? "",
        color: defaultValues?.color ?? CARD_COLORS[0].value,
        status: defaultValues?.status ?? "active",
      });
    }
  }, [open, defaultValues, reset]);

  const selectedColor = watch("color");

  const onFormSubmit = (data: SavingsAccountFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Savings Account" : "Edit Savings Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="s-name">Account Name</Label>
              <Input
                id="s-name"
                placeholder="e.g., HDFC Savings"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-institution">Institution</Label>
              <Input
                id="s-institution"
                placeholder="e.g., HDFC Bank"
                {...register("institution")}
              />
              {errors.institution && (
                <p className="text-xs text-destructive">
                  {errors.institution.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="s-type">Account Type</Label>
              <select
                id="s-type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                {...register("accountType")}
              >
                {accountTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-status">Status</Label>
              <select
                id="s-status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                {...register("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="s-balance">Balance (INR)</Label>
              <Input
                id="s-balance"
                placeholder="50000"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-xs text-destructive">
                  {errors.balance.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-rate">Interest Rate (%)</Label>
              <Input
                id="s-rate"
                placeholder="7.1"
                {...register("interestRate")}
              />
              {errors.interestRate && (
                <p className="text-xs text-destructive">
                  {errors.interestRate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-maturity">Maturity Date (optional)</Label>
            <Input
              id="s-maturity"
              placeholder="e.g., 2026-12-31"
              {...register("maturityDate")}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CARD_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue("color", c.value)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform",
                    selectedColor === c.value &&
                      "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "add" ? "Add Account" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
