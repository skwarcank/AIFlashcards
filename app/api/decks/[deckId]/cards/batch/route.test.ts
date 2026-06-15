// @vitest-environment node

import { describe, expect, it } from "vitest";

import { POST } from "./route";

describe("POST /api/decks/[deckId]/cards/batch", () => {
  it("uses the batch card creation handler", () => {
    expect(POST).toBeTypeOf("function");
  });
});
