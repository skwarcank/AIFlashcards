import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";

import { I18nProvider } from "@/lib/i18n";

interface TestProvidersProps {
  children: ReactNode;
}

function TestProviders({ children }: TestProvidersProps) {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        errorRetryCount: 0,
        provider: () => new Map(),
        revalidateOnFocus: false,
      }}
    >
      <I18nProvider>{children}</I18nProvider>
    </SWRConfig>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: TestProviders, ...options });
}

export function setupUser() {
  return userEvent.setup();
}

export * from "@testing-library/react";
