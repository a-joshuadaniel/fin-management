"use client";

import Link from "next/link";
import { type LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionSummaryCardProps {
  title: string;
  icon: LucideIcon;
  total: string;
  subLabel: string;
  subValue: string;
  href: string;
  loading?: boolean;
  iconColor?: string;
  iconBg?: string;
}

export function SectionSummaryCard({
  title,
  icon: Icon,
  total,
  subLabel,
  subValue,
  href,
  loading = false,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: SectionSummaryCardProps) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer h-full">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${iconBg}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/50 mt-0.5" />
          </div>
          <div className="mt-3 pl-1">
            {loading ? (
              <div className="h-7 w-24 rounded bg-muted animate-pulse" />
            ) : (
              <p className="text-xl font-bold tabular-nums">{total}</p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-medium">{subLabel}:</span>{" "}
              {loading ? "—" : subValue}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
