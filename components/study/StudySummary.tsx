import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface StudySummaryProps {
  reviewedCount: number;
  knownCount: number;
  onBackToDeck: () => void;
  onStudyAgain: () => void;
}

export function StudySummary({ reviewedCount, knownCount, onBackToDeck, onStudyAgain }: StudySummaryProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-purple-900/50 bg-[#2d1b4e] px-6 py-12 text-center text-white">
      <h2 className="text-3xl font-semibold">{t("study.done", { count: reviewedCount })}</h2>
      <p className="text-sm font-medium text-white/70">
        {t("study.score", { known: knownCount, total: reviewedCount })}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onStudyAgain} variant="outline">
          {t("study.studyAgain")}
        </Button>
        <Button onClick={onBackToDeck} variant="outline">
          {t("study.backToDeck")}
        </Button>
      </div>
    </div>
  );
}
