import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar, Clock, User } from 'lucide-react';

const EditorsChoicePage = () => {
  // Placeholder data for the weekly movie
  const weeklyMovie = {
    title: "The Grand Budapest Hotel",
    year: 2014,
    director: "Wes Anderson",
    runtime: 99,
    rating: 8.1,
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6LFhQxrZQjWkqQwq.jpg",
    review: "A whimsical masterpiece that showcases Wes Anderson's signature style at its finest. The film's meticulous production design, deadpan humor, and ensemble cast create a delightful cinematic experience that's both visually stunning and emotionally resonant.",
    whyPick: "This week's pick celebrates the art of storytelling through visual comedy and character-driven narratives. It's a perfect example of how cinema can transport us to entirely new worlds while making us laugh and think."
  };

  return (
    <div className="min-h-screen cinema-gradient pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={48} className="text-accent-gold" />
            <h1 className="text-4xl font-bold text-white">Editor's Choice</h1>
          </div>
          <p className="text-xl text-white/80">
          My personal pick of the week
          </p>
        </motion.div>

        {/* Weekly Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cinema-dark/50 border border-cinema-light/20 rounded-2xl p-8 mb-12"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/20 text-accent-gold rounded-full text-sm font-medium mb-4">
              <Calendar size={16} />
              <span>This Week's Pick</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Movie Poster */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <img
                src={weeklyMovie.poster}
                alt={weeklyMovie.title}
                className="w-full max-w-sm mx-auto rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* Movie Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-white">{weeklyMovie.title}</h2>
              
              {/* Movie Meta */}
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span>{weeklyMovie.year}</span>
                <span>•</span>
                <span>{weeklyMovie.director}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{weeklyMovie.runtime} min</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-accent-gold" />
                  <span>{weeklyMovie.rating}</span>
                </div>
              </div>

              {/* Review */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">My Review</h3>
                <p className="text-white/80 leading-relaxed">{weeklyMovie.review}</p>
              </div>

              {/* Why This Pick */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Why This Pick?</h3>
                <p className="text-white/80 leading-relaxed">{weeklyMovie.whyPick}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">More Reviews Coming Soon</h2>
            <p className="text-white/70 text-lg mb-6">
              I'll be adding new movie reviews every week. Each pick will be personally selected 
              and reviewed based on storytelling, cinematography, and overall impact.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60">
              <User size={16} />
              <span>Personal curation by Caleb Abraham</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditorsChoicePage;
