# Triple-Feature

Movie recommendations for your perfect movie night — public site and read-only Editorial picks from Supabase.

## Setup

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Use the **anonymous (public)** key only in this Vite frontend. Never add a Supabase **service role** key to client-side env vars or commits.

### Public site is read-only

- There is **no login**, session, profile, or watchlist editing in this app.
- Browser code only performs **SELECT** on Supabase (`editors_choice` for Editor’s Choice). **Insert / update / delete** happens in the [Supabase Dashboard](https://supabase.com/dashboard) or another trusted backend — not from this codebase.
- Configure **Row Level Security (RLS)** so `anon` can **SELECT** published rows only, e.g. `is_published = true`. Do **not** grant anon `INSERT`, `UPDATE`, or `DELETE` on editorial tables unless you explicitly want the public internet to mutate data.

Example table shape (adapt names/types to match your project):

```sql
create table editors_choice (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  is_published boolean not null default false,
  watched_date date,
  tmdb_id bigint,
  title text,
  year int,
  director text,
  runtime_minutes int,
  personal_rating numeric,
  review text,
  why_pick text,
  poster_url text
);

alter table editors_choice enable row level security;

-- Public reads: published rows only
create policy "Public read published editors_choice"
on editors_choice
for select
to anon
using (is_published = true);
```

The app queries:

```javascript
await supabase
  .from('editors_choice')
  .select('*')
  .eq('is_published', true)
  .order('watched_date', { ascending: false })
  .order('created_at', { ascending: false });
```

Minor column aliases are normalized in `src/lib/editorsChoicePublic.js`; prefer aligning your table with the snippet above.

## Features

- **Smart Movie Recommendations**: Film suggestions based on preferences (TMDB).
- **Editor’s Choice**: Personal write-ups loaded from Supabase (TMDB enrichment is best-effort; rows still render if TMDB fails).
- **Responsive Design**: UI scales across breakpoints.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```
