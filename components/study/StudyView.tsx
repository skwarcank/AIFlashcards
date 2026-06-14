"use client";

import { useCallback, useState } from "react";

import type { Card } from "@/lib/types";

import { FlipCard } from "./FlipCard";
import { StudyProgress } from "./StudyProgress";
import { StudySummary } from "./StudySummary";

interface StudyViewProps {
  cards: Card[];
  deckId: string;
  onBackToDeck: () => void;
}

export function StudyView({ cards, deckId, onBackToDeck }: StudyViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((value) => !value);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((value) => value + 1);
    setIsFlipped(false);
  }, []);

  if (!currentCard) {
    return <StudySummary reviewedCount={cards.length} onBackToDeck={onBackToDeck} />;
  }

  return (
    <div className="space-y-6" data-deck-id={deckId}>
      <StudyProgress current={currentIndex + 1} total={cards.length} />

      <FlipCard
        front={currentCard.front}
        back={currentCard.back}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      <div className="flex justify-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-purple-900/50 bg-[#2d1b4e] px-4 py-2 text-white hover:bg-[#3b2366]"
          onClick={handleNext}
        >
          Next Card
        </button>
      </div>
    </div>
  );
}
