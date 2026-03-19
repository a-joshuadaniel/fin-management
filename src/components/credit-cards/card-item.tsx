"use client";

import type { CreditCard } from "@/lib/types/credit-card";
import { formatINR } from "@/lib/utils/date";
import { cn } from "@/lib/utils";
import { Wifi } from "lucide-react";

interface CardItemProps {
  card: CreditCard;
  selected?: boolean;
  onClick?: () => void;
}

export function CardItem({ card, selected, onClick }: CardItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex-shrink-0 w-72 h-44 rounded-2xl p-5 text-white shadow-lg transition-all hover:scale-[1.02] cursor-pointer text-left",
        selected && "ring-2 ring-white ring-offset-2 ring-offset-background"
      )}
      style={{
        background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`,
      }}
    >
      {/* Bank name */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium opacity-90">{card.bankName}</span>
        <Wifi className="h-4 w-4 opacity-70 rotate-90" />
      </div>

      {/* Card number */}
      <div className="mt-6 font-mono text-lg tracking-widest">
        •••• •••• •••• {card.lastFourDigits}
      </div>

      {/* Nickname and network */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] opacity-70 uppercase">Card Name</p>
          <p className="text-sm font-medium">{card.nickname}</p>
        </div>
        <span className="text-xs font-semibold uppercase opacity-80">
          {card.network}
        </span>
      </div>

      {/* Balance badge */}
      <div className="absolute top-4 right-4 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
        {formatINR(card.currentBalance)}
      </div>
    </button>
  );
}
