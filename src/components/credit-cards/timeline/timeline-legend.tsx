import type { CreditCard } from "@/lib/types/credit-card";

interface TimelineLegendProps {
  cards: CreditCard[];
}

export function TimelineLegend({ cards }: TimelineLegendProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {cards
        .filter((c) => c.status === "active")
        .map((card) => (
          <div key={card.id} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: card.color }}
            />
            <span className="text-xs text-muted-foreground">
              {card.nickname} ({card.bankName})
            </span>
          </div>
        ))}
      <div className="flex items-center gap-2">
        <div className="h-4 w-1.5 rounded-full bg-muted-foreground" />
        <span className="text-xs text-muted-foreground">Due date</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-6 rounded-sm bg-muted-foreground/40" />
        <span className="text-xs text-muted-foreground">Billing cycle</span>
      </div>
    </div>
  );
}
