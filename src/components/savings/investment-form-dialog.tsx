"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investmentSchema, type InvestmentFormData } from "@/lib/db/schemas";
import type { Investment } from "@/lib/types/savings";
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

interface InvestmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InvestmentFormData) => void;
  defaultValues?: Partial<Investment>;
  mode: "add" | "edit";
}

const investmentTypes = [
  { value: "stocks", label: "Stocks" },
  { value: "mf", label: "Mutual Fund" },
  { value: "gold", label: "Gold" },
  { value: "real_estate", label: "Real Estate" },
  { value: "crypto", label: "Crypto" },
  { value: "nps", label: "NPS" },
  { value: "other", label: "Other" },
] as const;

export function InvestmentFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: InvestmentFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      platform: defaultValues?.platform ?? "",
      investmentType: defaultValues?.investmentType ?? "mf",
      investedAmount: defaultValues?.investedAmount ?? "0",
      currentValue: defaultValues?.currentValue ?? "0",
      units: defaultValues?.units ?? "",
      color: defaultValues?.color ?? CARD_COLORS[2].value,
      status: defaultValues?.status ?? "active",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        platform: defaultValues?.platform ?? "",
        investmentType: defaultValues?.investmentType ?? "mf",
        investedAmount: defaultValues?.investedAmount ?? "0",
        currentValue: defaultValues?.currentValue ?? "0",
        units: defaultValues?.units ?? "",
        color: defaultValues?.color ?? CARD_COLORS[2].value,
        status: defaultValues?.status ?? "active",
      });
    }
  }, [open, defaultValues, reset]);

  const selectedColor = watch("color");

  const onFormSubmit = (data: InvestmentFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Investment" : "Edit Investment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="i-name">Investment Name</Label>
              <Input
                id="i-name"
                placeholder="e.g., Nifty 50 Index Fund"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="i-platform">Platform</Label>
              <Input
                id="i-platform"
                placeholder="e.g., Zerodha, Groww"
                {...register("platform")}
              />
              {errors.platform && (
                <p className="text-xs text-destructive">
                  {errors.platform.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="i-type">Investment Type</Label>
              <select
                id="i-type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                {...register("investmentType")}
              >
                {investmentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="i-status">Status</Label>
              <select
                id="i-status"
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
              <Label htmlFor="i-invested">Amount Invested (INR)</Label>
              <Input
                id="i-invested"
                placeholder="100000"
                {...register("investedAmount")}
              />
              {errors.investedAmount && (
                <p className="text-xs text-destructive">
                  {errors.investedAmount.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="i-current">Current Value (INR)</Label>
              <Input
                id="i-current"
                placeholder="115000"
                {...register("currentValue")}
              />
              {errors.currentValue && (
                <p className="text-xs text-destructive">
                  {errors.currentValue.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="i-units">Units / Quantity (optional)</Label>
            <Input
              id="i-units"
              placeholder="e.g., 250.5 units"
              {...register("units")}
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
              {mode === "add" ? "Add Investment" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
