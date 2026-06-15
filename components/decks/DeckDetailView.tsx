"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { AddCardsSection } from "@/components/cards/AddCardsSection";
import { CardListSkeleton } from "@/components/cards/CardListSkeleton";
import { CardRow } from "@/components/cards/CardRow";
import { EditCardModal } from "@/components/cards/EditCardModal";
import { EmptyCards } from "@/components/cards/EmptyCards";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Card as Flashcard, Deck } from "@/lib/types";
import { SWR_KEYS } from "@/lib/swr-keys";

import { RenameDeckForm } from "./RenameDeckForm";

interface CardsResponse {
  cards: Flashcard[];
}

async function fetchCards(url: string): Promise<CardsResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load cards");
  }
  return response.json() as Promise<CardsResponse>;
}

interface DeckDetailViewProps {
  deck: Deck;
}

export function DeckDetailView({ deck: initialDeck }: DeckDetailViewProps) {
  const searchParams = useSearchParams();
  const shouldStartAdding = searchParams.get("add") === "ai" || initialDeck.card_count === 0;
  const [deck, setDeck] = useState(initialDeck);
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);
  const [isAddCardsOpen, setIsAddCardsOpen] = useState(shouldStartAdding);
  const { data, error, isLoading, mutate } = useSWR<CardsResponse>(SWR_KEYS.cards(deck.id), fetchCards);

  const cards = data?.cards ?? [];

  const handleRename = useCallback(async (name: string) => {
    const response = await fetch(SWR_KEYS.deck(deck.id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: deck.description ?? "" }),
    });

    if (!response.ok) {
      throw new Error("Failed to rename deck");
    }

    const payload = (await response.json()) as { deck: Deck };
    setDeck(payload.deck);
  }, [deck.description, deck.id]);

  const handleAddCards = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const handleSaveCard = useCallback(async (front: string, back: string) => {
    if (!cardToEdit) {
      return;
    }

    const response = await fetch(SWR_KEYS.card(deck.id, cardToEdit.id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ front, back }),
    });

    if (!response.ok) {
      throw new Error("Failed to update card");
    }

    await mutate();
  }, [cardToEdit, deck.id, mutate]);

  const handleDeleteCard = useCallback(async () => {
    if (!cardToDelete) {
      return;
    }

    const response = await fetch(SWR_KEYS.card(deck.id, cardToDelete.id), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete card");
    }

    setCardToDelete(null);
    await mutate();
  }, [cardToDelete, deck.id, mutate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <RenameDeckForm deck={deck} onRename={handleRename} />
          {deck.description ? <p className="max-w-2xl text-sm text-white/60">{deck.description}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/study/${deck.id}`} className={buttonVariants({ variant: "default" })}>
            Study
          </Link>
        </div>
      </div>

      <AddCardsSection
        deckId={deck.id}
        onCardsAdded={handleAddCards}
        defaultOpen={shouldStartAdding}
        defaultTab="ai"
        onOpenChange={setIsAddCardsOpen}
      />

      {isLoading ? (
        <CardListSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-900/50 bg-[#2d1b4e] p-6 text-center">
          <p className="text-lg font-semibold">Failed to load cards</p>
          <Button className="mt-4" onClick={() => mutate()}>Retry</Button>
        </div>
      ) : cards.length ? (
        <div className="space-y-3">
          {cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              onEdit={(currentCard) => setCardToEdit(currentCard)}
              onDelete={(currentCard) => setCardToDelete(currentCard)}
            />
          ))}
        </div>
      ) : !isAddCardsOpen ? (
        <EmptyCards />
      ) : null}

      <EditCardModal
        open={cardToEdit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCardToEdit(null);
          }
        }}
        card={cardToEdit}
        onSave={handleSaveCard}
      />

      {cardToDelete ? (
        <div className="flex items-center justify-between rounded-2xl border border-purple-900/50 bg-[#2d1b4e] p-4 text-sm text-white/80">
          <span>Delete &ldquo;{cardToDelete.front}&rdquo;?</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCardToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCard}>Delete</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
