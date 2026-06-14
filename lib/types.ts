export interface Deck {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  card_count?: number;
  last_studied?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  deck_id: string;
  user_id: string;
  front: string;
  back: string;
  created_at: string;
  updated_at: string;
}
