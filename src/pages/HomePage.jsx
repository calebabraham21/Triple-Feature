import { motion } from 'framer-motion';
import { useRecommendations } from '../hooks/useRecommendations';
import MovieCard from '../components/MovieCard';
import { ChevronLeft, ChevronRight, Sparkles, Clock, Users, Heart } from 'lucide-react';
import TripFeatLogo from '../../TripFeatLogo.png';
import GlowButton from '../components/GlowButton';
// Using public asset path for reliability in dev/prod

const HomePage = () => {
  const {
    genres,
    selectedGenres,
    selectedDecades,
    selectedMood,
    recommendations,
    loading,
    error,
    currentStep,
    setSelectedGenres,
    setSelectedDecades,
    setSelectedMood,
    generateRecommendations,
    resetFlow,
    nextStep,
    prevStep,
    toggleGenre,
    toggleDecade,
    getDecadeOptions,
    getMoodOptions,
  } = useRecommendations();

  const moodOptions = getMoodOptions();
  const decadeOptions = getDecadeOptions();

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Your Preferences</h2>
        <p className="text-cinema-light">Select genres and decade to get personalized recommendations</p>
      </div>

      {/* Genres */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold select-none">Genres</h3>
          <p className="text-sm text-cinema-light">Choose up to 2 genres</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {genres.map((genre) => (
            <motion.button
              key={genre.id}
              whileHover={{}}
              whileTap={{}}
              onClick={() => toggleGenre(genre.id)}
              className={`p-3 rounded-lg font-medium trace-snake ${
                selectedGenres.includes(genre.id)
                  ? 'bg-accent-red text-white shadow-lg'
                  : `${selectedGenres.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''} bg-cinema-gray text-white border border-cinema-light`
              }`}
              disabled={!selectedGenres.includes(genre.id) && selectedGenres.length >= 2}
            >
              <span className="relative z-10">{genre.name}</span>
              <span className="trace-line trace-line--t" />
              <span className="trace-line trace-line--r" />
              <span className="trace-line trace-line--b" />
              <span className="trace-line trace-line--l" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Decades */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold">Decades</h3>
          <div className="flex items-center gap-2">
            <GlowButton
              variant="secondary"
              onClick={() => setSelectedDecades(decadeOptions.map(d => d.value))}
              className="py-2 px-3 text-sm"
            >
              Select All
            </GlowButton>
            <GlowButton
              variant="secondary"
              onClick={() => setSelectedDecades([])}
              className="py-2 px-3 text-sm"
            >
              Clear All
            </GlowButton>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {decadeOptions.map((decade) => {
            const isSelected = selectedDecades.includes(decade.value);
            return (
              <motion.button
                key={decade.value}
                whileHover={{}}
                whileTap={{}}
                onClick={() => toggleDecade(decade.value)}
                className={`py-2 px-3 rounded-md text-sm border trace-snake ${
                  isSelected
                    ? 'bg-accent-blue/20 text-white border-accent-blue'
                    : 'bg-cinema-gray text-white border-cinema-light'
                }`}
              >
                <span className="relative z-10">{decade.label}</span>
                <span className="trace-line trace-line--t" />
                <span className="trace-line trace-line--r" />
                <span className="trace-line trace-line--b" />
                <span className="trace-line trace-line--l" />
              </motion.button>
            );
          })}
        </div>
        <p className="text-xs text-cinema-light mt-2">By default, all decades are selected.</p>
      </div>

      {/* Next button */}
      <div className="flex justify-center">
        <GlowButton
          onClick={nextStep}
          disabled={!selectedGenres.length && (!selectedDecades || selectedDecades.length === 0)}
          className="text-lg px-8 py-4"
        >
          Continue
          <ChevronRight size={20} />
        </GlowButton>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">What's Your Mood?</h2>
        <p className="text-cinema-light">Choose your viewing context for better recommendations</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {moodOptions.map((mood) => (
          <motion.div
            key={mood.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood.value)}
            className={`card cursor-pointer transition-all duration-300 ${
              selectedMood === mood.value
                ? 'border-accent-red bg-cinema-gray/50'
                : 'hover:border-accent-blue'
            }`}
          >
            <div className="text-center">
              <div className="mb-4">
                {mood.value === 'solo' && <Sparkles size={48} className="mx-auto text-accent-purple" />}
                {mood.value === 'date' && <Heart size={48} className="mx-auto text-accent-red" />}
                {mood.value === 'group' && <Users size={48} className="mx-auto text-accent-blue" />}
              </div>
              <h3 className="text-xl font-semibold mb-2">{mood.label}</h3>
              <p className="text-sm text-cinema-light">{mood.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep}>
          <ChevronLeft size={20} />
          Back
        </GlowButton>

        <GlowButton onClick={generateRecommendations} disabled={!selectedMood || loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Finding Movies...
            </>
          ) : (
            <>
              Get Recommendations
              <Sparkles size={20} />
            </>
          )}
        </GlowButton>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Triple Feature</h2>
        <p className="text-white">Here are your personalized movie recommendations</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {recommendations.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetFlow}
          className="btn-secondary"
        >
          Start Over
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen cinema-gradient">
      {/* Hero Section */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
        >
          {/* Static poster collage background (hero only) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={'/movie-posters.jpg'}
              alt="Movie posters background"
              className="w-full h-full object-cover blur-xl opacity-50 scale-110 brightness-110"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
          </div>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-red/20 via-accent-purple/20 to-accent-blue/20" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,68,68,0.1)_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 md:py-14 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-center mb-4 md:mb-5">
                <img
                  src={TripFeatLogo}
                  alt="Triple Feature"
                  className="w-[180px] md:w-[280px] h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                />
              </div>
              <p className="text-base md:text-lg text-white mb-6 md:mb-7 max-w-2xl mx-auto">
                Discover your perfect movie night with personalized recommendations
              </p>
              {/* Removed the redundant hero CTA button */}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Recommendation Flow */}
      <div className="px-4 py-12">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default HomePage;
