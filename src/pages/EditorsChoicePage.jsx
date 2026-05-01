import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import {
  fetchPublishedEditorsChoice,
  normalizeEditorsChoiceRow,
} from '../lib/editorsChoicePublic';
import { getDirector, getMovieDetails, getPosterUrl, formatRating } from '../utils/tmdb';

function formatRuntime(runtimeMinutes) {
  if (runtimeMinutes == null || Number.isNaN(Number(runtimeMinutes))) return null;
  const m = Number(runtimeMinutes);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

function formatDisplayDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function enrichWithTmdb(base) {
  if (!base.tmdbId) {
    return { base, tmdb: null, tmdbFailed: false };
  }
  try {
    const details = await getMovieDetails(base.tmdbId);
    return {
      base,
      tmdb: details,
      tmdbFailed: false,
    };
  } catch {
    return { base, tmdb: null, tmdbFailed: true };
  }
}

function resolveDisplay(enriched) {
  const { base, tmdb, tmdbFailed } = enriched;
  const rowPoster = base.posterUrl;

  const title =
    base.title ||
    tmdb?.title ||
    'Editor’s pick';

  const posterSrc =
    (tmdb?.poster_path ? getPosterUrl(tmdb.poster_path) : null) ||
    (rowPoster && /^https?:\/\//i.test(rowPoster) ? rowPoster : null);

  const year =
    base.year ??
    (tmdb?.release_date ? new Date(tmdb.release_date).getFullYear() : null);

  const director =
    base.directorName ||
    getDirector(tmdb?.credits)?.name ||
    null;

  const runtime = formatRuntime(
    base.runtimeMinutes ?? tmdb?.runtime ?? null,
  );

  const rating =
    base.rating != null && `${base.rating}`.trim() !== ''
      ? base.rating
      : (tmdb?.vote_average ? formatRating(tmdb.vote_average) : null);

  return {
    title,
    posterSrc,
    year,
    director,
    runtime,
    rating,
    review: base.review,
    whyPick: base.whyPick,
    watchedLabel: formatDisplayDate(base.watchedDate),
    tmdbFailed,
    showTmdbNote: !!base.tmdbId && tmdbFailed,
  };
}

const EditorsChoicePage = () => {
  const [enrichedPosts, setEnrichedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await fetchPublishedEditorsChoice();

      if (cancelled) return;

      if (fetchErr) {
        setError(fetchErr.message || 'Could not load Editor’s Choice posts.');
        setEnrichedPosts([]);
        setLoading(false);
        return;
      }

      const normalized = data.map(normalizeEditorsChoiceRow).filter(Boolean);

      try {
        const enriched = await Promise.all(
          normalized.map((base) => enrichWithTmdb(base)),
        );
        if (!cancelled) {
          setEnrichedPosts(enriched);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Something went wrong while loading posts.');
          setEnrichedPosts([]);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen cinema-gradient">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={36} className="text-accent-gold" />
            <h1 className="text-3xl font-bold text-white">Editor&apos;s Choice</h1>
          </div>
          <p className="text-lg text-white/80">
            Movies I watched and wrote up — personal picks only
          </p>
        </motion.div>

        {loading && (
          <div className="bg-cinema-dark/40 border border-cinema-light/20 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4 animate-pulse">🎬</div>
            <p className="text-white font-medium">Loading picks…</p>
          </div>
        )}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-cinema-dark/60 border border-red-400/40 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left"
          >
            <AlertCircle size={40} className="text-accent-red shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Could not load posts</h2>
              <p className="text-white/80 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {!loading && !error && enrichedPosts.length === 0 && (
          <div className="bg-cinema-dark/50 border border-cinema-light/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-bold text-white mb-2">No published picks yet</h2>
            <p className="text-white/70 text-sm max-w-lg mx-auto">
              When rows exist in Supabase with <code className="text-accent-gold/90">is_published = true</code>,
              they will show up here.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          enrichedPosts.map((enriched, index) => {
            const d = resolveDisplay(enriched);
            return (
              <motion.article
                key={enriched.base?.id ?? `post-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(0.15 * index, 0.75) }}
                className="bg-cinema-dark/50 border border-cinema-light/20 rounded-xl p-6 mb-8"
              >
                <div className="text-center mb-4">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-gold/20 text-accent-gold rounded-full text-sm font-medium">
                      <Calendar size={14} />
                      <span>{index === 0 ? 'Latest pick' : 'Pick'}</span>
                    </div>
                    {d.watchedLabel && (
                      <span className="text-white/55 text-xs">
                        Watched {d.watchedLabel}
                      </span>
                    )}
                  </div>
                </div>

                {d.showTmdbNote && (
                  <p className="text-amber-200/90 text-xs text-center mb-4">
                    Poster and credits could not be refreshed from TMDB; showing saved text only.
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="text-center">
                    {d.posterSrc ? (
                      <img
                        src={d.posterSrc}
                        alt=""
                        className="w-full max-w-sm mx-auto rounded-xl shadow-2xl object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full max-w-sm mx-auto h-96 bg-cinema-dark/30 border border-cinema-light/20 rounded-xl flex items-center justify-center">
                        <div className="text-center px-4">
                          <div className="text-6xl mb-4">🎬</div>
                          <p className="text-white/60">{d.title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">{d.title}</h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/70 text-sm">
                      {d.year != null && (
                        <>
                          <span>{d.year}</span>
                          {(d.director || d.runtime || d.rating) && <span>•</span>}
                        </>
                      )}
                      {d.director && (
                        <>
                          <span>{d.director}</span>
                          {(d.runtime || d.rating) && <span>•</span>}
                        </>
                      )}
                      {d.runtime && (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{d.runtime}</span>
                          </div>
                          {d.rating != null && <span>•</span>}
                        </>
                      )}
                      {d.rating != null && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-accent-gold" />
                          <span>{d.rating}</span>
                        </div>
                      )}
                    </div>

                    {d.review ? (
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-white">My review</h3>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                          {d.review}
                        </p>
                      </div>
                    ) : null}

                    {d.whyPick ? (
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-white">Why this pick?</h3>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                          {d.whyPick}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-6">
            <div className="flex items-center justify-center gap-2 text-white/60">
              <User size={14} />
              <span className="text-sm">Personal curation by Caleb Abraham</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditorsChoicePage;
