import { vi } from "vitest";

type JsonBody = Record<string, unknown> | unknown[];

export function createJsonResponse(body: JsonBody, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    status: init.status ?? 200,
    statusText: init.statusText,
  });
}

export function mockFetchJson(body: JsonBody, init?: ResponseInit) {
  const fetchMock = vi.fn().mockResolvedValue(createJsonResponse(body, init));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function mockFetchError(status: number, body: JsonBody = { error: "Request failed" }, init?: ResponseInit) {
  return mockFetchJson(body, { ...init, status });
}

export function mockFetchNetworkError(error: Error = new Error("Network error")) {
  const fetchMock = vi.fn().mockRejectedValue(error);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function mockRateLimitResponse(retryAfterSeconds = 30) {
  return mockFetchError(
    429,
    { error: "Rate limited" },
    {
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}
