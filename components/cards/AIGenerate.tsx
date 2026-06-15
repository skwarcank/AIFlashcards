"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AIGenerateSkeleton } from "./AIGenerateSkeleton";
import { AISuggestionRow } from "./AISuggestionRow";

interface Suggestion {
  front: string;
  back: string;
}

interface AIGenerateProps {
  deckId: string;
  onCardsAdded: () => Promise<void> | void;
}

export function AIGenerate({ deckId, onCardsAdded }: AIGenerateProps) {
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const acceptedCount = Object.values(selected).filter(Boolean).length;

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setSelected({});
    setCooldownSeconds(0);
    setSuggestions([]);
    setAddedCount(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceText, count }),
      });

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfterSeconds = Number(retryAfterHeader ?? "0");
        setCooldownSeconds(Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? retryAfterSeconds : 30);
        setError("Rate limited. Please retry after the cooldown ends.");
        return;
      }

      if (!response.ok) {
        setError("AI generation failed");
        return;
      }

      const data = (await response.json()) as { suggestions: Suggestion[] };
      if (!data.suggestions || data.suggestions.length === 0) {
        setError("Couldn't generate quality cards. Try different text or add manually.");
        return;
      }

      setSuggestions(data.suggestions);
      setSelected(Object.fromEntries(data.suggestions.map((_, index) => [index, true])));
    } catch {
      setError("Couldn't generate quality cards. Try different text or add manually.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleAddAccepted() {
    const cards = suggestions.filter((_, index) => selected[index]);

    setIsAdding(true);

    try {
      const response = await fetch(`/api/decks/${deckId}/cards/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Failed to add generated cards");
        return;
      }

      await onCardsAdded();
      setSuggestions([]);
      setSelected({});
      setAddedCount(cards.length);
    } finally {
      setIsAdding(false);
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Loader2 className="size-4 animate-spin" />
          Generating...
        </div>
        <AIGenerateSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-900/50 bg-black/10 p-4 text-sm text-white/80">{error}</div>
        {cooldownSeconds > 0 ? <p className="text-sm text-white/60">Retry in {cooldownSeconds} seconds.</p> : null}
        <Button type="button" onClick={handleGenerate} disabled={cooldownSeconds > 0}>
          Retry
        </Button>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-white">Review generated cards</p>
          <p className="text-sm text-white/60">All cards are accepted by default. Discard anything you do not want to keep.</p>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) =>
            selected[index] ? (
              <AISuggestionRow
                key={`${suggestion.front}-${index}`}
                suggestion={suggestion}
                index={index}
                onDiscard={(discardedIndex) => setSelected((current) => ({ ...current, [discardedIndex]: false }))}
                onEdit={(editedIndex, editedSuggestion) => {
                  setSuggestions((current) =>
                    current.map((item, currentIndex) => (currentIndex === editedIndex ? editedSuggestion : item)),
                  );
                }}
              />
            ) : null,
          )}
        </div>

        <Button type="button" onClick={handleAddAccepted} disabled={acceptedCount === 0 || isAdding}>
          {isAdding ? <Loader2 className="size-4 animate-spin" /> : null}
          {isAdding ? "Adding..." : `Add accepted (${acceptedCount})`}
        </Button>
      </div>
    );
  }

  if (addedCount > 0) {
    return (
      <div className="rounded-2xl border border-purple-900/50 bg-black/10 p-4">
        <p className="font-medium text-white">Added {addedCount} cards</p>
        <p className="mt-1 text-sm text-white/60">You can start studying now or generate more cards for this deck.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/study/${deckId}`} className={buttonVariants({ variant: "default" })}>
            Study now
          </Link>
          <Button type="button" variant="outline" onClick={() => setAddedCount(0)}>
            Generate more
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai-source-text">Source text</Label>
        <textarea
          id="ai-source-text"
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          rows={8}
          className="min-h-40 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-count">Count</Label>
        <Input id="ai-count" type="number" min={1} max={20} value={count} onChange={(event) => setCount(Number(event.target.value))} />
      </div>

      <Button type="button" onClick={handleGenerate} disabled={sourceText.trim().length < 50 || isGenerating || cooldownSeconds > 0}>
        {cooldownSeconds > 0 ? `Retry in ${cooldownSeconds}s` : "Generate"}
      </Button>
    </div>
  );
}
