"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ManualAdd } from "./ManualAdd";

interface AddCardsSectionProps {
  deckId: string;
  onCardsAdded: () => Promise<void> | void;
}

function AIFallback() {
  return (
    <div className="rounded-xl border border-dashed border-purple-900/50 bg-black/10 p-4 text-sm text-white/70">
      AI generation will be available here.
    </div>
  );
}

export function AddCardsSection({ deckId, onCardsAdded }: AddCardsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        Add Cards
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-900/50 bg-[#2d1b4e] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Add Cards</h3>
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>

      <Tabs defaultValue="manual">
        <TabsList>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-4">
          <ManualAdd
            onAdd={async (front, back) => {
              const response = await fetch(`/api/decks/${deckId}/cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ front, back }),
              });

              if (!response.ok) {
                throw new Error("Failed to add card");
              }

              await onCardsAdded();
            }}
          />
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <AIFallback />
        </TabsContent>
      </Tabs>
    </div>
  );
}
