-- Create decks table
create table public.decks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null check (char_length(name) >= 1 and char_length(name) <= 200),
  description text check (char_length(description) <= 1000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Create cards table
create table public.cards (
  id         uuid primary key default gen_random_uuid(),
  deck_id    uuid not null references public.decks(id) on delete cascade,
  front      text not null check (char_length(front) >= 1 and char_length(front) <= 500),
  back       text not null check (char_length(back) >= 1 and char_length(back) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_decks_user_id on public.decks(user_id);
create index idx_cards_deck_id on public.cards(deck_id);

-- RLS: Decks
alter table public.decks enable row level security;

create policy "Users can CRUD their own decks"
  on public.decks
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- RLS: Cards
alter table public.cards enable row level security;

create policy "Users can CRUD cards in their decks"
  on public.cards
  using (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
        and decks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.decks
      where decks.id = cards.deck_id
        and decks.user_id = auth.uid()
    )
  );
