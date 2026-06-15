"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { UserMenu } from "@/components/layout/UserMenu";
import { useI18n } from "@/lib/i18n";

interface TopBarProps {
  email: string;
  onMenuClick?: () => void;
}

export function TopBar({ email, onMenuClick }: TopBarProps) {
  const { t } = useI18n();

  return (
    <header className="flex items-center justify-between border-b border-purple-900/50 bg-[#2d1b4e] px-4 py-3">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label={t("layout.openNavigation")}
          >
            <Menu className="size-4" />
          </Button>
        ) : null}
        <h1 className="text-lg font-semibold text-white">AIFlashcards</h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <UserMenu email={email} />
      </div>
    </header>
  );
}
