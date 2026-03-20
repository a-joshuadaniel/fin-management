"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { CardList } from "@/components/credit-cards/card-list";
import { CardFormDialog } from "@/components/credit-cards/card-form-dialog";
import { CardDetailView } from "@/components/credit-cards/card-detail-view";
import { PaymentMiniCalendar } from "@/components/credit-cards/payment-mini-calendar";
import { AnalyticsView } from "@/components/credit-cards/analytics/analytics-view";
import { useCreditCards } from "@/lib/hooks/use-credit-cards";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { CreditCard, Settings, Loader2, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import type { CreditCardInput } from "@/lib/types/credit-card";
import { formatINR } from "@/lib/utils/date";

export default function CreditCardsPage() {
  const { cards, loading, error, configured, addCard, editCard, removeCard } =
    useCreditCards();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const cardToEdit = cards.find((c) => c.id === editingCard);

  if (!configured) {
    return (
      <div>
        <Header
          title="Credit Cards"
          description="Manage your credit cards and billing cycles"
        />
        <div className="p-6">
          <EmptyState
            icon={Settings}
            title="API Not Configured"
            description="Set up your Google Apps Script URL in Settings to get started."
          >
            <Link href="/settings">
              <Button>Go to Settings</Button>
            </Link>
          </EmptyState>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Header
          title="Credit Cards"
          description="Manage your credit cards and billing cycles"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header
          title="Credit Cards"
          description="Manage your credit cards and billing cycles"
        />
        <div className="p-6">
          <EmptyState
            icon={CreditCard}
            title="Error Loading Cards"
            description={error}
          >
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </EmptyState>
        </div>
      </div>
    );
  }

  const selected = cards.find((c) => c.id === selectedCard);

  return (
    <div>
      <Header
        title="Credit Cards"
        description="Manage your credit cards and billing cycles"
      />

      <div className="space-y-6 p-6">
        {/* Card list */}
        <CardList
          cards={cards}
          selectedId={selectedCard}
          onSelect={setSelectedCard}
          onAdd={() => {
            setEditingCard(null);
            setDialogOpen(true);
          }}
        />

        {/* Selected card detail bar */}
        {selected && (
          <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
            <div
              className="h-4 w-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: selected.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{selected.nickname}</p>
              <p className="text-sm text-muted-foreground">
                Cycle: Day {selected.billingCycleStartDay} — Day{" "}
                {selected.billingCycleEndDay} | Due: Day{" "}
                {selected.paymentDueDay} | Limit:{" "}
                {formatINR(selected.creditLimit)}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setEditingCard(selected.id);
                  setDialogOpen(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={async () => {
                  if (confirm(`Delete ${selected.nickname}?`)) {
                    await removeCard(selected.id);
                    setSelectedCard(null);
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Per-card detail OR overall analytics */}
        {selected ? (
          <CardDetailView card={selected} allCards={cards} />
        ) : (
          <AnalyticsView cards={cards} />
        )}

        {/* Payment mini-calendar — always visible */}
        <PaymentMiniCalendar cards={cards} />
      </div>

      {/* Add/Edit dialog */}
      <CardFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingCard(null);
        }}
        onSubmit={async (data: CreditCardInput) => {
          if (editingCard) {
            await editCard(editingCard, data);
          } else {
            await addCard(data);
          }
        }}
        defaultValues={cardToEdit ?? undefined}
        mode={editingCard ? "edit" : "add"}
      />
    </div>
  );
}
