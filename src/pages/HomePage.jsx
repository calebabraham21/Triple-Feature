import { Fragment, useEffect, useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import LoadingOverlay from '../components/LoadingOverlay';
import { ChevronLeft, ChevronRight, Sparkles, Clock, RotateCcw } from 'lucide-react';
import GlowButton from '../components/GlowButton';
import { motion } from 'framer-motion';

const CountUp = ({ target, duration = 700, delayMs = 0, className = '' }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const start = () => {
      const t0 = performance.now();
      const tick = (now) => {
        const elapsed = now - t0;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };
    const timer = setTimeout(start, delayMs);
    return () => { clearTimeout(timer); if (rafId) cancelAnimationFrame(rafId); };
  }, [target, duration, delayMs]);
  return <span className={className}>{value}</span>;
};

const HomePage = ({ onStepChange, onProtectedActionRequest }) => {
  const {
    genres,
    selectedGenres,
    selectedDecades,
    selectedRuntimes,
    includeAdult,
    languagePreference,
    recommendations,
    loading,
    error,
    progressMessage,
    currentStep,
    setSelectedDecades,
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
    if (onStepChange) onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  useEffect(() => {
    if (currentStep > 1) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const decadeOptions = getDecadeOptions();
  const runtimeOptions = getRuntimeOptions();

  // ─── Step indicator ───────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="flex items-center gap-0">
        {[1, 2, 3, 4].map((step, i) => (
          <Fragment key={step}>
            {i > 0 && (
              <div
                className="w-10 h-px transition-colors"
                style={{ backgroundColor: currentStep > i ? '#1e1b18' : '#ccc8c3' }}
              />
            )}
            <div
              className="w-2.5 h-2.5 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: currentStep >= step ? '#1e1b18' : '#ccc8c3' }}
            />
          </Fragment>
        ))}
      </div>
      <span className="text-xs text-fog">
        {currentStep === 1 && 'Step 1 of 4 — Genre'}
        {currentStep === 2 && 'Step 2 of 4 — Decade & Runtime'}
        {currentStep === 3 && 'Step 3 of 4 — Content Preferences'}
        {currentStep === 4 && (loading ? 'Finding your films...' : 'Step 4 of 4 — Recommendations')}
      </span>
    </div>
  );

  // ─── Step 1: Genre ────────────────────────────────────────────
  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-6">
        <div className="wizard-step-label mb-2">Genre selection</div>
        <div className="wizard-step-title">What kind of film?</div>
        <p className="text-sm text-fog mt-2">Pick up to two genres.</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() => toggleGenre(genre.id)}
            className={`chip-pill py-2.5 px-3 text-sm text-center ${
              selectedGenres.includes(genre.id)
                ? 'chip-selected'
                : selectedGenres.length >= 2
                ? 'opacity-40 cursor-not-allowed'
                : ''
            }`}
            disabled={!selectedGenres.includes(genre.id) && selectedGenres.length >= 2}
          >
            {genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <GlowButton onClick={nextStep} disabled={!selectedGenres.length}>
          Continue
          <ChevronRight size={15} />
        </GlowButton>
      </div>
    </motion.div>
  );

  // ─── Step 2: Decade & Runtime ─────────────────────────────────
  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-6">
        <div className="wizard-step-label mb-2">Decade & Runtime</div>
        <div className="wizard-step-title">When and how long?</div>
        <p className="text-sm text-fog mt-2">Optional — defaults to all decades and runtimes.</p>
      </div>

      {/* Decades */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-fog">Decade</span>
          <div className="flex-1" />
          <button
            type="button"
            className="text-xs text-fog hover:text-ink transition-colors underline underline-offset-2"
            onClick={() => setSelectedDecades(decadeOptions.map((d) => d.value))}
          >
            All
          </button>
          <span className="text-ash text-xs">·</span>
          <button
            type="button"
            className="text-xs text-fog hover:text-ink transition-colors underline underline-offset-2"
            onClick={() => setSelectedDecades([])}
          >
            None
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {decadeOptions.map((decade) => (
            <button
              key={decade.value}
              type="button"
              onClick={() => toggleDecade(decade.value)}
              className={`chip-pill py-2 px-2 text-xs text-center ${
                selectedDecades.includes(decade.value) ? 'chip-selected' : ''
              }`}
            >
              {decade.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-fog mt-2">All decades are selected by default.</p>
      </div>

      {/* Runtime */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={13} className="text-fog" />
          <span className="text-xs font-semibold tracking-widest uppercase text-fog">Runtime</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {runtimeOptions.map((runtime) => (
            <button
              key={runtime.value}
              type="button"
              onClick={() => toggleRuntime(runtime.value)}
              className={`chip-pill py-3 px-3 text-center ${
                selectedRuntimes.includes(runtime.value) ? 'chip-selected' : ''
              }`}
            >
              <div className="text-sm font-medium mb-0.5">{runtime.label}</div>
              <div className="text-xs opacity-70">{runtime.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep}>
          <ChevronLeft size={15} />
          Back
        </GlowButton>
        <GlowButton onClick={nextStep}>
          Continue
          <ChevronRight size={15} />
        </GlowButton>
      </div>
    </motion.div>
  );

  // ─── Step 3: Content Preferences ─────────────────────────────
  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-6">
        <div className="wizard-step-label mb-2">Content Preferences</div>
        <div className="wizard-step-title">A few last things.</div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-widest uppercase text-fog mb-3">Content Rating</div>
        <div className="space-y-1">
          {[
            { value: false, label: 'Family-friendly', description: 'G, PG, PG-13 only' },
            { value: true, label: 'Adult-rated', description: 'R, NC-17, X only' },
            { value: null, label: 'Any rating', description: 'No restrictions' },
          ].map((option) => (
            <label
              key={option.value === null ? 'any' : String(option.value)}
              className="flex items-center cursor-pointer py-2.5 px-3 rounded hover:bg-smoke transition-colors"
            >
              <input
                type="radio"
                name="includeAdult"
                value={option.value === null ? 'any' : String(option.value)}
                checked={includeAdult === option.value}
                onChange={(e) => {
                  const v = e.target.value;
                  setIncludeAdult(v === 'any' ? null : v === 'true');
                }}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-colors ${
                  includeAdult === option.value ? 'border-ink' : 'border-ash'
                }`}
              >
                {includeAdult === option.value && (
                  <div className="w-2 h-2 rounded-full bg-ink" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-ink">{option.label}</div>
                <div className="text-xs text-fog">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="mb-8">
        <div className="text-xs font-semibold tracking-widest uppercase text-fog mb-3">Language</div>
        <p className="text-xs text-fog mb-3">Try a non-English film. It's like travel, without the TSA.</p>
        <div className="space-y-1">
          {[
            { value: 'english', label: 'English only' },
            { value: 'non-english', label: 'Non-English only' },
            { value: 'both', label: 'Both' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center cursor-pointer py-2.5 px-3 rounded hover:bg-smoke transition-colors"
            >
              <input
                type="radio"
                name="languagePreference"
                value={option.value}
                checked={languagePreference === option.value}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-colors ${
                  languagePreference === option.value ? 'border-ink' : 'border-ash'
                }`}
              >
                {languagePreference === option.value && (
                  <div className="w-2 h-2 rounded-full bg-ink" />
                )}
              </div>
              <span className="text-sm font-medium text-ink">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <GlowButton variant="secondary" onClick={prevStep}>
          <ChevronLeft size={15} />
          Back
        </GlowButton>
        <GlowButton
          onClick={generateRecommendations}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <div className="h-3.5 w-3.5 rounded-full border border-paper/30 border-t-paper animate-spin" />
              Getting picks...
            </>
          ) : (
            <>
              Get Recommendations
              <Sparkles size={14} />
            </>
          )}
        </GlowButton>
      </div>
    </motion.div>
  );

  // ─── Step 4 (5): Results ──────────────────────────────────────
  const renderStep5 = () => (
    <motion.div
      key="step5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-6">
        <div className="wizard-step-label mb-2">Your picks</div>
        <div className="wizard-step-title">Three films for tonight.</div>
        <p className="text-sm text-fog mt-2 italic">
          Congratulations on outsourcing your decision to an algorithm.
        </p>
      </div>

      {error && (
        <div className="border border-ash rounded p-4 mb-6 text-sm text-fog bg-smoke">
          {error}
        </div>
      )}

      {/* Archive list */}
      <div className="border-t border-smoke mb-8">
        {loading ? (
          <>
            <MovieCardSkeleton />
            <MovieCardSkeleton />
            <MovieCardSkeleton />
          </>
        ) : (
          recommendations.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>

      <div className="flex justify-start">
        <GlowButton
          variant="secondary"
          onClick={() => {
            if (typeof onProtectedActionRequest === 'function') {
              onProtectedActionRequest(() => resetFlow());
            } else {
              resetFlow();
            }
          }}
        >
          <RotateCcw size={14} />
          Start over
        </GlowButton>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-paper" aria-busy={loading} aria-live="polite">
      <LoadingOverlay isVisible={loading} message={progressMessage || 'Searching through thousands of films...'} />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {progressMessage}
      </div>

      {/* Cinematic hero — only on step 1 */}
      {currentStep === 1 && (
        <div
          className="relative overflow-hidden"
          style={{ height: '40vh', minHeight: '260px', maxHeight: '420px' }}
        >
          <img
            src="/movie-posters.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'saturate(0.12) brightness(0.6)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-reel/20 to-reel/85" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 h-full flex flex-col justify-end pb-10 px-6 sm:px-8 max-w-5xl mx-auto"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-paper/40 mb-3 font-sans">
              Triple Feature
            </p>
            <h1 className="font-cinema text-3xl sm:text-4xl md:text-5xl font-medium text-paper leading-tight mb-3 text-shadow">
              Stop scrolling.<br />Start watching.
            </h1>
            <p className="text-paper/65 text-sm sm:text-base leading-relaxed max-w-lg">
              Three good films, matched to your taste. No algorithm, no feed — just picks.
            </p>
          </motion.div>
        </div>
      )}

      {/* Wizard */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
        <StepIndicator />

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep5()}
      </div>

      {/* Stats strip — editorial typographic, step 1 only */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="border-t border-smoke bg-paper"
        >
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { target: 80, label: 'hours saved scrolling' },
                { target: 38, label: 'arguments prevented' },
                { target: 3, label: 'picks, zero fatigue' },
                { target: 90, label: 'seconds to play' },
              ].map(({ target, label }, i) => (
                <div key={label}>
                  <div className="stat-number mb-1">
                    <CountUp target={target} duration={800} delayMs={600 + i * 80} />
                  </div>
                  <div className="text-xs text-fog leading-snug">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-fog/50 mt-4">* fun, fake stats</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
