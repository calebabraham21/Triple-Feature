import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  getPosterUrl,
  getBackdropUrl,
  formatRating,
  getLanguageName,
  getWatchProviders,
  tmdbConfig,
  getMovieDetails,
} from '../utils/tmdb';

const MovieCard = ({ movie, showDirector = true }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [mounted, setMounted] = useState(false);

  const getYear = (dateString) => (dateString ? new Date(dateString).getFullYear() : null);

  const posterPath = movie.poster_path || movie.posterPath;
  const backdropPath = movie.backdrop_path || movie.backdropPath;
  const releaseDate = movie.release_date || movie.releaseDate;
  const originalLanguage = movie.original_language || movie.originalLanguage;

  useEffect(() => {
    if (!showDetails) return;
    document.body.style.overflow = 'hidden';
    let active = true;
    getMovieDetails(movie.id)
      .then((d) => { if (active) setDetails(d); })
      .catch(() => {});
    return () => {
      active = false;
      document.body.style.overflow = 'unset';
    };
  }, [showDetails, movie.id]);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* Archive row */}
      <div
        className="archive-row"
        onClick={() => setShowDetails(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowDetails(true)}
        aria-haspopup="dialog"
      >
        {/* Poster thumbnail */}
        <div className="flex-shrink-0 w-14 sm:w-16">
          <div className="aspect-[2/3] overflow-hidden rounded-sm bg-smoke">
            <img
              src={getPosterUrl(posterPath, 'w185') || '/placeholder-poster.jpg'}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/placeholder-poster.jpg'; }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="font-cinema text-sm sm:text-base font-medium text-ink line-clamp-1 leading-snug">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2.5 text-xs text-fog flex-shrink-0 font-mono">
              {movie.vote_average && <span>{formatRating(movie.vote_average)}</span>}
              {releaseDate && getYear(releaseDate) && <span>{getYear(releaseDate)}</span>}
            </div>
          </div>

          {showDirector && movie.director && (
            <div className="text-xs text-fog line-clamp-1">
              Dir. {movie.director}
              {originalLanguage && originalLanguage !== 'en' && (
                <span className="ml-2 opacity-70">· {getLanguageName(originalLanguage)}</span>
              )}
            </div>
          )}

          {movie.overview && (
            <p className="text-xs text-fog mt-0.5 line-clamp-2 leading-relaxed">{movie.overview}</p>
          )}
        </div>
      </div>

      {/* Film detail modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
              style={{ willChange: 'opacity' }}
            >
              <div
                className="absolute inset-0 bg-ink/50"
                onClick={() => setShowDetails(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                className="relative z-10 w-full sm:w-[min(900px,95vw)] max-h-[92vh] sm:max-h-[88vh] bg-frame rounded-t-2xl sm:rounded-xl overflow-hidden border border-smoke shadow-2xl"
                style={{ willChange: 'transform, opacity' }}
              >
                <div
                  className="overflow-y-auto overflow-x-hidden"
                  style={{ maxHeight: '92vh', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setShowDetails(false)}
                    aria-label="Close"
                    className="absolute top-3 right-3 z-50 p-1.5 rounded-full bg-frame/90 border border-smoke text-fog hover:text-ink transition-colors"
                  >
                    <X size={16} />
                  </button>

                  {/* Hero image — desaturated for editorial feel */}
                  <div className="relative overflow-hidden bg-reel" style={{ aspectRatio: '16/7', minHeight: '180px' }}>
                    {(backdropPath || posterPath) && (
                      <img
                        src={
                          backdropPath
                            ? getBackdropUrl(backdropPath, 'original')
                            : getPosterUrl(posterPath, 'original')
                        }
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover"
                        style={{ filter: 'saturate(0.25) brightness(0.65)' }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-reel/80" />
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    {/* Title + meta */}
                    <div className="mb-6">
                      <h2 className="font-cinema text-2xl sm:text-3xl font-medium text-ink leading-tight mb-2">
                        {movie.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-fog">
                        {releaseDate && getYear(releaseDate) && <span>{getYear(releaseDate)}</span>}
                        {(details?.runtime || movie.runtime) && (
                          <><span className="text-ash">·</span><span>{details?.runtime || movie.runtime} min</span></>
                        )}
                        {Array.isArray(details?.genres) && details.genres.length > 0 && (
                          <><span className="text-ash">·</span><span>{details.genres.map((g) => g.name).slice(0, 3).join(', ')}</span></>
                        )}
                        {movie.director && (
                          <><span className="text-ash">·</span><span>Dir. {movie.director}</span></>
                        )}
                      </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid sm:grid-cols-[1fr_160px] gap-8">
                      {/* Main column */}
                      <div className="space-y-6 min-w-0">
                        {movie.overview && (
                          <p className="text-sm text-ink leading-relaxed">{movie.overview}</p>
                        )}

                        {/* Cast */}
                        {(() => {
                          const castNames =
                            details?.credits?.cast?.slice(0, 6)?.map((c) => c.name) ||
                            (Array.isArray(movie.cast) ? movie.cast.slice(0, 6) : []);
                          if (!castNames?.length) return null;
                          return (
                            <div>
                              <div className="text-xs font-semibold tracking-widest uppercase text-fog mb-2">Cast</div>
                              <div className="flex flex-wrap gap-1.5">
                                {castNames.map((name) => (
                                  <span
                                    key={name}
                                    className="text-xs px-2.5 py-1 bg-smoke border border-ash rounded-full text-ink"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Streaming */}
                        <div>
                          <div className="text-xs font-semibold tracking-widest uppercase text-fog mb-2">Where to watch (US)</div>
                          <StreamingProviders movieId={movie.id} delayMs={200} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-5 pt-1">
                          <a
                            href={`https://www.themoviedb.org/movie/${movie.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-fog hover:text-ink transition-colors underline underline-offset-2"
                          >
                            <img src="/TMDB_logo.svg" alt="TMDB" className="w-4 h-4 opacity-50" />
                            More on TMDB
                          </a>
                          <button
                            type="button"
                            onClick={() => setShowDetails(false)}
                            className="text-xs text-fog hover:text-ink transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-4">
                        {posterPath && (
                          <div className="aspect-[2/3] overflow-hidden rounded bg-smoke">
                            <img
                              src={getPosterUrl(posterPath)}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="space-y-3 text-xs">
                          {movie.director && (
                            <div>
                              <div className="font-semibold tracking-widest uppercase text-fog/60 mb-0.5">Director</div>
                              <div className="text-ink">{movie.director}</div>
                            </div>
                          )}
                          {originalLanguage && (
                            <div>
                              <div className="font-semibold tracking-widest uppercase text-fog/60 mb-0.5">Language</div>
                              <div className="text-ink">{getLanguageName(originalLanguage)}</div>
                            </div>
                          )}
                          {releaseDate && (
                            <div>
                              <div className="font-semibold tracking-widest uppercase text-fog/60 mb-0.5">Released</div>
                              <div className="text-ink">
                                {new Date(releaseDate).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          )}
                          {movie.vote_average && (
                            <div>
                              <div className="font-semibold tracking-widest uppercase text-fog/60 mb-0.5">Rating</div>
                              <div className="text-ink">{formatRating(movie.vote_average)} / 10</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

const StreamingProviders = ({ movieId, delayMs = 0 }) => {
  const [state, setState] = useState({ groups: null, loading: true });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
        const data = await getWatchProviders(movieId);
        const us = data?.results?.US;
        const groups = {
          Free: us?.free || [],
          Subscription: us?.flatrate || [],
          'Ad-supported': us?.ads || [],
          Rent: us?.rent || [],
          Buy: us?.buy || [],
        };
        if (!active) return;
        setState({ groups, loading: false });
      } catch {
        if (!active) return;
        setState({ groups: null, loading: false });
      }
    };
    load();
    return () => { active = false; };
  }, [movieId, delayMs]);

  const { groups, loading } = state;
  if (loading) return null;

  const combinedGroups = {};
  if (groups) {
    if (groups.Free?.length) combinedGroups.Free = groups.Free;
    if (groups.Subscription?.length) combinedGroups.Subscription = groups.Subscription;
    if (groups['Ad-supported']?.length) combinedGroups['Ad-supported'] = groups['Ad-supported'];

    const rentAndBuy = [];
    const seen = new Set();
    [...(groups.Rent || []), ...(groups.Buy || [])].forEach((p) => {
      if (!seen.has(p.provider_id)) { rentAndBuy.push(p); seen.add(p.provider_id); }
    });
    if (rentAndBuy.length) combinedGroups['Rent or Buy'] = rentAndBuy;
  }

  const nonEmpty = Object.entries(combinedGroups).filter(([, arr]) => arr?.length);
  if (!nonEmpty.length) {
    return (
      <p className="text-xs text-fog italic">Not currently available for streaming in the US</p>
    );
  }

  return (
    <div className="space-y-3">
      {nonEmpty.map(([label, list]) => (
        <div key={label}>
          <p className="text-xs text-fog/70 mb-1.5">{label}</p>
          <div className="flex flex-wrap gap-1.5">
            {list.map((p) => (
              <div
                key={`${label}-${p.provider_id}`}
                className="flex items-center gap-1.5 border border-ash rounded-full px-2.5 py-1 bg-smoke"
              >
                {p.logo_path && (
                  <img
                    src={`${tmdbConfig.imageBaseURL}/original${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-4 h-4 object-contain rounded"
                    loading="lazy"
                  />
                )}
                <span className="text-xs text-ink whitespace-nowrap">{p.provider_name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieCard;
