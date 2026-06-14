"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";

interface TopBarProps {
  email: string;
  onMenuClick?: () => void;
}

export function TopBar({ email, onMenuClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-purple-900/50 bg-[#2d1b4e] px-4 py-3">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="size-4" />
          </Button>
        ) : null}
        <h1 className="text-lg font-semibold text-white">AIFlashcards</h1>
      </div>
      <UserMenu email={email} />
    </header>
  );
}
