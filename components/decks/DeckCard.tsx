import Link from "next/link";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { Deck } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DeckCardProps {
  deck: Deck;
  onDelete?: (deck: Deck) => void;
}

export function DeckCard({ deck, onDelete }: DeckCardProps) {
  const { t } = useI18n();

  return (
    <Card className="relative border border-purple-900/50 bg-[#2d1b4e] text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5">
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-2 top-2 z-10 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label={t("decks.deleteAria", { name: deck.name })}
          onClick={() => onDelete(deck)}
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}

      <Link href={`/decks/${deck.id}`} className={cn("flex h-full flex-col gap-3 p-4 pr-10")}>
        <div>
          <h3 className="text-lg font-semibold">{deck.name}</h3>
          {deck.description ? <p className="mt-1 text-sm text-white/70">{deck.description}</p> : null}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm text-white/70">
          <span>{t("decks.cardsCount", { count: deck.card_count ?? 0 })}</span>
          <span>{deck.last_studied ? new Date(deck.last_studied).toLocaleDateString() : t("decks.never")}</span>
        </div>
      </Link>
    </Card>
  );
}
