"use client";

import type { CreditCard } from "@/lib/types/credit-card";
import { CardItem } from "./card-item";
import { Plus } from "lucide-react";

interface CardListProps {
  cards: CreditCard[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function CardList({ cards, selectedId, onSelect, onAdd }: CardListProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-1">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          selected={selectedId === card.id}
          onClick={() => onSelect(card.id)}
        />
      ))}
      <button
        onClick={onAdd}
        className="flex-shrink-0 flex w-72 h-44 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50 cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Plus className="h-8 w-8" />
          <span className="text-sm font-medium">Add Credit Card</span>
        </div>
      </button>
    </div>
  );
}
