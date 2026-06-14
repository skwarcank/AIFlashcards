"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard", label: "Decks", icon: BookOpen },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close navigation menu overlay"
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-60 border-r border-purple-900/50 bg-[#2d1b4e] p-4 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Navigation</span>
          {onClose ? (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation menu">
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-[#7c3aed] text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
