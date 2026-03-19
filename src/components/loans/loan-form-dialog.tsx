"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanSchema, type LoanFormData } from "@/lib/db/loan-schemas";
import type { Loan, LoanInput } from "@/lib/types/loan";
import { LOAN_TYPES, LOAN_COLORS } from "@/lib/constants/loan-types";
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

interface LoanFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LoanInput) => Promise<void>;
  defaultValues?: Partial<Loan>;
  mode: "add" | "edit";
}

export function LoanFormDialog({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: LoanFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      lender: defaultValues?.lender ?? "",
      loanType: defaultValues?.loanType ?? "personal",
      principalAmount: defaultValues?.principalAmount ?? "0",
      outstandingAmount: defaultValues?.outstandingAmount ?? "0",
      interestRate: defaultValues?.interestRate ?? "0",
      emiAmount: defaultValues?.emiAmount ?? "0",
      emiDay: defaultValues?.emiDay ?? 5,
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
      totalEmis: defaultValues?.totalEmis ?? 12,
      emisPaid: defaultValues?.emisPaid ?? 0,
      color: defaultValues?.color ?? LOAN_COLORS[0].value,
      status: defaultValues?.status ?? "active",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedColor = watch("color");

  const onFormSubmit = async (data: LoanFormData) => {
    await onSubmit(data as LoanInput);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Loan / EMI" : "Edit Loan / EMI"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Loan Identity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Loan Name</Label>
              <Input id="name" placeholder="e.g., Home Loan SBI" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lender">Lender</Label>
              <Input id="lender" placeholder="e.g., State Bank of India" {...register("lender")} />
              {errors.lender && <p className="text-xs text-destructive">{errors.lender.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="loanType">Loan Type</Label>
            <select
              id="loanType"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              {...register("loanType")}
            >
              {LOAN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Financials */}
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-medium">Loan Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="principalAmount" className="text-xs">Principal (INR)</Label>
                <Input id="principalAmount" placeholder="500000" {...register("principalAmount")} />
                {errors.principalAmount && <p className="text-xs text-destructive">{errors.principalAmount.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="outstandingAmount" className="text-xs">Outstanding (INR)</Label>
                <Input id="outstandingAmount" placeholder="350000" {...register("outstandingAmount")} />
                {errors.outstandingAmount && <p className="text-xs text-destructive">{errors.outstandingAmount.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="interestRate" className="text-xs">Interest Rate (%)</Label>
                <Input id="interestRate" placeholder="8.5" {...register("interestRate")} />
                {errors.interestRate && <p className="text-xs text-destructive">{errors.interestRate.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="emiAmount" className="text-xs">EMI Amount (INR)</Label>
                <Input id="emiAmount" placeholder="12000" {...register("emiAmount")} />
                {errors.emiAmount && <p className="text-xs text-destructive">{errors.emiAmount.message}</p>}
              </div>
            </div>
          </div>

          {/* EMI Schedule */}
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-medium">EMI Schedule</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="emiDay" className="text-xs">EMI Day (1-28)</Label>
                <Input id="emiDay" type="number" min={1} max={28} {...register("emiDay", { valueAsNumber: true })} />
                {errors.emiDay && <p className="text-xs text-destructive">{errors.emiDay.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="totalEmis" className="text-xs">Total EMIs</Label>
                <Input id="totalEmis" type="number" min={1} {...register("totalEmis", { valueAsNumber: true })} />
                {errors.totalEmis && <p className="text-xs text-destructive">{errors.totalEmis.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="emisPaid" className="text-xs">EMIs Paid</Label>
                <Input id="emisPaid" type="number" min={0} {...register("emisPaid", { valueAsNumber: true })} />
                {errors.emisPaid && <p className="text-xs text-destructive">{errors.emisPaid.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="endDate" className="text-xs">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {LOAN_COLORS.map((c) => (
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Loan" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
