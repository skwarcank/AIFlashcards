"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
  email: string;
}

export function UserMenu({ email }: UserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }, [router]);

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-40 truncate text-sm text-white/75 sm:block">{email}</span>
      <Button
        type="button"
        variant="outline"
        className="border-purple-900/50 bg-[#1a0a2e] text-white hover:bg-[#2d1b4e]"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="size-4" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
