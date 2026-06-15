import { useI18n } from "@/lib/i18n";

interface StudyProgressProps {
  current: number;
  total: number;
}

export function StudyProgress({ current, total }: StudyProgressProps) {
  const { t } = useI18n();
  const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>{t("study.cardProgress", { current, total })}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#7c3aed] transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
