"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { creditCardSchema, type CreditCardFormData } from "@/lib/db/schemas";
import type { CreditCard, CreditCardInput } from "@/lib/types/credit-card";
import { CARD_COLORS, CARD_NETWORKS } from "@/lib/constants/card-colors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DayOfMonthPicker } from "@/components/shared/day-of-month-picker";
import { cn } from "@/lib/utils";

interface CardFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreditCardInput) => Promise<void>;
  defaultValues?: Partial<CreditCard>;
  mode: "add" | "edit";
}

export function CardFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: CardFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      nickname: defaultValues?.nickname ?? "",
      bankName: defaultValues?.bankName ?? "",
      lastFourDigits: defaultValues?.lastFourDigits ?? "",
      network: defaultValues?.network ?? "visa",
      billingCycleStartDay: defaultValues?.billingCycleStartDay ?? 1,
      billingCycleEndDay: defaultValues?.billingCycleEndDay ?? 28,
      paymentDueDay: defaultValues?.paymentDueDay ?? 15,
      creditLimit: defaultValues?.creditLimit ?? "0",
      currentBalance: defaultValues?.currentBalance ?? "0",
      color: defaultValues?.color ?? CARD_COLORS[0].value,
      status: defaultValues?.status ?? "active",
    },
  });

  // Reset form with fresh values whenever dialog opens (fixes edit persistence bug)
  useEffect(() => {
    if (open) {
      reset({
        nickname: defaultValues?.nickname ?? "",
        bankName: defaultValues?.bankName ?? "",
        lastFourDigits: defaultValues?.lastFourDigits ?? "",
        network: defaultValues?.network ?? "visa",
        billingCycleStartDay: defaultValues?.billingCycleStartDay ?? 1,
        billingCycleEndDay: defaultValues?.billingCycleEndDay ?? 28,
        paymentDueDay: defaultValues?.paymentDueDay ?? 15,
        creditLimit: defaultValues?.creditLimit ?? "0",
        currentBalance: defaultValues?.currentBalance ?? "0",
        color: defaultValues?.color ?? CARD_COLORS[0].value,
        status: defaultValues?.status ?? "active",
      });
    }
  }, [open, defaultValues, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedColor = watch("color");
  const startDay = watch("billingCycleStartDay");
  const endDay = watch("billingCycleEndDay");
  const dueDay = watch("paymentDueDay");

  const onFormSubmit = async (data: CreditCardFormData) => {
    await onSubmit(data as CreditCardInput);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Credit Card" : "Edit Credit Card"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Card Identity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="nickname">Card Nickname</Label>
              <Input
                id="nickname"
                placeholder="e.g., Amazon Pay ICICI"
                {...register("nickname")}
              />
              {errors.nickname && (
                <p className="text-xs text-destructive">
                  {errors.nickname.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="e.g., ICICI Bank"
                {...register("bankName")}
              />
              {errors.bankName && (
                <p className="text-xs text-destructive">
                  {errors.bankName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="lastFourDigits">Last 4 Digits</Label>
              <Input
                id="lastFourDigits"
                maxLength={4}
                placeholder="4532"
                {...register("lastFourDigits")}
              />
              {errors.lastFourDigits && (
                <p className="text-xs text-destructive">
                  {errors.lastFourDigits.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="network">Network</Label>
              <select
                id="network"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                {...register("network")}
              >
                {CARD_NETWORKS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Billing Cycle — Day Pickers */}
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-medium">Billing Cycle</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Cycle Start</Label>
                <DayOfMonthPicker
                  value={startDay}
                  onChange={(d) => setValue("billingCycleStartDay", d)}
                  error={errors.billingCycleStartDay?.message}
                />
                {errors.billingCycleStartDay && (
                  <p className="text-xs text-destructive">
                    {errors.billingCycleStartDay.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Statement Date</Label>
                <DayOfMonthPicker
                  value={endDay}
                  onChange={(d) => setValue("billingCycleEndDay", d)}
                  error={errors.billingCycleEndDay?.message}
                />
                {errors.billingCycleEndDay && (
                  <p className="text-xs text-destructive">
                    {errors.billingCycleEndDay.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Due Date</Label>
                <DayOfMonthPicker
                  value={dueDay}
                  onChange={(d) => setValue("paymentDueDay", d)}
                  error={errors.paymentDueDay?.message}
                />
                {errors.paymentDueDay && (
                  <p className="text-xs text-destructive">
                    {errors.paymentDueDay.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="creditLimit">Credit Limit (INR)</Label>
              <Input
                id="creditLimit"
                placeholder="200000"
                {...register("creditLimit")}
              />
              {errors.creditLimit && (
                <p className="text-xs text-destructive">
                  {errors.creditLimit.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="currentBalance">Current Balance (INR)</Label>
              <Input
                id="currentBalance"
                placeholder="15432"
                {...register("currentBalance")}
              />
              {errors.currentBalance && (
                <p className="text-xs text-destructive">
                  {errors.currentBalance.message}
                </p>
              )}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Card Color</Label>
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

          {/* Submit */}
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
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                  ? "Add Card"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
