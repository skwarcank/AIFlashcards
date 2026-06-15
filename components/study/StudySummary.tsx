import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface StudySummaryProps {
  reviewedCount: number;
  onBackToDeck: () => void;
  onStudyAgain: () => void;
}

export function StudySummary({ reviewedCount, onBackToDeck, onStudyAgain }: StudySummaryProps) {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-purple-900/50 bg-[#2d1b4e] px-6 py-12 text-center text-white">
      <h2 className="text-3xl font-semibold">{t("study.done", { count: reviewedCount })}</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onStudyAgain}>{t("study.studyAgain")}</Button>
        <Button onClick={onBackToDeck} variant="outline">
          {t("study.backToDeck")}
        </Button>
      </div>
    </div>
  );
}
