import { useRecommendations } from '../hooks/useRecommendations';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import LoadingOverlay from '../components/LoadingOverlay';
import { ChevronLeft, ChevronRight, Sparkles, Clock, Play, Home, AlertTriangle } from 'lucide-react';
import GlowButton from '../components/GlowButton';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Using public asset path for reliability in dev/prod

const HomePage = () => {
  const navigate = useNavigate();
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  
  const {
    genres,
    selectedGenres,
    selectedDecades,
    selectedRuntimes,
    streamingOnly,
    includeAdult,
    languagePreference,
    recommendations,
    loading,
    error,
    progressMessage,
    currentStep,
    setSelectedDecades,
    setSelectedRuntimes,
    setStreamingOnly,
    setIncludeAdult,
    setLanguagePreference,
    generateRecommendations,
    resetFlow,
    nextStep,
    prevStep,
    toggleGenre,
    toggleDecade,
    toggleRuntime,
    getDecadeOptions,
    getRuntimeOptions,
  } = useRecommendations();

  useEffect(() => {
    if (currentStep > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Check if user has made selections that would be lost
  const hasSelections = selectedGenres.length > 0 || 
    (selectedDecades && selectedDecades.length < 13) || // Less than all decades
    (selectedRuntimes && selectedRuntimes.length < 3) || // Less than all runtimes
    streamingOnly || 
    includeAdult !== null || 
    languagePreference !== 'both';

  const handleHomeNavigation = () => {
    if (currentStep > 1 && hasSelections) {
      setShowNavigationConfirm(true);
    } else {
      navigate('/');
    }
  };

  const confirmNavigation = () => {
    setShowNavigationConfirm(false);
    navigate('/');
  };

  const cancelNavigation = () => {
    setShowNavigationConfirm(false);
  };

  const decadeOptions = getDecadeOptions();
  const runtimeOptions = getRuntimeOptions();

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="max-w-4xl mx-auto"
      data-step="1"
    >
      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center mb-6"
      >
        <div className="text-sm text-white/70 mb-2">Step 1 of 5</div>
        <h2 className="text-2xl font-bold mb-2">Genre Selection</h2>
        <p className="text-white/80 text-sm">Choose up to 2 genres</p>
      </motion.div>

      {/* Genres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6"
      >
        {genres.map((genre, index) => (
          <motion.button
            key={genre.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 + (index * 0.05) }}
            onClick={() => toggleGenre(genre.id)}
            className={`p-2 rounded-lg font-medium text-sm trace-snake ${
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
      </motion.div>

      {/* Next button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex justify-center"
      >
        <GlowButton
          onClick={nextStep}
          disabled={!selectedGenres.length}
          className="text-base px-6 py-3"
        >
          Continue
          <ChevronRight size={18} />
        </GlowButton>
      </motion.div>
    </motion.div>
  );

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="text-center mb-6">
        <div className="text-sm text-white/70 mb-2">Step 2 of 5</div>
        <h2 className="text-2xl font-bold mb-2">Decade Selection</h2>
        <p className="text-white/80 text-sm">Optional - defaults to all decades</p>
      </div>

      {/* Decades */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <GlowButton
              variant="secondary"
              onClick={() => setSelectedDecades(decadeOptions.map(d => d.value))}
              className="py-1.5 px-3 text-xs"
            >
              Select All
            </GlowButton>
            <GlowButton
              variant="secondary"
              onClick={() => setSelectedDecades([])}
              className="py-1.5 px-3 text-xs"
            >
              Clear All
            </GlowButton>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {decadeOptions.map((decade) => {
            const isSelected = selectedDecades.includes(decade.value);
            return (
              <button
                key={decade.value}
                onClick={() => toggleDecade(decade.value)}
                className={`py-2 px-2 rounded-md text-xs border trace-snake ${
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
              </button>
            );
          })}
        </div>
        <p className="text-xs text-white/70 mt-2 text-center">By default, all decades are selected.</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep} className="text-sm px-4 py-2">
          <ChevronLeft size={16} />
          Back
        </GlowButton>

        <GlowButton onClick={nextStep} className="text-sm px-4 py-2">
          Continue
          <ChevronRight size={16} />
        </GlowButton>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="text-center mb-6">
        <div className="text-sm text-white/70 mb-2">Step 3 of 5</div>
        <h2 className="text-2xl font-bold mb-2">Content Preferences</h2>
        <p className="text-white/80 text-sm">Customize your viewing experience</p>
      </div>

      {/* Adult Content Preference */}
      <div className="mb-5 p-4 rounded-xl border border-cinema-light/20 bg-cinema-gray/20">
        <h3 className="text-base font-semibold mb-2 text-white">Content Rating Preference</h3>
        <p className="text-xs text-white/70 mb-3">Choose your content comfort level</p>
        <div className="space-y-2">
          {[
            { value: false, label: 'Family-friendly', description: 'G, PG, PG-13 only' },
            { value: true, label: 'Adult-rated', description: 'R, NC-17, X only' },
            { value: null, label: 'Any rating', description: 'No rating restrictions' }
          ].map((option) => (
            <label key={option.value === null ? 'any' : option.value.toString()} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-cinema-gray/30 transition-colors duration-150">
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
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                includeAdult === option.value 
                  ? 'border-accent-blue' 
                  : 'border-cinema-light'
              }`}>
                {includeAdult === option.value && (
                  <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">{option.label}</div>
                <div className="text-xs text-white/70">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Language Preference */}
      <div className="mb-5 p-4 rounded-xl border border-cinema-light/20 bg-cinema-gray/20">
        <h3 className="text-base font-semibold mb-2 text-white">Language Preference</h3>
        <p className="text-xs text-white/70 mb-3">Try a non-English movie — it’s like travel, without the TSA.</p>
        <div className="space-y-2">
          {[
            { value: 'english', label: 'English only' },
            { value: 'non-english', label: 'Non-English only' },
            { value: 'both', label: 'Both' }
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-cinema-gray/30 transition-colors duration-150">
              <input
                type="radio"
                name="languagePreference"
                value={option.value}
                checked={languagePreference === option.value}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                languagePreference === option.value 
                  ? 'border-accent-blue' 
                  : 'border-cinema-light'
              }`}>
                {languagePreference === option.value && (
                  <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
                )}
              </div>
              <span className="text-white font-medium text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep} className="text-sm px-4 py-2">
          <ChevronLeft size={16} />
          Back
        </GlowButton>

        <GlowButton onClick={nextStep} className="text-sm px-4 py-2">
          Continue
          <ChevronRight size={16} />
        </GlowButton>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="text-center mb-6">
        <div className="text-sm text-white/70 mb-2">Step 4 of 5</div>
        <h2 className="text-2xl font-bold mb-2">Runtime & Streaming</h2>
        <p className="text-white/80 text-sm">Finalize your preferences</p>
      </div>

      {/* Runtime Selector */}
      <div className="mb-5 p-4 rounded-xl border border-cinema-light/20 bg-cinema-gray/20">
        <h3 className="text-base font-semibold mb-3 text-white flex items-center gap-2">
          <Clock size={18} />
          Runtime Preferences
        </h3>
        <p className="text-xs text-white/70 mb-3">Select your preferred movie lengths</p>
        <div className="grid grid-cols-3 gap-2">
          {runtimeOptions.map((runtime) => {
            const isSelected = selectedRuntimes.includes(runtime.value);
            return (
              <button
                key={runtime.value}
                onClick={() => toggleRuntime(runtime.value)}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-accent-blue/20 text-white border-accent-blue'
                    : 'bg-cinema-gray text-white border-cinema-light hover:border-accent-blue/50'
                }`}
              >
                <div className="font-medium text-sm mb-1">{runtime.label}</div>
                <div className="text-xs text-white/70">{runtime.description}</div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-white/70 mt-2 text-center">Multiple selections allowed</p>
      </div>

      {/* Streaming Availability Filter */}
      <div className="mb-6 p-4 rounded-xl border border-cinema-light/20 bg-cinema-gray/20">
        <h3 className="text-base font-semibold mb-3 text-white flex items-center gap-2">
          <Play size={18} />
          Streaming Availability
        </h3>
        <p className="text-xs text-white/70 mb-3">Filter for movies available on streaming platforms</p>
        <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-cinema-gray/30 transition-colors duration-150">
          <input
            type="checkbox"
            checked={streamingOnly}
            onChange={(e) => setStreamingOnly(e.target.checked)}
            className="w-4 h-4 rounded border-2 border-cinema-light text-accent-blue focus:ring-accent-blue focus:ring-2"
          />
          <span className="ml-3 text-white text-sm">
            Only show movies available via subscription or free streaming
          </span>
        </label>
        <p className="text-xs text-white/70 mt-2 text-center">
          When enabled, excludes movies only available for rent/purchase
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep} className="text-sm px-4 py-2">
          <ChevronLeft size={16} />
          Back
        </GlowButton>

        <GlowButton 
          onClick={generateRecommendations} 
          disabled={loading} 
          className="text-sm px-4 py-2"
          aria-busy={loading}
          aria-describedby={loading ? "loading-status" : undefined}
          aria-controls="progress-announcement"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Finding Movies...
              <span id="loading-status" className="sr-only">Loading recommendations, please wait</span>
            </>
          ) : (
            <>
              Get Recommendations
              <Sparkles size={16} />
            </>
          )}
        </GlowButton>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-white">Congratulations, you've successfully outsourced your decision-making to an <i>algorithm</i></p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {loading ? (
          // Show skeleton cards while loading
          <>
            <MovieCardSkeleton />
            <MovieCardSkeleton />
            <MovieCardSkeleton />
          </>
        ) : (
          // Show actual recommendations when loaded
          recommendations.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center gap-4">
        <GlowButton
          variant="secondary"
          onClick={resetFlow}
          className="text-sm px-6 py-3"
        >
          Start Over
        </GlowButton>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen cinema-gradient"
      aria-busy={loading}
      aria-live="polite"
    >
      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={loading} 
        message={progressMessage || "Finding your perfect movies..."}
      />
      
      {/* Navigation Confirmation Modal */}
      {showNavigationConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cinema-dark/95 border border-cinema-light/20 rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-accent-red/20 rounded-full flex items-center justify-center">
                <AlertTriangle size={32} className="text-accent-red" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3">
              Leave Current Selections?
            </h2>
            
            <p className="text-white/80 text-sm mb-6">
              Are you sure you want to leave? Your current selections will be lost.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelNavigation}
                className="flex-1 px-4 py-2 bg-cinema-gray hover:bg-cinema-light text-white rounded-lg transition-colors"
              >
                Stay
              </button>
              <button
                onClick={confirmNavigation}
                className="flex-1 px-4 py-2 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Screen reader live region for progress updates */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="progress-announcement"
      >
        {progressMessage}
      </div>
      
      {/* Intro Section */}
      {currentStep === 1 && (
        <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-8">
          {/* Mission Statement Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-cinema-dark/20 border border-cinema-light/20 rounded-xl p-6 mb-4 overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/movie-posters.jpg"
                alt="Movie posters background"
                className="w-full h-full object-cover blur-sm opacity-20"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-cinema-dark/40" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stop scrolling, start watching
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6">
                Triple Feature helps you pick a movie and just watch it. No more scrolling forever on Netflix or HBO. Tell us what you are in the mood for, we crunch the options, and give you three solid picks.
              </p>
              
              {/* Start Button */}
              <div className="text-center">
                <GlowButton
                  onClick={() => {
                    const step1Element = document.querySelector('[data-step="1"]');
                    if (step1Element) {
                      step1Element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty('--x', `${x}%`);
                    e.currentTarget.style.setProperty('--y', `${y}%`);
                  }}
                  className="px-6 py-3 text-sm gradient-button spotlight-button text-white border-0 shadow-lg hover:shadow-xl"
                >
                  <b>Start</b>
                </GlowButton>
              </div>
            </div>
          </motion.div>

          {/* Fun Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-4 text-center hover:bg-cinema-dark/40 transition-colors cursor-pointer"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent-red mb-1">80</div>
                <div className="text-xs text-white/70">hours saved from scrolling*</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-4 text-center hover:bg-cinema-dark/40 transition-colors cursor-pointer"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent-blue mb-1">38</div>
                <div className="text-xs text-white/70">arguments prevented for couples*</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-4 text-center hover:bg-cinema-dark/40 transition-colors cursor-pointer"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent-purple mb-1">3</div>
                <div className="text-xs text-white/70">picks, zero decision fatigue</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-4 text-center hover:bg-cinema-dark/40 transition-colors cursor-pointer"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent-gold mb-1">90</div>
                <div className="text-xs text-white/70">seconds from open to play</div>
              </motion.div>
            </div>
            <div className="text-xs text-white/50 mt-2 text-center">*fun, fake stats</div>
          </motion.div>
        </div>
      )}

      {/* Recommendation Flow */}
      <div className="px-4 pt-4 md:pt-8">
        {/* Step Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (step * 0.1) }}
                className="flex items-center"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-accent-blue text-white' 
                    : 'bg-cinema-gray text-white'
                } ${currentStep === 5 && loading && step === 5 ? 'animate-pulse' : ''}`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-10 h-0.5 mx-1.5 ${
                    currentStep > step ? 'bg-accent-blue' : 'bg-cinema-gray'
                  }`} />
                )}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-2 text-xs text-white/70"
          >
            {currentStep === 1 && 'Genre Selection'}
            {currentStep === 2 && 'Decade Selection'}
            {currentStep === 3 && 'Content Preferences'}
            {currentStep === 4 && 'Runtime & Streaming'}
            {currentStep === 5 && (loading ? 'Loading Recommendations...' : 'Recommendations')}
          </motion.div>
        </motion.div>
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>
    </div>
  );
};

export default HomePage;
