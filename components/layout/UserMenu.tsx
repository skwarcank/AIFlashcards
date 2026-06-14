"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router, supabase]);

  return (
    <div ref={menuRef} className="relative">
      <Button variant="outline" className="border-purple-900/50 bg-[#1a0a2e] text-white hover:bg-[#2d1b4e]" onClick={() => setIsOpen((value) => !value)}>
        <User className="size-4" />
        <span className="max-w-40 truncate">{email}</span>
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-purple-900/50 bg-[#2d1b4e] p-2 shadow-xl shadow-black/30">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
