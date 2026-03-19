import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";
import { Landmark } from "lucide-react";

export default function LoansPage() {
  return (
    <div>
      <Header
        title="Loans & EMIs"
        description="Track your loan repayments and EMI schedules"
      />
      <div className="p-6">
        <EmptyState
          icon={Landmark}
          title="Coming Soon"
          description="Loan and EMI tracking will be available in a future update. You'll be able to track all your loan repayments, EMI schedules, and interest calculations."
        />
      </div>
    </div>
  );
}
