"use client";

import { useI18n, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{ value: Language; labelKey: "language.english" | "language.polish"; shortLabel: string }> = [
  { value: "en", labelKey: "language.english", shortLabel: "EN" },
  { value: "pl", labelKey: "language.polish", shortLabel: "PL" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-purple-900/50 bg-[#1a0a2e] p-1" aria-label={t("language.label")}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          title={t(option.labelKey)}
          aria-pressed={language === option.value}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            language === option.value ? "bg-[#7c3aed] text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
          )}
          onClick={() => setLanguage(option.value)}
        >
          {option.shortLabel}
        </button>
      ))}
    </div>
  );
}
