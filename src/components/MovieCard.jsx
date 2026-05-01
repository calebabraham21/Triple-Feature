import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, User, Globe, Clock } from 'lucide-react';
import { getPosterUrl, getBackdropUrl, truncateText, formatRating, getLanguageName, getWatchProviders, tmdbConfig, getMovieDetails } from '../utils/tmdb';

const MovieCard = ({ movie, showDirector = true }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [mounted, setMounted] = useState(false);

  const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).getFullYear();
  };

  // Normalize fields for API shape (snake_case) or camelCase
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
        const d = await getMovieDetails(movie.id);
        if (!active) return;
        setDetails(d);
      } catch {
        if (!active) return;
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
        {/* Title, Year, and Runtime */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-accent-red transition-colors text-white">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-sm flex-shrink-0 text-white">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-white" />
              <span className="font-medium">{getYear(releaseDate)}</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-white" />
                <span className="font-medium">
                  {movie.runtime >= 60 
                    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                    : `${movie.runtime}m`
                  }
                </span>
              </div>
            )}
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

        <div className="flex gap-2">
          <motion.button
            whileHover={{}}
            whileTap={{}}
            type="button"
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
              className="relative z-10 w-[min(980px,95vw)] max-h-[90vh] overflow-auto overscroll-contain border border-cinema-gray rounded-xl"
              style={{ willChange: 'transform, opacity', contain: 'content' }}
            >
                             {/* Mobile: Full background poster with fade/blur effect */}
               <div className="md:hidden relative min-h-[90vh]">
                 {/* Background poster with blur and fade effect */}
                 <div className="absolute inset-0">
                   <img 
                     src={getPosterUrl(posterPath) || getBackdropUrl(backdropPath)} 
                     alt="" 
                     className="w-full h-full object-cover"
                     loading="lazy" 
                     decoding="async" 
                   />
                   <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                 </div>
                 
                 {/* Close button - positioned outside scrollable content area */}
                 <button
                   onClick={() => setShowDetails(false)}
                   className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 text-white hover:bg-black/80 transition-colors flex items-center justify-center shadow-lg"
                 >
                   ✕
                 </button>
                 
                 {/* Content overlay */}
                 <div className="relative z-10 p-6 text-white pt-16">
                   {/* Title and year */}
                   <h2 className="text-2xl font-bold mb-4 text-shadow-lg">
                     {movie.title} {releaseDate ? `(${getYear(releaseDate)})` : ''}
                   </h2>

                   {/* Key info badges */}
                   <div className="flex flex-wrap gap-2 mb-4">
                     {originalLanguage && (
                       <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
                         {getLanguageName(originalLanguage)}
                       </div>
                     )}
                     {movie.director && (
                       <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
                         Dir. {movie.director}
                       </div>
                     )}
                     {details?.runtime && (
                       <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
                         {details.runtime} min
                       </div>
                     )}
                     {Array.isArray(details?.genres) && details.genres.length > 0 && (
                       <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium">
                         {details.genres.map(g => g.name).join(', ')}
                       </div>
                     )}
                   </div>

                   {/* Description */}
                   {movie.overview && (
                     <div className="mb-6">
                       <p className="text-white/90 leading-relaxed text-base">
                         {movie.overview}
                       </p>
                     </div>
                   )}

                   {/* Cast section */}
                   {(() => {
                     const castNames = details?.credits?.cast?.slice(0, 4)?.map(c => c.name)
                       || (Array.isArray(movie.cast) ? movie.cast.slice(0, 4) : []);
                     if (!castNames || castNames.length === 0) return null;
                     return (
                       <div className="mb-6">
                         <p className="text-white font-medium mb-2">Cast:</p>
                         <div className="flex flex-wrap gap-2">
                           {castNames.map((name) => (
                             <span key={name} className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm text-white">
                               {name}
                             </span>
                           ))}
                         </div>
                       </div>
                     );
                   })()}

                   {/* Streaming providers */}
                   <div className="mb-6">
                     <p className="text-white font-medium mb-3">Where to watch (US):</p>
                     <StreamingProviders movieId={movie.id} delayMs={250} />
                   </div>

                   <div className="flex flex-wrap gap-3">
                     <a
                       href={`https://www.themoviedb.org/movie/${movie.id}`}
                       target="_blank"
                       rel="noreferrer"
                       className="inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-white border border-blue-400/40 hover:border-blue-300/50 transition-all duration-300 bg-gradient-to-r from-blue-900/40 to-blue-800/40 hover:from-blue-800/50 hover:to-blue-700/50 backdrop-blur-sm"
                     >
                       <img 
                         src="/src/assets/TMDB_logo.svg" 
                         alt="TMDB" 
                         className="w-5 h-5"
                       />
                       <span>TMDB</span>
                     </a>
                     <button
                       type="button"
                       onClick={() => setShowDetails(false)}
                       className="inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-white border border-white/25 hover:bg-white/10 transition-colors"
                     >
                       Close
                     </button>
                   </div>
                 </div>
               </div>

              {/* Desktop: Original layout */}
              <div className="hidden md:block bg-cinema-dark p-6">
                <div className="grid grid-cols-[auto_1fr] gap-6 will-change-transform">
                  {/* Left column - Poster + additional content on desktop */}
                  <div className="space-y-6">
                    {/* Poster */}
                    <div className="flex items-start justify-start">
                      <img 
                        src={getPosterUrl(posterPath)} 
                        alt={movie.title} 
                        className="w-auto h-auto max-w-[280px] object-contain rounded-lg bg-cinema-black" 
                        loading="lazy" 
                        decoding="async" 
                      />
                    </div>
                    
                    {/* Cast section - moved to left column on desktop */}
                    {(() => {
                      const castNames = details?.credits?.cast?.slice(0, 4)?.map(c => c.name)
                        || (Array.isArray(movie.cast) ? movie.cast.slice(0, 4) : []);
                      if (!castNames || castNames.length === 0) return null;
                      return (
                        <div className="space-y-3">
                          <p className="text-sm text-white font-medium">Cast:</p>
                          <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                            {castNames.map((name) => (
                              <span key={name} className="px-2.5 py-1.5 rounded-full bg-cinema-gray/50 border border-cinema-light text-xs text-white whitespace-nowrap">
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Right column - Main content */}
                  <div className="flex flex-col h-full">
                    {/* Content area - takes up available space */}
                    <div className="flex-1 space-y-6">
                      {/* Title and key info row for desktop */}
                      <div className="space-y-4">
                        {/* Title with year */}
                        <h2 className="text-2xl font-bold mb-3">
                          {movie.title} {releaseDate ? `(${getYear(releaseDate)})` : ''}
                        </h2>

                        {/* Key Info Blocks - horizontal layout on desktop */}
                        <div className="flex flex-wrap gap-3 mb-0">
                          {originalLanguage && (
                            <div className="px-4 py-2 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs text-white">
                              Language: {getLanguageName(originalLanguage)}
                            </div>
                          )}
                          {movie.director && (
                            <div className="px-4 py-2 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs text-white">
                              Director: {movie.director}
                            </div>
                          )}
                          {details?.runtime && (
                            <div className="px-4 py-2 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs text-white">
                              Runtime: {details.runtime} min
                            </div>
                          )}
                          {Array.isArray(details?.genres) && details.genres.length > 0 && (
                            <div className="px-4 py-2 rounded-full bg-cinema-gray/60 border border-cinema-light text-xs text-white">
                              Genres: {details.genres.map(g => g.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description - better spacing on desktop */}
                      {movie.overview && (
                        <div className="space-y-2">
                          <p className="text-sm text-white leading-relaxed">
                            {movie.overview}
                          </p>
                        </div>
                      )}

                      {/* Streaming providers - now in right column on desktop */}
                      <div className="space-y-4">
                        <p className="text-sm text-white font-medium">Where to watch (US):</p>
                        <StreamingProviders movieId={movie.id} delayMs={250} />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 flex-wrap pt-4 mt-auto">
                      <a
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white border border-blue-800/40 hover:border-blue-700/50 transition-all duration-300 text-sm bg-gradient-to-r from-slate-900 to-blue-950 hover:from-slate-800 hover:to-blue-900 shadow-lg hover:shadow-blue-900/30"
                      >
                        <img 
                          src="/src/assets/TMDB_logo.svg" 
                          alt="TMDB" 
                          className="w-5 h-5"
                        />
                        <span>Read More on TMDB</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowDetails(false)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white border border-red-800/40 hover:border-red-700/50 transition-all duration-300 text-sm bg-gradient-to-r from-slate-900 to-red-950 hover:from-slate-800 hover:to-red-900 shadow-lg hover:shadow-red-900/30"
                      >
                        <span>✕</span>
                        <span>Close</span>
                      </button>
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
