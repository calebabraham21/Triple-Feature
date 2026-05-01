/**
 * Read-only helpers for Editor’s Choice posts.
 * Rows are authored in Supabase Dashboard; public clients only SELECT published rows (see README / RLS).
 */
import { supabase } from './supabaseClient';

const EDITORS_CHOICE_TABLE = 'editors_choice';

/**
 * Loads published picks for the public site (newest first).
 * Matches table `editors_choice` with `is_published` and `watched_date` — adjust columns in DB if yours differ.
 */
export async function fetchPublishedEditorsChoice() {
  const { data, error } = await supabase
    .from(EDITORS_CHOICE_TABLE)
    .select('*')
    .eq('is_published', true)
    .order('watched_date', { ascending: false })
    .order('created_at', { ascending: false });

  return { data: data ?? [], error };
}

/** Normalize row fields so minor schema differences still render. */
export function normalizeEditorsChoiceRow(row) {
  if (!row) return null;
  const tmdbId = row.tmdb_id ?? row.movie_id ?? row.tmdbId ?? null;

  const review =
    row.review ?? row.my_review ?? row.body ?? '';

  const whyPick =
    row.why_pick ??
    row.why_this_pick ??
    row.whyPick ??
    '';

  const posterUrl =
    row.poster_url ?? row.custom_poster_url ?? row.poster ?? null;

  const title = row.title ?? row.movie_title ?? null;
  const year = row.year ?? row.release_year ?? null;
  const directorName = row.director ?? row.director_name ?? null;
  const runtimeMinutes =
    row.runtime_minutes ?? row.runtime ?? null;

  const rating =
    row.personal_rating ?? row.rating ?? row.score ?? null;

  const watchedDate = row.watched_date ?? row.created_at ?? null;

  return {
    id: row.id,
    raw: row,
    tmdbId: tmdbId != null ? Number(tmdbId) : null,
    review,
    whyPick,
    posterUrl,
    title,
    year,
    directorName,
    runtimeMinutes,
    rating,
    watchedDate,
  };
}
