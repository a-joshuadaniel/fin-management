import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";
import { Receipt } from "lucide-react";

export default function TaxPage() {
  return (
    <div>
      <Header
        title="Income Tax"
        description="Indian income tax planning and ITR preparation"
      />
      <div className="p-6">
        <EmptyState
          icon={Receipt}
          title="Coming Soon"
          description="Income tax management will be available in a future update. You'll be able to plan your taxes under Old and New regimes, track deductions (80C, 80D, HRA, NPS), and prepare for ITR filing."
        />
      </div>
    </div>
  );
}
