import { motion } from 'framer-motion';
import { useRecommendations } from '../hooks/useRecommendations';
import MovieCard from '../components/MovieCard';
import { ChevronLeft, ChevronRight, Sparkles, Clock, Users, Heart } from 'lucide-react';
import GlowButton from '../components/GlowButton';

// Using public asset path for reliability in dev/prod

const HomePage = () => {
  const {
    genres,
    selectedGenres,
    selectedDecades,
    selectedMood,
    includeAdult,
    languagePreference,
    recommendations,
    loading,
    error,
    currentStep,
    setSelectedGenres,
    setSelectedDecades,
    setSelectedMood,
    setIncludeAdult,
    setLanguagePreference,
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
      id="preferences"
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
          disabled={!selectedGenres.length || (!selectedDecades || selectedDecades.length === 0)}
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
        <h2 className="text-3xl font-bold mb-4">Content Preferences</h2>
        <p className="text-cinema-light">Customize your viewing experience</p>
      </div>

             {/* Adult Content Preference */}
       <div className="mb-8 p-6 rounded-xl border border-cinema-light/20 bg-cinema-gray/20">
        <h3 className="text-xl font-semibold mb-2 text-white">Content Rating Preference</h3>
        <p className="text-sm text-cinema-light mb-4">Choose your content comfort level</p>
        <div className="space-y-3">
          {[
            { value: false, label: 'Family-friendly', description: 'G, PG, PG-13 only' },
            { value: true, label: 'Adult-rated', description: 'R, NC-17, X only' },
            { value: null, label: 'Any rating', description: 'No rating restrictions' }
          ].map((option) => (
                         <label key={option.value === null ? 'any' : option.value.toString()} className="flex items-center cursor-pointer p-4 rounded-lg hover:bg-cinema-gray/30 transition-colors duration-150">
              <input
                type="radio"
                name="includeAdult"
                value={option.value === null ? 'any' : option.value.toString()}
                checked={includeAdult === option.value}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'any') {
                    setIncludeAdult(null);
                  } else {
                    setIncludeAdult(value === 'true');
                  }
                }}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                includeAdult === option.value 
                  ? 'border-accent-blue' 
                  : 'border-cinema-light'
              }`}>
                {includeAdult === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-blue"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-lg">{option.label}</div>
                <div className="text-sm text-cinema-light">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

             {/* Language Preference */}
       <div className="mb-8 p-6 rounded-xl border border-cinema-light/20 bg-cinema-gray/20">
        <h3 className="text-xl font-semibold mb-2 text-white">Language Preference</h3>
        <p className="text-sm text-cinema-light mb-4 italic">Hey c'mon, some of the best movies ever are non-English! Subtitles broooo 😎</p>
        <div className="space-y-3">
          {[
            { value: 'english', label: 'English only' },
            { value: 'non-english', label: 'Non-English only' },
            { value: 'both', label: 'Both' }
          ].map((option) => (
                         <label key={option.value} className="flex items-center cursor-pointer p-4 rounded-lg hover:bg-cinema-gray/30 transition-colors duration-150">
              <input
                type="radio"
                name="languagePreference"
                value={option.value}
                checked={languagePreference === option.value}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                languagePreference === option.value 
                  ? 'border-accent-blue' 
                  : 'border-cinema-light'
              }`}>
                {languagePreference === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-blue"></div>
                )}
              </div>
              <span className="text-white font-medium text-lg">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep}>
          <ChevronLeft size={20} />
          Back
        </GlowButton>

        <GlowButton onClick={nextStep} disabled={loading}>
          Continue
          <ChevronRight size={20} />
        </GlowButton>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
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

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="text-center mb-8">
        <p className="text-white">Congratulations, you've successfully outsourced your decision-making to an <i>algorithm</i></p>
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
                         transition={{ delay: index * 0.05 }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
                 <motion.button
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
              className="w-full h-full object-cover blur-sm opacity-20 scale-110 brightness-100"
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

          <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 md:pt-16 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Tagline */}
              <div className="max-w-4xl mx-auto mb-8 text-white">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Stop scrolling.<br />Start watching.
                </h1>
              </div>

              <div className="flex justify-center mb-8">
                <GlowButton
                  onClick={() => {
                    const el = document.getElementById('preferences');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty('--x', `${x}%`);
                    e.currentTarget.style.setProperty('--y', `${y}%`);
                  }}
                  className="px-6 py-4 text-sm gradient-button spotlight-button text-white border-0 shadow-lg hover:shadow-xl"
                >
                  <b>START WATCHING</b>
          
                </GlowButton>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}



      {/* Recommendation Flow */}
       <div className="px-4 pt-8">
         {/* Step Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-accent-blue text-white' 
                    : 'bg-cinema-gray text-cinema-light'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-accent-blue' : 'bg-cinema-gray'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-cinema-light">
            {currentStep === 1 && 'Genres & Decades'}
            {currentStep === 2 && 'Content Preferences'}
            {currentStep === 3 && 'Mood Selection'}
            {currentStep === 4 && 'Recommendations'}
          </div>
        </div>
        

        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default HomePage;
