import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/supabase/server";

interface DeckParams {
  params: Promise<{
    deckId: string;
  }>;
}

export async function POST(_request: Request, { params }: DeckParams) {
  const { deckId } = await params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existingDeck, error: lookupError } = await supabase
    .from("decks")
    .select("id")
    .eq("id", deckId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (!existingDeck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("decks")
    .update({ last_studied: now, updated_at: now })
    .eq("id", deckId)
    .eq("user_id", user.id)
    .select("id, user_id, name, description, last_studied, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to record study session" }, { status: 500 });
  }

  return NextResponse.json({ deck: { ...data, card_count: 0 } });
}
