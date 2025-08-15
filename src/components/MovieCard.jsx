import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Check, Calendar, User, Globe, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { getPosterUrl, getBackdropUrl, truncateText, formatRating, getLanguageName, getWatchProviders, tmdbConfig, getMovieDetails } from '../utils/tmdb';

const MovieCard = ({ movie, showAddButton = true, showDirector = true }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isInList = isInWatchlist(movie.id);
  const [showDetails, setShowDetails] = useState(false);
  const [providers, setProviders] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setWatchlistLoading(true);
    try {
      await toggleWatchlist(movie);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  // Normalize fields to support both API shape (snake_case) and watchlist shape (camelCase)
  const posterPath = movie.poster_path || movie.posterPath;
  const backdropPath = movie.backdrop_path || movie.backdropPath;
  const releaseDate = movie.release_date || movie.releaseDate;
  const originalLanguage = movie.original_language || movie.originalLanguage;

  // Lazy-load full details (runtime, genres, full cast) when opening the modal
  useEffect(() => {
    if (!showDetails) return;
    let active = true;
    const load = async () => {
      try {
        setDetailsLoading(true);
        const d = await getMovieDetails(movie.id);
        if (!active) return;
        setDetails(d);
      } catch (e) {
        if (!active) return;
      } finally {
        if (active) setDetailsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [showDetails, movie.id]);

  // Ensure portals mount only on client
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="movie-card group"
    >
      {/* Poster */}
      <div className="relative overflow-hidden h-80">
        {/* Blurred zoomed background using poster or backdrop */}
        <img
          src={
            (posterPath && getPosterUrl(posterPath)) ||
            (backdropPath && getBackdropUrl(backdropPath)) ||
            '/placeholder-poster.jpg'
          }
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        {/* Foreground poster, fully visible without cropping */}
        <img
          src={getPosterUrl(posterPath) || '/placeholder-poster.jpg'}
          alt={movie.title}
          className="relative z-10 w-full h-full object-contain"
          onError={(e) => {
            e.target.src = '/placeholder-poster.jpg';
          }}
        />

        {/* Rating badge */}
        {movie.vote_average && (
          <div className="absolute top-2 right-2 z-20 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-sm">
            <Star size={14} className="text-accent-gold fill-current" />
            <span className="font-semibold">{formatRating(movie.vote_average)}</span>
          </div>
        )}
        {/* Language badge */}
        {originalLanguage && (
          <div className="absolute top-2 left-2 z-20 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs text-white">
            <Globe size={12} className="opacity-80" />
            <span className="font-medium">{getLanguageName(originalLanguage)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Year */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-accent-red transition-colors text-white">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 text-sm flex-shrink-0 text-white">
            <Calendar size={14} className="text-white" />
            <span className="font-medium">{getYear(releaseDate)}</span>
          </div>
        </div>

        {/* Director */}
        {showDirector && movie.director && (
          <div className="flex items-center gap-2 text-sm text-white mb-2">
            <User size={14} className="text-white" />
            <span className="font-medium">Dir. {movie.director}</span>
          </div>
        )}

        {/* Overview */}
        <p className="text-sm text-white mb-4 leading-relaxed">
          {truncateText(movie.overview, 120)}
        </p>

        {/* Cast (if available) */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white mb-1">Cast:</p>
            <p className="text-sm text-white">
              {movie.cast.slice(0, 2).join(', ')}
              {movie.cast.length > 2 && '...'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {showAddButton && (
            <motion.button
              whileHover={{}}
              whileTap={{}}
              onClick={handleAddToWatchlist}
              disabled={watchlistLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                isInList
                  ? 'bg-accent-gold text-cinema-black hover:bg-accent-gold/80'
                  : 'bg-cinema-gray text-white hover:bg-cinema-light border border-cinema-light hover:border-accent-blue'
              } ${watchlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {watchlistLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {isInList ? 'Removing...' : 'Adding...'}
                </>
              ) : isInList ? (
                <>
                  <Check size={16} />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus size={16} />
                  {isAuthenticated ? 'Add to Watchlist' : 'Sign in to Save'}
                </>
              )}
            </motion.button>
          )}
          <motion.button
            whileHover={{}}
            whileTap={{}}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-cinema-dark text-white border border-cinema-light hover:bg-cinema-gray"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </motion.button>
        </div>
      </div>

      {/* Details Modal */}
      {mounted && createPortal(
        (<AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/65"
              onClick={() => setShowDetails(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 w-[min(980px,95vw)] max-h-[90vh] overflow-auto overscroll-contain bg-cinema-dark border border-cinema-gray rounded-xl p-3 sm:p-6"
              style={{ willChange: 'transform, opacity', contain: 'content' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 will-change-transform">
                {/* Poster - smaller on mobile, centered on mobile, left-aligned on desktop */}
                <div className="flex items-start justify-center md:justify-start">
                  <img 
                    src={getPosterUrl(posterPath)} 
                    alt={movie.title} 
                    className="w-32 h-48 sm:w-40 sm:h-60 md:w-full md:max-w-sm object-contain rounded-lg bg-cinema-black" 
                    loading="lazy" 
                    decoding="async" 
                  />
                </div>
                
                {/* Content - tighter spacing on mobile */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Title with year - smaller on mobile */}
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                    {movie.title} {releaseDate ? `(${getYear(releaseDate)})` : ''}
                  </h2>

                  {/* Description - shorter on mobile */}
                  {movie.overview && (
                    <p className="text-sm sm:text-base text-white leading-relaxed mb-3 sm:mb-5 line-clamp-3 sm:line-clamp-none">
                      {movie.overview}
                    </p>
                  )}

                  {/* Key Info Blocks - tighter spacing on mobile */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-5">
                    {originalLanguage && (
                      <div className="px-2 py-1 sm:px-3 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs sm:text-sm text-white">
                        Language: {getLanguageName(originalLanguage)}
                      </div>
                    )}
                    {movie.director && (
                      <div className="px-2 py-1 sm:px-3 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs sm:text-sm text-white">
                        Director: {movie.director}
                      </div>
                    )}
                    {details?.runtime && (
                      <div className="px-2 py-1 sm:px-3 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs sm:text-sm text-white">
                        Runtime: {details.runtime} min
                      </div>
                    )}
                    {Array.isArray(details?.genres) && details.genres.length > 0 && (
                      <div className="px-2 py-1 sm:px-3 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs sm:text-sm text-white">
                        Genres: {details.genres.map(g => g.name).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Cast - smaller on mobile */}
                  {(() => {
                    const castNames = details?.credits?.cast?.slice(0, 4)?.map(c => c.name)
                      || (Array.isArray(movie.cast) ? movie.cast.slice(0, 4) : []);
                    if (!castNames || castNames.length === 0) return null;
                    return (
                      <div className="mb-4 sm:mb-6">
                        <p className="text-xs sm:text-sm text-white mb-1.5 sm:mb-2">Cast:</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {castNames.map((name) => (
                            <span key={name} className="px-2 py-1 sm:px-3 rounded-full bg-cinema-gray/50 border border-cinema-light text-xs sm:text-sm text-white">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Streaming providers (US) */}
                  <StreamingProviders movieId={movie.id} delayMs={250} />

                  {/* Buttons - smaller on mobile */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{}}
                      whileTap={{}}
                      onClick={handleAddToWatchlist}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                        isInList
                          ? 'bg-accent-gold text-cinema-black hover:bg-accent-gold/80'
                          : 'bg-cinema-gray text-white hover:border-accent-blue'
                      }`}
                    >
                      {isInList ? 'In Watchlist' : 'Add to Watchlist'}
                    </motion.button>
                    <motion.button
                      whileHover={{}}
                      whileTap={{}}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-lg font-medium bg-cinema-dark text-white border border-cinema-light hover:bg-cinema-gray text-sm sm:text-base"
                      onClick={() => setShowDetails(false)}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>), document.body)}
    </motion.div>
  );
};

// Fetch and render US streaming providers grouped by subcategory
const StreamingProviders = ({ movieId, delayMs = 0 }) => {
  const [state, setState] = useState({
    groups: null,
    link: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (delayMs) {
          await new Promise((r) => setTimeout(r, delayMs));
        }
        const data = await getWatchProviders(movieId);
        const us = data?.results?.US;
        const link = us?.link || null;
        const groups = {
          Free: us?.free || [],
          Subscription: us?.flatrate || [],
          'Ad-supported': us?.ads || [],
          Rent: us?.rent || [],
          Buy: us?.buy || [],
        };
        if (!active) return;
        setState({ groups, link, loading: false });
      } catch (e) {
        if (!active) return;
        setState({ groups: null, link: null, loading: false });
      }
    };
    load();
    return () => { active = false; };
  }, [movieId]);

  const { groups, link, loading } = state;
  if (loading) return null;
  const nonEmpty = groups && Object.entries(groups).filter(([, arr]) => Array.isArray(arr) && arr.length > 0);
  if (!nonEmpty || nonEmpty.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <p className="text-xs sm:text-sm text-white mb-1.5 sm:mb-2">Where to watch (US):</p>
      {nonEmpty.map(([label, list]) => (
        <div key={label} className="mb-2 sm:mb-3">
          <p className="text-xs text-white mb-1">{label}</p>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {list.map((p) => (
              <div key={`${label}-${p.provider_id}`} className="flex items-center gap-1.5 sm:gap-2 bg-cinema-gray/60 border border-cinema-light rounded-full px-2 py-1">
                {p.logo_path && (
                  <img
                    src={`${tmdbConfig.imageBaseURL}/original${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="text-xs sm:text-sm text-white">{p.provider_name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {link && (
        <a href={link} target="_blank" rel="noreferrer" className="text-xs sm:text-sm underline text-accent-blue">
          See more options on TMDB
        </a>
      )}
    </div>
  );
};

export default MovieCard;
