import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { deckSchema } from "@/lib/validations";

interface DeckCardCountRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  cards?: Array<{ count?: number | null }> | null;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("decks")
    .select("id, user_id, name, description, created_at, updated_at, cards(count)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const decks = (data ?? []).map((deck) => {
    const typedDeck = deck as DeckCardCountRow;
    const cardCount = Array.isArray(typedDeck.cards)
      ? typedDeck.cards[0]?.count ?? 0
      : 0;

    return {
      id: typedDeck.id,
      user_id: typedDeck.user_id,
      name: typedDeck.name,
      description: typedDeck.description,
      card_count: cardCount,
      created_at: typedDeck.created_at,
      updated_at: typedDeck.updated_at,
    };
  });

  return NextResponse.json({ decks });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = deckSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid deck" }, { status: 400 });
  }

  const description = parsed.data.description?.trim() || null;
  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: user.id,
      name: parsed.data.name.trim(),
      description,
    })
    .select("id, user_id, name, description, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create deck" }, { status: 500 });
  }

  return NextResponse.json({ deck: { ...data, card_count: 0 } }, { status: 201 });
}
