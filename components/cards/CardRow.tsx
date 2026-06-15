import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { Card as Flashcard } from "@/lib/types";

interface CardRowProps {
  card: Flashcard;
  onEdit: (card: Flashcard) => void;
  onDelete: (card: Flashcard) => void;
}

export function CardRow({ card, onEdit, onDelete }: CardRowProps) {
  const { t } = useI18n();

  return (
    <Card className="border border-purple-900/50 bg-[#2d1b4e] text-white">
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <p className="truncate text-base font-medium">{card.front}</p>
          <p className="mt-1 text-sm text-white/60">{card.back}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" variant="ghost" size="icon-sm" aria-label={t("cards.edit", { name: card.front })} onClick={() => onEdit(card)}>
            <Pencil className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={t("cards.deleteCard", { name: card.front })} onClick={() => onDelete(card)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
