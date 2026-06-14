"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

import { StudyView } from "@/components/study/StudyView";
import { Button } from "@/components/ui/button";
import type { Card } from "@/lib/types";
import { SWR_KEYS } from "@/lib/swr-keys";

interface CardsResponse {
  cards: Card[];
}

async function fetchCards(url: string): Promise<CardsResponse> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load cards");
  }

  return response.json() as Promise<CardsResponse>;
}

export default function StudyPage() {
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();
  const deckId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, error, isLoading } = useSWR<CardsResponse>(deckId ? SWR_KEYS.cards(deckId) : null, fetchCards);

  useEffect(() => {
    if (deckId && data && data.cards.length === 0) {
      router.replace(`/decks/${deckId}`);
    }
  }, [data, deckId, router]);

  if (!deckId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-white">Failed to load study cards</p>
        <Button onClick={() => router.push(`/decks/${deckId}`)}>Back to Deck</Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.cards.length === 0) {
    return null;
  }

  return <StudyView cards={data.cards} deckId={deckId} onBackToDeck={() => router.push(`/decks/${deckId}`)} />;
}
