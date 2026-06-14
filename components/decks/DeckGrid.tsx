import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Deck } from "@/lib/types";

import { DeckCard } from "./DeckCard";

interface DeckGridProps {
  decks: Deck[];
  onNewDeck: () => void;
  onDeleteDeck?: (deck: Deck) => void;
}

export function DeckGrid({ decks, onNewDeck, onDeleteDeck }: DeckGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} onDelete={onDeleteDeck} />
      ))}

      <Card className="min-h-[160px] border border-dashed border-purple-900/50 bg-transparent text-white/80">
        <Button
          type="button"
          variant="ghost"
          className="h-full w-full flex-col gap-3 py-10 text-white/80 hover:bg-white/5 hover:text-white"
          onClick={onNewDeck}
        >
          <Plus className="size-5" />
          New Deck
        </Button>
      </Card>
    </div>
  );
}
