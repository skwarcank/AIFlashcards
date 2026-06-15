import type { User } from "@supabase/supabase-js";

import type { Card, Deck } from "@/lib/types";

const now = "2026-06-15T12:00:00.000Z";

export interface AiSuggestion {
  front: string;
  back: string;
}

export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    app_metadata: {},
    aud: "authenticated",
    created_at: now,
    email: "user@example.com",
    user_metadata: {},
    ...overrides,
  } as User;
}

export function createDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: "deck-1",
    user_id: "user-1",
    name: "Biology Basics",
    description: "Introductory biology concepts",
    card_count: 3,
    last_studied: null,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

export function createDecks(count = 3, overrides: Partial<Deck> = {}): Deck[] {
  return Array.from({ length: count }, (_, index) =>
    createDeck({
      id: `deck-${index + 1}`,
      name: `Deck ${index + 1}`,
      ...overrides,
    }),
  );
}

export function createCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    deck_id: "deck-1",
    user_id: "user-1",
    front: "What is mitosis?",
    back: "Cell division that produces two identical daughter cells.",
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

export function createCards(count = 3, overrides: Partial<Card> = {}): Card[] {
  return Array.from({ length: count }, (_, index) =>
    createCard({
      id: `card-${index + 1}`,
      front: `Question ${index + 1}`,
      back: `Answer ${index + 1}`,
      ...overrides,
    }),
  );
}

export function createAiSuggestion(overrides: Partial<AiSuggestion> = {}): AiSuggestion {
  return {
    front: "What does DNA store?",
    back: "Genetic information.",
    ...overrides,
  };
}

export function createAiSuggestions(count = 3, overrides: Partial<AiSuggestion> = {}): AiSuggestion[] {
  return Array.from({ length: count }, (_, index) =>
    createAiSuggestion({
      front: `Generated question ${index + 1}`,
      back: `Generated answer ${index + 1}`,
      ...overrides,
    }),
  );
}
