import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface EmptyDecksProps {
  onNewDeck: () => void;
}

export function EmptyDecks({ onNewDeck }: EmptyDecksProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-purple-900/50 bg-[#2d1b4e] px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold">{t("decks.emptyTitle")}</h2>
      <p className="mt-2 max-w-md text-sm text-white/70">{t("decks.emptyDescription")}</p>
      <Button className="mt-6" onClick={onNewDeck}>
        <Plus className="size-4" />
        {t("decks.new")}
      </Button>
    </div>
  );
}
