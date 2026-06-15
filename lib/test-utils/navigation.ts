import { vi } from "vitest";

export const mockBack = vi.fn();
export const mockPrefetch = vi.fn();
export const mockPush = vi.fn();
export const mockRefresh = vi.fn();
export const mockReplace = vi.fn();

export function createMockRouter() {
  return {
    back: mockBack,
    forward: vi.fn(),
    prefetch: mockPrefetch,
    push: mockPush,
    refresh: mockRefresh,
    replace: mockReplace,
  };
}

export function createMockSearchParams(params: Record<string, string> = {}) {
  return new URLSearchParams(params);
}

export function resetNavigationMocks() {
  mockBack.mockReset();
  mockPrefetch.mockReset();
  mockPush.mockReset();
  mockRefresh.mockReset();
  mockReplace.mockReset();
}
