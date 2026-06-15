import { notFound } from "next/navigation";

import { DeckDetailView } from "@/components/decks/DeckDetailView";
import { createClient } from "@/lib/supabase/server";
import type { Deck } from "@/lib/types";

interface DeckPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data, error } = await supabase
    .from("decks")
    .select("id, user_id, name, description, last_studied, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { count } = await supabase
    .from("cards")
    .select("id", { count: "exact", head: true })
    .eq("deck_id", id)
    .eq("user_id", user.id);

  if (error || !data) {
    notFound();
  }

  const deck = {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    description: data.description,
    last_studied: data.last_studied,
    card_count: count ?? 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } satisfies Deck;

  return <DeckDetailView deck={deck} />;
}
