"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";

import { I18nProvider } from "@/lib/i18n";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 2 }}>{children}</SWRConfig>
    </I18nProvider>
  );
}
