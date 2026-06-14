import { NextResponse } from "next/server";

import { getAuthenticatedUser as getSupabaseAuthenticatedUser } from "@/lib/supabase/server";
import { cardSchema } from "@/lib/validations";

interface CardParams {
  params: Promise<{
    deckId: string;
    cardId: string;
  }>;
}

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

async function ensureCardOwnership(supabase: SupabaseClient, userId: string, deckId: string, cardId: string) {
  const { data, error } = await supabase
    .from("cards")
    .select("id")
    .eq("id", cardId)
    .eq("deck_id", deckId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (!data) {
    return { error: new Error("Card not found") };
  }

  return { error: null };
}

export async function PATCH(request: Request, { params }: CardParams) {
  const { deckId, cardId } = await params;
  const { supabase, user } = await getSupabaseAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deckOwnership = await ensureDeckOwnership(supabase, user.id, deckId);
  if (deckOwnership.error) {
    return NextResponse.json({ error: deckOwnership.error.message }, { status: deckOwnership.error.message === "Deck not found" ? 404 : 500 });
  }

  const cardOwnership = await ensureCardOwnership(supabase, user.id, deckId, cardId);
  if (cardOwnership.error) {
    return NextResponse.json({ error: cardOwnership.error.message }, { status: cardOwnership.error.message === "Card not found" ? 404 : 500 });
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
    .update({
      front: parsed.data.front.trim(),
      back: parsed.data.back.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .eq("deck_id", deckId)
    .eq("user_id", user.id)
    .select("id, deck_id, user_id, front, back, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to update card" }, { status: 500 });
  }

  return NextResponse.json({ card: data });
}

export async function DELETE(_request: Request, { params }: CardParams) {
  const { deckId, cardId } = await params;
  const { supabase, user } = await getSupabaseAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deckOwnership = await ensureDeckOwnership(supabase, user.id, deckId);
  if (deckOwnership.error) {
    return NextResponse.json({ error: deckOwnership.error.message }, { status: deckOwnership.error.message === "Deck not found" ? 404 : 500 });
  }

  const cardOwnership = await ensureCardOwnership(supabase, user.id, deckId, cardId);
  if (cardOwnership.error) {
    return NextResponse.json({ error: cardOwnership.error.message }, { status: cardOwnership.error.message === "Card not found" ? 404 : 500 });
  }

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("deck_id", deckId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
