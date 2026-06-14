import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/supabase/server";
import { deckSchema } from "@/lib/validations";

interface DeckParams {
  params: Promise<{
    deckId: string;
  }>;
}

export async function PATCH(request: Request, { params }: DeckParams) {
  const { deckId } = await params;
  const { supabase, user } = await getAuthenticatedUser();

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

  const { data, error } = await supabase
    .from("decks")
    .update({
      name: parsed.data.name.trim(),
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deckId)
    .eq("user_id", user.id)
    .select("id, user_id, name, description, created_at, updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to update deck" }, { status: 500 });
  }

  return NextResponse.json({ deck: { ...data, card_count: 0 } });
}

export async function DELETE(_request: Request, { params }: DeckParams) {
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

  const { error } = await supabase.from("decks").delete().eq("id", deckId).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
