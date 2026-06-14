export const SWR_KEYS = {
  decks: "/api/decks",
  deck: (id: string) => `/api/decks/${id}`,
  cards: (deckId: string) => `/api/decks/${deckId}/cards`,
  card: (deckId: string, cardId: string) => `/api/decks/${deckId}/cards/${cardId}`,
} as const;
