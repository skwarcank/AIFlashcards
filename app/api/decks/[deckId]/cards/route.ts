import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedUser as getSupabaseAuthenticatedUser } from "@/lib/supabase/server";
import { cardSchema } from "@/lib/validations";

interface DeckCardsParams {
  params: Promise<{
    deckId: string;
  }>;
}

const batchSchema = z.object({
  cards: z.array(cardSchema).min(1),
});

type SupabaseClient = Awaited<ReturnType<typeof getSupabaseAuthenticatedUser>>["supabase"];

async function ensureDeckOwnership(supabase: SupabaseClient, userId: string, deckId: string) {
  const { data, error } = await supabase
    .from("decks")
    .select("id")
    .eq("id", deckId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (!data) {
    return { error: new Error("Deck not found") };
  }

  return { error: null };
}

export async function GET(_request: Request, { params }: DeckCardsParams) {
  const { deckId } = await params;
  const { supabase, user } = await getSupabaseAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownership = await ensureDeckOwnership(supabase, user.id, deckId);
  if (ownership.error) {
    return NextResponse.json({ error: ownership.error.message }, { status: ownership.error.message === "Deck not found" ? 404 : 500 });
  }

  const { data, error } = await supabase
    .from("cards")
    .select("id, deck_id, user_id, front, back, created_at, updated_at")
    .eq("deck_id", deckId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cards: data ?? [] });
}

export async function POST(request: Request, { params }: DeckCardsParams) {
  const { deckId } = await params;
  const { supabase, user } = await getSupabaseAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownership = await ensureDeckOwnership(supabase, user.id, deckId);
  if (ownership.error) {
    return NextResponse.json({ error: ownership.error.message }, { status: ownership.error.message === "Deck not found" ? 404 : 500 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = cardSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid card" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("cards")
    .insert({
      deck_id: deckId,
      user_id: user.id,
      front: parsed.data.front.trim(),
      back: parsed.data.back.trim(),
    })
    .select("id, deck_id, user_id, front, back, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create card" }, { status: 500 });
  }

  return NextResponse.json({ card: data }, { status: 201 });
}

export async function PUT(request: Request, { params }: DeckCardsParams) {
  const { deckId } = await params;
  const { supabase, user } = await getSupabaseAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownership = await ensureDeckOwnership(supabase, user.id, deckId);
  if (ownership.error) {
    return NextResponse.json({ error: ownership.error.message }, { status: ownership.error.message === "Deck not found" ? 404 : 500 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = batchSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid cards" }, { status: 400 });
  }

  const cardsToInsert = parsed.data.cards.map((card) => ({
    deck_id: deckId,
    user_id: user.id,
    front: card.front.trim(),
    back: card.back.trim(),
  }));

  const { data, error } = await supabase
    .from("cards")
    .insert(cardsToInsert)
    .select("id, deck_id, user_id, front, back, created_at, updated_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cards: data ?? [] }, { status: 201 });
}
