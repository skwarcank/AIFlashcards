import { describe, expect, it } from "vitest";
import { cardSchema, deckSchema, generateSchema, loginSchema, registerSchema } from "./validations";

describe("validations", () => {
  it("validates login input", () => {
    expect(() => loginSchema.parse({ email: "bad" })).toThrow();
    expect(loginSchema.parse({ email: "a@b.com", password: "secret" })).toEqual({
      email: "a@b.com",
      password: "secret",
    });
  });

  it("validates registration password rules", () => {
    expect(() => registerSchema.parse({ email: "a@b.com", password: "abc" })).toThrow();
    expect(registerSchema.parse({ email: "a@b.com", password: "abc123" })).toEqual({
      email: "a@b.com",
      password: "abc123",
    });
  });

  it("validates deck input", () => {
    expect(() => deckSchema.parse({ name: "" })).toThrow();
    expect(deckSchema.parse({ name: "History", description: "World history" })).toEqual({
      name: "History",
      description: "World history",
    });
    expect(deckSchema.parse({ name: "x".repeat(200), description: "x".repeat(1000) })).toEqual({
      name: "x".repeat(200),
      description: "x".repeat(1000),
    });
    expect(() => deckSchema.parse({ name: "x".repeat(201) })).toThrow();
    expect(() => deckSchema.parse({ name: "Deck", description: "x".repeat(1001) })).toThrow();
  });

  it("validates card input", () => {
    expect(() => cardSchema.parse({ front: "", back: "A" })).toThrow();
    expect(cardSchema.parse({ front: "Q", back: "A" })).toEqual({ front: "Q", back: "A" });
    expect(cardSchema.parse({ front: "x".repeat(500), back: "y".repeat(500) })).toEqual({
      front: "x".repeat(500),
      back: "y".repeat(500),
    });
    expect(() => cardSchema.parse({ front: "x".repeat(501), back: "A" })).toThrow();
    expect(() => cardSchema.parse({ front: "Q", back: "y".repeat(501) })).toThrow();
  });

  it("validates generation input", () => {
    expect(() => generateSchema.parse({ sourceText: "short" })).toThrow();
    expect(generateSchema.parse({ sourceText: "This source text has enough length to generate multiple meaningful flashcards." })).toEqual({
      sourceText: "This source text has enough length to generate multiple meaningful flashcards.",
      count: 5,
    });
  });
});
