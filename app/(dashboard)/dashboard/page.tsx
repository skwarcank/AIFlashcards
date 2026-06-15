"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { DeleteDeckDialog } from "@/components/decks/DeleteDeckDialog";
import { DeckGridSkeleton } from "@/components/decks/DeckGridSkeleton";
import { DeckGrid } from "@/components/decks/DeckGrid";
import { EmptyDecks } from "@/components/decks/EmptyDecks";
import { NewDeckModal } from "@/components/decks/NewDeckModal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { Deck } from "@/lib/types";
import { SWR_KEYS } from "@/lib/swr-keys";
import type { DeckValues } from "@/lib/validations";

interface DecksResponse {
  decks: Deck[];
}

interface CreateDeckResponse {
  deck: Deck;
}

async function fetchDecks(url: string): Promise<DecksResponse> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load decks");
  }
  return response.json() as Promise<DecksResponse>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { data, error, isLoading, mutate } = useSWR<DecksResponse>(SWR_KEYS.decks, fetchDecks);
  const [isNewDeckOpen, setIsNewDeckOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);

  const decks = data?.decks ?? [];

  const handleCreateDeck = useCallback(async (values: DeckValues) => {
    const response = await fetch(SWR_KEYS.decks, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Failed to create deck");
    }

    const { deck } = await response.json() as CreateDeckResponse;
    await mutate();
    router.push(`/decks/${deck.id}?add=ai`);
  }, [mutate, router]);

  const handleDeleteDeck = useCallback(async () => {
    if (!deckToDelete) {
      return;
    }

    const response = await fetch(SWR_KEYS.deck(deckToDelete.id), { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete deck");
    }

    setDeckToDelete(null);
    await mutate();
  }, [deckToDelete, mutate]);

  let content;

  if (isLoading) {
    content = <DeckGridSkeleton />;
  } else if (error) {
    content = (
      <div className="rounded-2xl border border-red-900/50 bg-[#2d1b4e] p-6 text-center">
        <p className="text-lg font-semibold">{t("decks.loadFailed")}</p>
        <Button className="mt-4" onClick={() => mutate()}>{t("common.retry")}</Button>
      </div>
    );
  } else if (!decks.length) {
    content = <EmptyDecks onNewDeck={() => setIsNewDeckOpen(true)} />;
  } else {
    content = <DeckGrid decks={decks} onNewDeck={() => setIsNewDeckOpen(true)} onDeleteDeck={setDeckToDelete} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{t("decks.title")}</h2>
          <p className="text-sm text-white/60">{t("decks.subtitle")}</p>
        </div>
        <Button onClick={() => setIsNewDeckOpen(true)}>{t("decks.new")}</Button>
      </div>

      {content}

      <NewDeckModal
        open={isNewDeckOpen}
        onOpenChange={setIsNewDeckOpen}
        onSubmit={handleCreateDeck}
      />

      <DeleteDeckDialog
        open={deckToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeckToDelete(null);
          }
        }}
        deckName={deckToDelete?.name ?? ""}
        onConfirm={handleDeleteDeck}
      />
    </div>
  );
}
