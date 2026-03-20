"use client";

import { useMemo } from "react";
import { Header } from "@/components/layout/header";
import { NetWorthCard } from "@/components/dashboard/net-worth-card";
import { HealthScoreRing } from "@/components/dashboard/health-score-ring";
import { SectionSummaryCard } from "@/components/dashboard/section-summary-card";
import { useCreditCards } from "@/lib/hooks/use-credit-cards";
import { useLoans } from "@/lib/hooks/use-loans";
import { useSavingsInvestments } from "@/lib/hooks/use-savings-investments";
import {
  getOverallUtilization,
  getUpcomingPayments,
} from "@/lib/utils/credit-card-analytics";
import { formatINR } from "@/lib/utils/date";
import { format } from "date-fns";
import { CreditCard, Landmark, PiggyBank, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { cards, loading: ccLoading, configured: ccConfigured } = useCreditCards();
  const { loans, loading: loansLoading } = useLoans();
  const { savings, investments } = useSavingsInvestments();

  const today = useMemo(() => new Date(), []);
  const loading = ccLoading || loansLoading;

  const metrics = useMemo(() => {
    const overall = getOverallUtilization(cards);

    const totalLoanDebt = loans
      .filter((l) => l.status === "active")
      .reduce((s, l) => s + parseFloat(l.outstandingAmount || "0"), 0);

    const totalSavingsBalance = savings
      .filter((s) => s.status === "active")
      .reduce((s, a) => s + parseFloat(a.balance || "0"), 0);

    const totalInvestmentValue = investments
      .filter((i) => i.status === "active")
      .reduce((s, i) => s + parseFloat(i.currentValue || "0"), 0);

    const totalAssets = totalSavingsBalance + totalInvestmentValue;
    const totalLiabilities =
      overall.totalOutstanding.toNumber() + totalLoanDebt;
    const netWorth = totalAssets - totalLiabilities;

    // Upcoming credit card payments (next 3)
    const payments = getUpcomingPayments(cards, today).slice(0, 3);

    // Active loans EMI
    const activeLoans = loans.filter((l) => l.status === "active");
    const totalEmiOutflow = activeLoans.reduce(
      (s, l) => s + parseFloat(l.emiAmount || "0"),
      0
    );

    // Next loan EMI date
    const nextEmi = activeLoans
      .map((l) => {
        const emiDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          l.emiDay
        );
        if (emiDate < today) emiDate.setMonth(emiDate.getMonth() + 1);
        return { loan: l, emiDate };
      })
      .sort((a, b) => a.emiDate.getTime() - b.emiDate.getTime())[0];

    // Financial health score (0-100)
    // CIBIL utilization: <30% → 40pts, 30-50% → 25pts, 50-75% → 10pts, >75% → 0pts
    const utilizationScore =
      overall.overallPercentage < 30
        ? 40
        : overall.overallPercentage < 50
        ? 25
        : overall.overallPercentage < 75
        ? 10
        : 0;

    // Loan-to-assets ratio score
    const ltsRatio =
      totalAssets > 0
        ? totalLiabilities / totalAssets
        : totalLiabilities > 0
        ? 1
        : 0;
    const ltsScore =
      ltsRatio < 0.3 ? 40 : ltsRatio < 0.6 ? 25 : ltsRatio < 1 ? 10 : 0;

    // Savings present bonus
    const savingsBonus = totalSavingsBalance > 0 ? 20 : 0;

    const healthScore = Math.min(100, utilizationScore + ltsScore + savingsBonus);

    return {
      overall,
      totalLoanDebt,
      totalSavingsBalance,
      totalInvestmentValue,
      totalAssets,
      totalLiabilities,
      netWorth,
      payments,
      totalEmiOutflow,
      nextEmi,
      healthScore,
      activeLoans: activeLoans.length,
    };
  }, [cards, loans, savings, investments, today]);

  const notConfigured = !ccConfigured && !ccLoading;

  return (
    <div>
      <Header
        title="Dashboard"
        description="Your complete financial picture"
      />

      <div className="p-6 space-y-6">
        {/* Main layout: left health hub | right section summaries */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left column: net worth + health score + obligations */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <NetWorthCard
                netWorth={metrics.netWorth}
                totalAssets={metrics.totalAssets}
                totalLiabilities={metrics.totalLiabilities}
                loading={loading}
              />
              <div className="flex items-center justify-center rounded-lg border bg-card p-4">
                <HealthScoreRing score={loading ? 0 : metrics.healthScore} />
              </div>
            </div>

            {/* Monthly obligations */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Obligations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Credit card upcoming payments */}
                {metrics.payments.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Credit Card Payments
                    </p>
                    {metrics.payments.map((p) => (
                      <div
                        key={p.card.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: p.card.color }}
                          />
                          <span className="text-sm">{p.card.nickname}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium tabular-nums">
                            {formatINR(p.totalAmountDue)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {format(p.dueDate, "MMM d")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notConfigured ? (
                  <p className="text-xs text-muted-foreground">
                    Configure API in{" "}
                    <a href="/settings" className="underline underline-offset-2">
                      Settings
                    </a>{" "}
                    to see credit card payments.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No upcoming credit card payments.
                  </p>
                )}

                {/* Loan EMI */}
                {metrics.totalEmiOutflow > 0 && (
                  <div className="space-y-2 border-t pt-3">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Loan EMIs
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {metrics.activeLoans} active loan
                        {metrics.activeLoans !== 1 ? "s" : ""}
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {formatINR(metrics.totalEmiOutflow.toFixed(0))}/mo
                      </span>
                    </div>
                    {metrics.nextEmi && (
                      <p className="text-xs text-muted-foreground">
                        Next EMI: {metrics.nextEmi.loan.name} on{" "}
                        {format(metrics.nextEmi.emiDate, "MMM d")}
                      </p>
                    )}
                  </div>
                )}

                {metrics.payments.length === 0 &&
                  metrics.totalEmiOutflow === 0 &&
                  !notConfigured && (
                    <p className="text-xs text-muted-foreground">
                      No upcoming obligations this month.
                    </p>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: section summary cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <SectionSummaryCard
              title="Credit Cards"
              icon={CreditCard}
              total={
                notConfigured
                  ? "Set up →"
                  : formatINR(metrics.overall.totalOutstanding.toFixed(0))
              }
              subLabel="Utilization"
              subValue={`${metrics.overall.overallPercentage.toFixed(0)}% of ${formatINR(
                metrics.overall.totalLimit.toFixed(0)
              )}`}
              href="/credit-cards"
              loading={ccLoading}
              iconColor="text-orange-600 dark:text-orange-400"
              iconBg="bg-orange-50 dark:bg-orange-950/20"
            />
            <SectionSummaryCard
              title="Loans & EMIs"
              icon={Landmark}
              total={formatINR(metrics.totalLoanDebt.toFixed(0))}
              subLabel="Monthly EMI"
              subValue={
                metrics.totalEmiOutflow > 0
                  ? `${formatINR(metrics.totalEmiOutflow.toFixed(0))}/mo`
                  : "No active loans"
              }
              href="/loans"
              loading={loansLoading}
              iconColor="text-blue-600 dark:text-blue-400"
              iconBg="bg-blue-50 dark:bg-blue-950/20"
            />
            <SectionSummaryCard
              title="Savings & Investments"
              icon={PiggyBank}
              total={formatINR(metrics.totalAssets.toFixed(0))}
              subLabel="Investments"
              subValue={formatINR(metrics.totalInvestmentValue.toFixed(0))}
              href="/savings"
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-50 dark:bg-emerald-950/20"
            />
            <SectionSummaryCard
              title="Income Tax"
              icon={Receipt}
              total="Coming soon"
              subLabel="FY"
              subValue="2025–26"
              href="/tax"
              iconColor="text-violet-600 dark:text-violet-400"
              iconBg="bg-violet-50 dark:bg-violet-950/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
