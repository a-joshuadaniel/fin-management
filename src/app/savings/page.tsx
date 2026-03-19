import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";
import { PiggyBank } from "lucide-react";

export default function SavingsPage() {
  return (
    <div>
      <Header
        title="Savings & Investments"
        description="Monitor your savings accounts and investment portfolio"
      />
      <div className="p-6">
        <EmptyState
          icon={PiggyBank}
          title="Coming Soon"
          description="Savings and investment tracking will be available in a future update. You'll be able to monitor all your savings accounts, FDs, mutual funds, and other investments."
        />
      </div>
    </div>
  );
}
