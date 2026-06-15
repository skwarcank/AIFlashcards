"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n } from "@/lib/i18n";
import type { Card } from "@/lib/types";

import { FlipCard } from "./FlipCard";
import { StudyProgress } from "./StudyProgress";
import { StudySummary } from "./StudySummary";

interface StudyViewProps {
  cards: Card[];
  deckId: string;
  onBackToDeck: () => void;
  onComplete?: () => void;
}

function shuffleCards(cards: Card[]) {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function StudyView({ cards, deckId, onBackToDeck, onComplete }: StudyViewProps) {
  const [studyCards, setStudyCards] = useState(() => shuffleCards(cards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useI18n();
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCardIds, setKnownCardIds] = useState<Record<string, boolean>>({});
  const hasReportedCompletion = useRef(false);

  const currentCard = studyCards[currentIndex];
  const currentStatus = currentCard && knownCardIds[currentCard.id] ? "known" : undefined;

  useEffect(() => {
    if (currentCard || hasReportedCompletion.current) {
      return;
    }

    hasReportedCompletion.current = true;
    onComplete?.();
  }, [currentCard, onComplete]);

  const handleFlip = useCallback(() => {
    setIsFlipped((value) => !value);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((value) => value + 1);
    setIsFlipped(false);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((value) => Math.max(value - 1, 0));
    setIsFlipped(false);
  }, []);

  const handleShuffle = useCallback(() => {
    setStudyCards((value) => shuffleCards(value));
    setCurrentIndex(0);
    setIsFlipped(false);
    hasReportedCompletion.current = false;
  }, []);

  const handleMarkKnown = useCallback(() => {
    if (!currentCard) {
      return;
    }

    setKnownCardIds((value) => ({ ...value, [currentCard.id]: !value[currentCard.id] }));
  }, [currentCard]);

  const handleClearKnown = useCallback(() => {
    if (!currentCard) {
      return;
    }

    setKnownCardIds((value) => ({ ...value, [currentCard.id]: false }));
  }, [currentCard]);

  useEffect(() => {
    if (!currentCard) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        handleMarkKnown();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleClearKnown();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentCard, handleClearKnown, handleMarkKnown, handleNext, handlePrevious]);

  if (!currentCard) {
    const knownCount = studyCards.filter((card) => knownCardIds[card.id]).length;

    return (
      <StudySummary
        reviewedCount={studyCards.length}
        knownCount={knownCount}
        onBackToDeck={onBackToDeck}
        onStudyAgain={handleShuffle}
      />
    );
  }

  return (
    <div className="space-y-6" data-deck-id={deckId}>
      <div className="space-y-3">
        <button
          type="button"
          className="rounded-lg border border-purple-900/50 bg-[#2d1b4e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3b2366]"
          onClick={onBackToDeck}
        >
          {t("study.leaveSession")}
        </button>

        <StudyProgress current={currentIndex + 1} total={studyCards.length} />
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <button
          type="button"
          className="order-2 rounded-full border border-purple-900/50 bg-[#2d1b4e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2366] disabled:cursor-not-allowed disabled:opacity-40 sm:order-none sm:h-16 sm:w-16 sm:px-0 sm:text-2xl"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label={t("study.previous")}
        >
          <span aria-hidden="true">&lt;</span>
          <span className="ml-2 sm:sr-only">{t("study.previousShort")}</span>
        </button>

        <FlipCard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          status={currentStatus}
        />

        <button
          type="button"
          className="order-3 rounded-full border border-purple-900/50 bg-[#2d1b4e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2366] sm:order-none sm:h-16 sm:w-16 sm:px-0 sm:text-2xl"
          onClick={handleNext}
          aria-label={t("study.next")}
        >
          <span className="mr-2 sm:sr-only">{t("study.nextShort")}</span>
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="rounded-lg border border-emerald-400/70 bg-emerald-950/40 px-4 py-2 font-semibold text-emerald-100 transition hover:bg-emerald-900/50"
          onClick={handleMarkKnown}
        >
          {t("study.knowIt")}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="rounded-lg border border-purple-900/50 bg-[#2d1b4e] px-4 py-2 text-white transition hover:bg-[#3b2366]"
          onClick={handleShuffle}
        >
          {t("study.shuffle")}
        </button>
      </div>
    </div>
  );
}
