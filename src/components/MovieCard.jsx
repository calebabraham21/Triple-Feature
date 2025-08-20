import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Check, Calendar, User, Globe, Heart, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../hooks/useAuth';
import { getPosterUrl, getBackdropUrl, formatRating, getLanguageName, getWatchProviders, tmdbConfig, getMovieDetails } from '../utils/tmdb';
import GlowButton from './GlowButton';

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
    
    // Lock background scroll when modal is open
    document.body.style.overflow = 'hidden';
    
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
    
    // Cleanup function to restore scroll when modal closes or component unmounts
    return () => { 
      active = false;
      document.body.style.overflow = 'unset';
    };
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

        {/* Rating badge (top-right) */}
        {movie.vote_average && (
          <div className="absolute top-2 right-2 z-20 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm shadow-md">
            <Star size={16} className="text-accent-gold fill-current" />
            <span className="font-semibold">{formatRating(movie.vote_average)}</span>
          </div>
        )}
        {/* Language badge (top-left) */}
        {originalLanguage && (
          <div className="absolute top-2 left-2 z-20 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm text-white shadow-md">
            <Globe size={14} className="opacity-80" />
            <span className="font-medium">{getLanguageName(originalLanguage)}</span>
          </div>
        )}
        {/* Year badge (bottom-left) */}
        {releaseDate && (
          <div className="absolute bottom-2 left-2 z-20 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm text-white shadow-md">
            <Calendar size={14} className="opacity-80" />
            <span className="font-medium">{getYear(releaseDate)}</span>
          </div>
        )}
        {/* Runtime badge (bottom-right) */}
        {movie.runtime && (
          <div className="absolute bottom-2 right-2 z-20 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm text-white shadow-md">
            <Clock size={14} className="opacity-80" />
            <span className="font-medium">
              {movie.runtime >= 60 
                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                : `${movie.runtime}m`}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title only with single-line clamp */}
        <div className="mb-5">
          <h3 className="font-semibold text-lg leading-tight text-white line-clamp-1">{movie.title}</h3>
        </div>

        {/* Director */}
        {showDirector && movie.director && (
          <div className="flex items-center gap-2 text-sm text-white mb-4">
            <User size={14} className="text-white" />
            <span className="font-medium">Dir. {movie.director}</span>
          </div>
        )}

        {/* Overview */}
        <p className="text-sm text-white mb-4 leading-relaxed line-clamp-3">{movie.overview}</p>

        {/* Action buttons */}
        <div className="flex gap-2">
          {showAddButton && (
            <GlowButton
              onClick={handleAddToWatchlist}
              disabled={watchlistLoading}
              className={`flex-1 text-sm py-2.5 px-3 md:px-4 gradient-button spotlight-button text-white border-0 shadow-lg hover:shadow-xl ${watchlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            </GlowButton>
          )}
          <GlowButton
            variant="secondary"
            className="flex-1 text-sm py-2.5 px-3 md:px-4 hover:border-accent-blue/60"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </GlowButton>
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
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ willChange: 'opacity' }}
          >
            {/* No backdrop blur for performance */}
            {/* Faded tint layer (click to close) */}
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setShowDetails(false)}
            />
            
            {/* Modal wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative z-10 w-[min(980px,95vw)] max-h-[90vh] rounded-xl border border-cinema-gray/30 bg-cinema-dark overflow-hidden"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Scrollable content (header included so it scrolls away) */}
              <div className="relative overflow-y-auto will-change-transform" style={{ maxHeight: '90vh', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                {/* Floating close button (pinned) */}
                <button
                  onClick={() => setShowDetails(false)}
                  aria-label="Close"
                  className="absolute top-2 left-2 sm:top-3 sm:left-3 z-50 p-2 rounded-full bg-cinema-dark/80 border border-cinema-light/30 text-white hover:bg-cinema-gray/80 shadow-md"
                >
                  <X size={18} />
                </button>
                {/* Header: Backdrop + Poster (use CSS mask to avoid border seam) */}
                <div className="relative h-48 sm:h-56 overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
                  {/* Backdrop image */}
                  <div 
                    className="absolute -inset-1 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${backdropPath ? getBackdropUrl(backdropPath, 'original') : (posterPath ? getPosterUrl(posterPath, 'original') : '')})`,
                      transform: 'scale(1.05)'
                    }}
                  />
                  {/* Subtle dark veil to improve text contrast */}
                  <div className="absolute inset-0 bg-black/70 pointer-events-none" aria-hidden="true" />
                  {/* Progressive fade overlay to base grey */}
                  <div
                    className="absolute -inset-1 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(26,26,26,0) 0%, rgba(26,26,26,0) 68%, rgba(26,26,26,0.55) 84%, rgba(26,26,26,0.85) 94%, rgba(26,26,26,1) 100%)'
                    }}
                  />
                  {/* Poster over backdrop */}
                  <div className="absolute top-4 right-4 z-50">
                    <img 
                      src={getPosterUrl(posterPath)} 
                      alt={movie.title} 
                      className="w-28 h-42 sm:w-32 sm:h-48 object-cover rounded-lg shadow-2xl border-2 border-white/40" 
                      loading="lazy" 
                      decoding="async" 
                    />
                  </div>
                  {/* Overlayed heading & meta */}
                  <div className="absolute inset-x-4 bottom-3 sm:bottom-4 z-40 pr-28 sm:pr-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow leading-tight line-clamp-3">{movie.title}</h2>
                      {releaseDate && (
                        <span className="text-white/85">{getYear(releaseDate)}</span>
                      )}
                    </div>
                    {movie.director && (
                      <p className="text-sm text-white/90 leading-snug">Directed by <span className="font-medium">{movie.director}</span></p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-white/80 mt-1">
                      {(details?.runtime || movie.runtime) && (
                        <span>{details?.runtime || movie.runtime} min</span>
                      )}
                      {originalLanguage && (details?.runtime || movie.runtime) && (<span>•</span>)}
                      {originalLanguage && (
                        <span>{getLanguageName(originalLanguage)}</span>
                      )}
                      {Array.isArray(details?.genres) && details.genres.length > 0 && originalLanguage && (<span>•</span>)}
                      {Array.isArray(details?.genres) && details.genres.length > 0 && (
                        <span>{details.genres.map(g => g.name).slice(0, 3).join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 pt-4 sm:pt-6">
                {/* Letterboxd-style vertical layout */}
                <div className="space-y-4">
                  {/* Title/meta moved over backdrop */}

                  {/* Description */}
                  {movie.overview && (
                    <div className="space-y-2">
                      <p className="text-sm text-white leading-relaxed">
                        {movie.overview}
                      </p>
                    </div>
                  )}

                  {/* Cast section */}
                  <div className="space-y-3">
                    {(() => {
                      const castNames = details?.credits?.cast?.slice(0, 6)?.map(c => c.name)
                        || (Array.isArray(movie.cast) ? movie.cast.slice(0, 6) : []);
                      if (!castNames || castNames.length === 0) return null;
                      return (
                        <div className="space-y-2">
                          <p className="text-sm text-white font-medium">Cast</p>
                          <div className="flex flex-wrap gap-1.5">
                            {castNames.map((name) => (
                              <span key={name} className="px-2.5 py-1 rounded-full bg-cinema-gray/50 border border-cinema-light text-xs text-white">
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Streaming providers */}
                  <div className="space-y-3">
                    <p className="text-sm text-white font-medium">Where to watch (US)</p>
                    <StreamingProviders movieId={movie.id} delayMs={250} />
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 pt-4">
                    <GlowButton
                      onClick={handleAddToWatchlist}
                      className="text-sm py-2.5 px-2 md:px-3 md:py-2.5 gradient-button spotlight-button text-white border-0 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center gap-2">
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
                      </span>
                    </GlowButton>
                    <a
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2.5 md:px-4 md:py-2.5 rounded-lg font-medium text-white border border-blue-800/40 hover:border-blue-700/50 transition-all duration-300 text-sm bg-gradient-to-r from-slate-900 to-blue-950 hover:from-slate-800 hover:to-blue-900 shadow-lg hover:shadow-blue-900/30"
                    >
                      <img 
                        src="/TMDB_logo.svg" 
                        alt="TMDB" 
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <span className="hidden sm:inline">Read More on TMDB</span>
                      <span className="sm:hidden">TMDB</span>
                    </a>
                  </div>
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
  
  // Group rent and buy together, keep others separate
  const combinedGroups = {};
  if (groups) {
    // Keep Free, Subscription, and Ad-supported as separate sections
    if (groups.Free && groups.Free.length > 0) combinedGroups.Free = groups.Free;
    if (groups.Subscription && groups.Subscription.length > 0) combinedGroups.Subscription = groups.Subscription;
    if (groups['Ad-supported'] && groups['Ad-supported'].length > 0) combinedGroups['Ad-supported'] = groups['Ad-supported'];
    
    // Combine Rent and Buy into one section, deduplicating providers
    const rentAndBuy = [];
    const seenProviders = new Set();
    
    if (groups.Rent && groups.Rent.length > 0) {
      groups.Rent.forEach(provider => {
        if (!seenProviders.has(provider.provider_id)) {
          rentAndBuy.push(provider);
          seenProviders.add(provider.provider_id);
        }
      });
    }
    
    if (groups.Buy && groups.Buy.length > 0) {
      groups.Buy.forEach(provider => {
        if (!seenProviders.has(provider.provider_id)) {
          rentAndBuy.push(provider);
          seenProviders.add(provider.provider_id);
        }
      });
    }
    
    if (rentAndBuy.length > 0) combinedGroups['Rent or Buy'] = rentAndBuy;
  }
  
  const nonEmpty = Object.entries(combinedGroups).filter(([, arr]) => Array.isArray(arr) && arr.length > 0);
  if (!nonEmpty || nonEmpty.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-white/60 italic">Currently not available for streaming in the US</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {nonEmpty.map(([label, list]) => (
        <div key={label} className="space-y-2">
          <p className="text-xs text-white font-medium">{label}</p>
          <div className="flex flex-wrap items-center gap-1 md:gap-1.5">
            {list.map((p) => (
              <div key={`${label}-${p.provider_id}`} className="flex items-center gap-1.5 bg-cinema-gray/60 border border-cinema-light rounded-full px-2 py-1 md:px-2.5 md:py-1.5">
                {p.logo_path && (
                  <img
                    src={`${tmdbConfig.imageBaseURL}/original${p.logo_path}`}
                    alt={p.provider_name}
                    className="w-5 h-5 md:w-5 md:h-5 object-contain rounded"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="text-xs md:text-sm text-white whitespace-nowrap">{p.provider_name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default MovieCard;
