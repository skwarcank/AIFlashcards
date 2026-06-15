// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockFetchJson, mockFetchNetworkError, mockRateLimitResponse } from "@/lib/test-utils/fetch";

import { POST } from "./route";

const originalEnv = process.env;

function createRequest(body: unknown) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      OPENROUTER_API_KEY: "test-key",
      OPENROUTER_BASE_URL: "https://openrouter.test/api/v1",
      OPENROUTER_MODEL: "test-model",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  it("returns 400 for invalid JSON", async () => {
    const response = await POST(
      new Request("http://localhost/api/generate", {
        method: "POST",
        body: "{bad json",
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: "Invalid JSON body" });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid generation payloads", async () => {
    const response = await POST(createRequest({ sourceText: "too short", count: 3 }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toHaveProperty("error");
  });

  it("returns empty suggestions when no API key is configured", async () => {
    delete process.env.OPENROUTER_API_KEY;

    const response = await POST(createRequest({ sourceText: "A sufficiently long source text for card generation.", count: 2 }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ suggestions: [] });
  });

  it("returns parsed suggestions from fenced OpenRouter JSON", async () => {
    const fetchMock = mockFetchJson({
      choices: [
        {
          message: {
            content: '```json\n[{"front":" Question? ","back":" Answer. "}]\n```',
          },
        },
      ],
    });

    const response = await POST(createRequest({ sourceText: "A sufficiently long source text for card generation.", count: 1 }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ suggestions: [{ front: "Question?", back: "Answer." }] });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://openrouter.test/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-key" }),
      }),
    );
  });

  it("preserves Retry-After on rate limits", async () => {
    mockRateLimitResponse(45);

    const response = await POST(createRequest({ sourceText: "A sufficiently long source text for card generation.", count: 1 }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("45");
    await expect(response.json()).resolves.toEqual({ error: "Rate limited" });
  });

  it("returns 502 for network failures", async () => {
    mockFetchNetworkError();

    const response = await POST(createRequest({ sourceText: "A sufficiently long source text for card generation.", count: 1 }));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "AI generation failed" });
  });
});
