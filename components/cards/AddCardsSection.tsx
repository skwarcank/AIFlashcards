"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";

import { AIGenerate } from "./AIGenerate";
import { ManualAdd } from "./ManualAdd";

interface AddCardsSectionProps {
  deckId: string;
  onCardsAdded: () => Promise<void> | void;
  defaultOpen?: boolean;
  defaultTab?: "ai" | "manual";
  onOpenChange?: (open: boolean) => void;
}

export function AddCardsSection({
  deckId,
  onCardsAdded,
  defaultOpen = false,
  defaultTab = "ai",
  onOpenChange,
}: AddCardsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { t } = useI18n();

  function updateOpen(open: boolean) {
    setIsOpen(open);
    onOpenChange?.(open);
  }

  if (!isOpen) {
    return (
      <Button type="button" variant="outline" onClick={() => updateOpen(true)}>
        {t("addCards.open")}
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-900/50 bg-[#2d1b4e] p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">{t("addCards.title")}</h3>
        <Button type="button" variant="ghost" onClick={() => updateOpen(false)}>
          {t("addCards.close")}
        </Button>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="ai">{t("addCards.ai")}</TabsTrigger>
          <TabsTrigger value="manual">{t("addCards.manual")}</TabsTrigger>
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
          <AIGenerate deckId={deckId} onCardsAdded={onCardsAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
