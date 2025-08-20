import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchMovieByTitle, getPosterUrl } from '../utils/tmdb';

const EditorsChoicePage = () => {
  // Placeholder data for the weekly movie
  const weeklyMovie = {
    title: "Coming Soon",
    year: "TBD",
    director: "TBD",
    runtime: "TBD",
    rating: "TBD",
    poster: null,
    review: "Weekly movie reviews are coming soon. Each week I’ll share quick thoughts on a movie I watched for the first time. Honestly this is just to keep me motivated to watch at least one new one every week.",
    whyPick: "Who knows just yet!"
  };

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const queries = [
          { title: 'Mulholland Drive', year: 2001 },
          { title: 'Paris, Texas', year: 1984 },
          { title: 'The Big Lebowski', year: 1998 },
        ];
        const results = await Promise.all(
          queries.map(async (q) => {
            const r = await searchMovieByTitle(q.title, q.year);
            const m = r?.results?.[0];
            return m ? { id: m.id, title: m.title, poster_path: m.poster_path, year: q.year } : null;
          })
        );
        if (!active) return;
        setFavorites(results.filter(Boolean));
      } catch (e) {
        if (!active) return;
        setFavorites([]);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen app-gradient">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={36} className="text-accent-gold" />
            <h1 className="text-3xl font-bold text-white">Editor's Choice</h1>
          </div>
          <p className="text-lg text-white/80">
          My personal pick of the week
          </p>
        </motion.div>

        {/* Weekly Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cinema-dark/50 border border-cinema-light/20 rounded-xl p-6 mb-8"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-gold/20 text-accent-gold rounded-full text-sm font-medium mb-3">
              <Calendar size={14} />
              <span>This Week's Pick</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Movie Poster */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              {weeklyMovie.poster ? (
                <img
                  src={weeklyMovie.poster}
                  alt={weeklyMovie.title}
                  className="w-full max-w-sm mx-auto rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-sm mx-auto h-96 bg-cinema-dark/30 border border-cinema-light/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-white/60 text-lg">Coming Soon</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Movie Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-2xl font-bold text-white">{weeklyMovie.title}</h2>
              
              {/* Movie Meta */}
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span>{weeklyMovie.year}</span>
                <span>•</span>
                <span>{weeklyMovie.director}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{weeklyMovie.runtime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-accent-gold" />
                  <span>{weeklyMovie.rating}</span>
                </div>
              </div>

              {/* Review */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">My Review</h3>
                <p className="text-white/80 text-sm leading-relaxed">{weeklyMovie.review}</p>
              </div>

              {/* Why This Pick */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">Why This Pick?</h3>
                <p className="text-white/80 text-sm leading-relaxed">{weeklyMovie.whyPick}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Favorites mini section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cinema-dark/40 border border-cinema-light/20 rounded-xl p-4 md:p-5 mb-8 side-rails"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">My all‑time favorites</h3>
            <span className="text-xs text-white/60">Top 3</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {favorites.map((m, idx) => (
              <div key={m.id} className="bg-cinema-dark/40 border border-cinema-light/20 rounded-lg p-2 text-center">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md mb-2">
                  {m.poster_path ? (
                    <img src={getPosterUrl(m.poster_path)} alt={m.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-cinema-gray flex items-center justify-center text-white/60">No poster</div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-cinema-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">#{idx + 1}</div>
                </div>
                <div className="text-xs text-white line-clamp-2">{m.title}</div>
                <div className="text-[10px] text-white/70">{m.year}</div>
              </div>
            ))}
          </div>
        </motion.div>

  
      </div>
    </div>
  );
};

export default EditorsChoicePage;
