"use client";

import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DayOfMonthPickerProps {
  value: number;
  onChange: (day: number) => void;
  label?: string;
  error?: string;
}

const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export function DayOfMonthPicker({
  value,
  onChange,
  error,
}: DayOfMonthPickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          error && "border-destructive"
        )}
      >
        <CalendarDays className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
        <span>Day {value}</span>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" side="bottom" align="start">
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => onChange(day)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors hover:bg-accent",
                value === day &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary ring-offset-1"
              )}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="mt-2 border-t pt-2 text-[11px] text-muted-foreground">
          Days 1–28 (month-safe)
        </p>
      </PopoverContent>
    </Popover>
  );
}
