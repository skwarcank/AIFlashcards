alter table public.cards
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

update public.cards
set user_id = decks.user_id
from public.decks
where cards.deck_id = decks.id
  and cards.user_id is null;

alter table public.cards
  alter column user_id set not null;

create index if not exists idx_cards_user_id on public.cards(user_id);
