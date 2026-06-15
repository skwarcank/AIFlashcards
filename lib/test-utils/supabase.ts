import { vi, type Mock } from "vitest";

import { createTestUser } from "@/lib/test-utils/factories";

interface SupabaseResult<T> {
  data: T | null;
  error: Error | null;
  count?: number | null;
}

export type SupabaseQueryMock<T = unknown> = PromiseLike<SupabaseResult<T>> & {
  contains: Mock;
  delete: Mock;
  eq: Mock;
  in: Mock;
  insert: Mock;
  limit: Mock;
  maybeSingle: Mock;
  neq: Mock;
  order: Mock;
  select: Mock;
  single: Mock;
  update: Mock;
};

export function createSupabaseResult<T>(data: T | null = null, error: Error | null = null): SupabaseResult<T> {
  return { data, error };
}

export function createSupabaseQueryMock<T = unknown>(result: SupabaseResult<T> = createSupabaseResult<T>()): SupabaseQueryMock<T> {
  const query = {} as SupabaseQueryMock<T>;
  const resolvedResult = Promise.resolve(result);

  query.contains = vi.fn(() => query);
  query.delete = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.in = vi.fn(() => query);
  query.insert = vi.fn(() => query);
  query.limit = vi.fn(() => query);
  query.maybeSingle = vi.fn(async () => result);
  query.neq = vi.fn(() => query);
  query.order = vi.fn(() => query);
  query.select = vi.fn(() => query);
  query.single = vi.fn(async () => result);
  query.then = resolvedResult.then.bind(resolvedResult) as SupabaseQueryMock<T>["then"];
  query.update = vi.fn(() => query);

  return query;
}

export function createSupabaseClientMock(queries: Array<SupabaseQueryMock> = []) {
  const queryQueue = [...queries];

  return {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: createTestUser() }, error: null })),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(() => queryQueue.shift() ?? createSupabaseQueryMock()),
  };
}

export function createAuthenticatedSupabaseContext(user = createTestUser(), supabase = createSupabaseClientMock()) {
  return { supabase, user };
}

export function createUnauthenticatedSupabaseContext(supabase = createSupabaseClientMock()) {
  return { supabase, user: null };
}
