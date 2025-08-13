import { useState, useEffect } from 'react';
import { getGenres, getMoviesByFilters, getMovieDetails } from '../utils/tmdb';

export const useRecommendations = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  // Multi-decade selection; default to all decades
  const getAllDecades = () => {
    const decades = [];
    for (let year = 1900; year <= 2020; year += 10) {
      decades.push(year);
    }
    return decades;
  };
  const [selectedDecades, setSelectedDecades] = useState(getAllDecades());
  
  // New runtime and streaming filters
  const [selectedRuntimes, setSelectedRuntimes] = useState(['short', 'medium', 'long']); // Default to all
  const [streamingOnly, setStreamingOnly] = useState(false); // Default to false (all movies)
  
  // New consent state variables
  const [includeAdult, setIncludeAdult] = useState(null);
  const [languagePreference, setLanguagePreference] = useState('both'); // 'english', 'non-english', 'both'
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Track recently shown movies to avoid repetition
  const [recentlyShown, setRecentlyShown] = useState(new Set());

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const response = await getGenres();
        setGenres(response.genres || []);
      } catch (err) {
        setError('Failed to load genres');
        console.error('Error loading genres:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  // Generate recommendations based on filters
  const generateRecommendations = async () => {
    console.log('generateRecommendations called with:', {
      selectedGenres,
      selectedDecades,
      selectedRuntimes,
      streamingOnly,
      includeAdult,
      languagePreference
    });
    
    if (!selectedGenres.length && (!selectedDecades || selectedDecades.length === 0)) {
      setError('Please select at least one genre or decade');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build base filters
      const baseFilters = {
        genres: selectedGenres,
        decades: selectedDecades,
        streamingOnly,
        sortBy: 'popularity.desc',
        minRating: 6.0,
        includeAdult: includeAdult,
        languagePreference: languagePreference,
      };

      // Fetch ALL available pages to create a comprehensive pool
      console.log('Fetching comprehensive movie pool from TMDB...');
      setProgressMessage('Fetching comprehensive movie database... This may take a moment.');
      
      const firstPage = await getMoviesByFilters({ ...baseFilters, page: 1 });
      const totalPages = Math.min(firstPage?.total_pages || 1, 500); // TMDB max is 500 pages
      console.log(`Found ${totalPages} total pages of results (${firstPage?.total_results || 0} total movies)`);
      
      // Start with first page results
      const pool = [...(firstPage?.results || [])];
      
      // Fetch all remaining pages in parallel (with rate limiting consideration)
      if (totalPages > 1) {
        console.log(`Fetching ${totalPages - 1} additional pages...`);
        setProgressMessage(`Fetching ${totalPages - 1} additional pages... Building comprehensive database...`);
        
        // Create array of page numbers to fetch (2 through totalPages)
        const pagesToFetch = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        
        // Fetch pages in batches to avoid overwhelming the API
        const batchSize = 10; // Process 10 pages at a time
        const allResponses = [];
        
        for (let i = 0; i < pagesToFetch.length; i += batchSize) {
          const batch = pagesToFetch.slice(i, i + batchSize);
          const currentBatch = Math.floor(i / batchSize) + 1;
          const totalBatches = Math.ceil(pagesToFetch.length / batchSize);
          const progressPercent = Math.round((i / pagesToFetch.length) * 100);
          console.log(`Fetching batch ${currentBatch}/${totalBatches}: pages ${batch[0]}-${batch[batch.length - 1]} (${progressPercent}% complete)`);
          setProgressMessage(`Fetching batch ${currentBatch}/${totalBatches} of ${totalBatches}... ${progressPercent}% complete... Building movie database...`);
          
          const batchResponses = await Promise.all(
            batch.map((page) => getMoviesByFilters({ ...baseFilters, page }))
          );
          
          allResponses.push(...batchResponses);
          
          // Small delay between batches to be respectful to the API
          if (i + batchSize < pagesToFetch.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Add all results to the pool
        allResponses.forEach((response) => {
          if (response?.results) {
            pool.push(...response.results);
          }
        });
      }
      
      console.log(`Total movies in pool before deduplication: ${pool.length}`);
      setProgressMessage(`Processing ${pool.length} movies... Building final recommendations...`);

      // Deduplicate by id
      const seenIds = new Set();
      let movies = pool.filter((m) => {
        if (!m || !m.id) return false;
        if (seenIds.has(m.id)) return false;
        seenIds.add(m.id);
        return true;
      });
      
      console.log(`Total unique movies after deduplication: ${movies.length}`);

      // If a subset of decades was selected, filter client-side to include only those decades
      if (selectedDecades && selectedDecades.length > 0 && selectedDecades.length < getAllDecades().length) {
        const beforeCount = movies.length;
        movies = movies.filter((movie) => {
          const year = movie.release_date ? parseInt(movie.release_date.slice(0, 4), 10) : null;
          if (!year) return false;
          const decade = Math.floor(year / 10) * 10;
          return selectedDecades.includes(decade);
        });
        console.log(`Decade filtering: ${beforeCount} movies before, ${movies.length} after`);
      }

      // Filter based on runtime preferences
      if (selectedRuntimes && selectedRuntimes.length > 0 && selectedRuntimes.length < 3) {
        console.log(`Runtime filtering will be applied after fetching detailed movie information`);
        console.log(`Runtime preferences: ${selectedRuntimes.join(', ')}`);
      } else {
        console.log('No runtime filtering applied - all runtime categories selected');
      }

      // Filter out recently shown movies to avoid repetition
      const beforeRecentFilter = movies.length;
      movies = movies.filter(movie => !recentlyShown.has(movie.id));
      console.log(`Recent movie filtering: ${beforeRecentFilter} movies before, ${movies.length} after`);

      // Note: Runtime filtering is now applied after fetching detailed movie information
      // Streaming availability filtering is not yet implemented
      // TMDB doesn't provide reliable streaming data in the discover endpoint
      // This would require additional API calls to watch providers for each movie
      if (streamingOnly) {
        console.log('Streaming availability filtering requested but not yet implemented');
        console.log('Note: This would require additional API calls to watch providers for each movie');
      }

      // Complete random shuffle of the entire pool
      console.log(`Shuffling ${movies.length} movies completely randomly...`);
      const shuffled = [...movies];
      
      // Fisher-Yates shuffle for true randomness
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Pick 3 random movies from the shuffled pool
      const picks = shuffled.slice(0, 3);
      console.log(`Selected 3 random movies from shuffled pool of ${shuffled.length} movies`);
      console.log(`🎬 Comprehensive movie database built: ${pool.length} total movies fetched, ${movies.length} unique movies after filtering, ${shuffled.length} movies in final randomized pool`);
      setProgressMessage(null); // Clear progress messages
      setError(null); // Clear any error messages

      // Get detailed information for selected movies
      const detailedMovies = await Promise.all(
        picks.map(async (movie) => {
          try {
            const details = await getMovieDetails(movie.id);
            return {
              ...movie,
              ...details, // Include all details including runtime
              director: details.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
              cast: details.credits?.cast?.slice(0, 3).map(actor => actor.name) || [],
            };
          } catch (err) {
            console.error(`Error getting details for movie ${movie.id}:`, err);
            return movie;
          }
        })
      );

      // Apply runtime filtering AFTER getting detailed movie information
      let finalMovies = detailedMovies;
      if (selectedRuntimes && selectedRuntimes.length > 0 && selectedRuntimes.length < 3) {
        console.log(`Applying runtime filtering to detailed movies: ${selectedRuntimes.join(', ')}`);
        const beforeCount = finalMovies.length;
        
        finalMovies = finalMovies.filter((movie) => {
          if (!movie.runtime) {
            console.log(`Movie ${movie.title} has no runtime data, excluding from runtime filtering`);
            return false;
          }
          
          const runtime = movie.runtime;
          const isShort = runtime < 90;
          const isMedium = runtime >= 90 && runtime <= 120;
          const isLong = runtime > 120;
          
          const matches = (
            (isShort && selectedRuntimes.includes('short')) ||
            (isMedium && selectedRuntimes.includes('medium')) ||
            (isLong && selectedRuntimes.includes('long'))
          );
          
          if (!matches) {
            console.log(`Movie ${movie.title} (${runtime} min) doesn't match runtime preferences ${selectedRuntimes.join(', ')}`);
          }
          
          return matches;
        });
        
        console.log(`Runtime filtering: ${beforeCount} movies before, ${finalMovies.length} after`);
        
        // If we filtered out all movies, try to get more recommendations
        if (finalMovies.length === 0) {
          console.log('All movies were filtered out by runtime preferences, trying to get more recommendations...');
          
          // Get more movies from the pool and try again
          const additionalPicks = [];
          const remainingMovies = shuffled.filter(movie => !picks.some(p => p.id === movie.id));
          
          for (let i = 0; i < Math.min(6, remainingMovies.length) && additionalPicks.length < 3; i++) {
            const movie = remainingMovies[i];
            try {
              const details = await getMovieDetails(movie.id);
              const movieWithDetails = {
                ...movie,
                ...details,
                director: details.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
                cast: details.credits?.cast?.slice(0, 3).map(actor => actor.name) || [],
              };
              
              // Check if this movie matches runtime preferences
              if (movieWithDetails.runtime) {
                const runtime = movieWithDetails.runtime;
                const isShort = runtime < 90;
                const isMedium = runtime >= 90 && runtime <= 120;
                const isLong = runtime > 120;
                
                const matches = (
                  (isShort && selectedRuntimes.includes('short')) ||
                  (isMedium && selectedRuntimes.includes('medium')) ||
                  (isLong && selectedRuntimes.includes('long'))
                );
                
                if (matches) {
                  additionalPicks.push(movieWithDetails);
                }
              }
            } catch (err) {
              console.error(`Error getting details for additional movie ${movie.id}:`, err);
            }
          }
          
          finalMovies = additionalPicks;
          console.log(`Found ${finalMovies.length} additional movies that match runtime preferences`);
        }
      }

      setRecommendations(finalMovies);
      
      // Track these movies as recently shown
      const newRecentlyShown = new Set(recentlyShown);
      finalMovies.forEach(movie => newRecentlyShown.add(movie.id));
      
      // Keep only the last 30 movies to prevent the set from growing too large
      if (newRecentlyShown.size > 30) {
        const recentArray = Array.from(newRecentlyShown);
        const trimmed = new Set(recentArray.slice(-30));
        setRecentlyShown(trimmed);
      } else {
        setRecentlyShown(newRecentlyShown);
      }
      
      setCurrentStep(5);
    } catch (err) {
      setError('Failed to generate recommendations');
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset the recommendation flow
  const resetFlow = () => {
    setSelectedGenres([]);
    setSelectedDecades(getAllDecades());
    setSelectedRuntimes(['short', 'medium', 'long']);
    setStreamingOnly(false);
    setIncludeAdult(null);
    setLanguagePreference('both');
    setRecommendations([]);
    setError(null);
    setProgressMessage(null);
    setCurrentStep(1);
    // Optionally clear recently shown movies on reset (uncomment if desired)
    // setRecentlyShown(new Set());
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Toggle genre selection
  const toggleGenre = (genreId) => {
    setSelectedGenres((previousSelected) => {
      const isSelected = previousSelected.includes(genreId);
      if (isSelected) {
        return previousSelected.filter((id) => id !== genreId);
      }
      // Enforce max of 2 genres
      if (previousSelected.length >= 2) {
        return previousSelected; // ignore additional selections
      }
      return [...previousSelected, genreId];
    });
  };

  // Toggle decade selection
  const toggleDecade = (decade) => {
    setSelectedDecades((previousSelected) => {
      if (previousSelected.includes(decade)) {
        return previousSelected.filter((d) => d !== decade);
      }
      return [...previousSelected, decade];
    });
  };

  // Toggle runtime selection
  const toggleRuntime = (runtime) => {
    setSelectedRuntimes((previousSelected) => {
      if (previousSelected.includes(runtime)) {
        return previousSelected.filter((r) => r !== runtime);
      }
      return [...previousSelected, runtime];
    });
  };

  // Get decade options (1900s to 2020s)
  const getDecadeOptions = () => {
    const decades = [];
    for (let year = 1900; year <= 2020; year += 10) {
      decades.push({ value: year, label: `${year}s` });
    }
    return decades;
  };

  // Get runtime options
  const getRuntimeOptions = () => [
    { value: 'short', label: 'Short', description: '< 90 min' },
    { value: 'medium', label: 'Medium', description: '90-120 min' },
    { value: 'long', label: 'Long', description: '120+ min' },
  ];

  return {
    // State
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
    
    // Actions
    setSelectedGenres,
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
    
    // Helpers
    getDecadeOptions,
    getRuntimeOptions,
  };
};
