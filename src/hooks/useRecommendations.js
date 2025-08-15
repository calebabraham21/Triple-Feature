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

  // Add runtime filtering to the TMDB query if specific runtime preferences are selected
  if (selectedRuntimes && selectedRuntimes.length > 0 && selectedRuntimes.length < 3) {
    console.log(`Adding runtime filtering to TMDB query: ${selectedRuntimes.join(', ')}`);
    
    // Convert runtime preferences to TMDB parameters
    if (selectedRuntimes.includes('long') && !selectedRuntimes.includes('short') && !selectedRuntimes.includes('medium')) {
      // Only long movies (over 2 hours)
      baseFilters['with_runtime.gte'] = 120;
      console.log('TMDB will filter for movies 120+ minutes');
    } else if (selectedRuntimes.includes('short') && !selectedRuntimes.includes('medium') && !selectedRuntimes.includes('long')) {
      // Only short movies (under 90 minutes)
      baseFilters['with_runtime.lte'] = 89;
      console.log('TMDB will filter for movies under 90 minutes');
    } else if (selectedRuntimes.includes('medium') && !selectedRuntimes.includes('short') && !selectedRuntimes.includes('long')) {
      // Only medium movies (90-120 minutes)
      baseFilters['with_runtime.gte'] = 90;
      baseFilters['with_runtime.lte'] = 120;
      console.log('TMDB will filter for movies 90-120 minutes');
    } else if (selectedRuntimes.includes('short') && selectedRuntimes.includes('medium') && !selectedRuntimes.includes('long')) {
      // Short and medium (under 120 minutes)
      baseFilters['with_runtime.lte'] = 120;
      console.log('TMDB will filter for movies under 120 minutes');
    } else if (selectedRuntimes.includes('medium') && selectedRuntimes.includes('long') && !selectedRuntimes.includes('short')) {
      // Medium and long (90+ minutes)
      baseFilters['with_runtime.gte'] = 90;
      console.log('TMDB will filter for movies 90+ minutes');
    }
    // If all three are selected or none are selected, no runtime filtering is applied
  }

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

             // TMDB's runtime filtering is unreliable, so we need to do it ourselves
       if (selectedRuntimes && selectedRuntimes.length > 0 && selectedRuntimes.length < 3) {
         console.log(`TMDB runtime filtering is unreliable - we'll filter client-side: ${selectedRuntimes.join(', ')}`);
       } else {
         console.log('No runtime filtering applied - all runtime categories selected');
       }

      // Filter out recently shown movies to avoid repetition
      const beforeRecentFilter = movies.length;
      movies = movies.filter(movie => !recentlyShown.has(movie.id));
      console.log(`Recent movie filtering: ${beforeRecentFilter} movies before, ${movies.length} after`);

      // Note: Runtime filtering will be applied after fetching detailed movie information
      // Streaming availability filtering is not yet implemented
      // TMDB doesn't provide reliable streaming data in the discover endpoint
      // This would require additional API calls to watch providers for each movie
      if (streamingOnly) {
        console.log('Streaming availability filtering requested but not yet implemented');
        console.log('Note: This would require additional API calls to watch providers for each movie');
      }

             // TMDB's runtime filtering is unreliable, so we need to filter client-side
       // The movies array contains all movies from the initial search, we'll filter by runtime now
       console.log(`TMDB returned ${movies.length} movies, but we need to filter by runtime ourselves.`);
       
              // Debug: Let's check a few movies from TMDB response
       if (selectedRuntimes && selectedRuntimes.length > 0 && selectedRuntimes.length < 3) {
         console.log('🔍 Debug: Checking first few movies from TMDB response...');
         const sampleMovies = movies.slice(0, 5);
         sampleMovies.forEach(movie => {
           console.log(`  - ${movie.title}: ${movie.runtime || 'No runtime'} min`);
         });
       }
       
       // Apply runtime filtering BEFORE fetching detailed info (since TMDB can't be trusted)
       if (selectedRuntimes && selectedRuntimes.length > 0 && selectedRuntimes.length < 3) {
         console.log(`Applying runtime filtering to initial movie pool: ${selectedRuntimes.join(', ')}`);
         const beforeCount = movies.length;
         
         // We need to fetch runtime data for all movies to filter them
         // This is more efficient than fetching full details for movies we'll discard
         console.log('Fetching runtime data for all movies to apply runtime filtering...');
         setProgressMessage('Fetching runtime data to filter movies...');
         
         const moviesWithRuntime = [];
         for (let i = 0; i < movies.length; i++) {
           try {
             const movie = movies[i];
             // Get movie details to check runtime
             const movieData = await getMovieDetails(movie.id);
             
             if (movieData.runtime) {
               const runtime = movieData.runtime;
               const isShort = runtime < 90;
               const isMedium = runtime >= 90 && runtime <= 120;
               const isLong = runtime >= 120; // Changed from > 120 to >= 120
               
               const matches = (
                 (isShort && selectedRuntimes.includes('short')) ||
                 (isMedium && selectedRuntimes.includes('medium')) ||
                 (isLong && selectedRuntimes.includes('long'))
               );
               
               if (matches) {
                 moviesWithRuntime.push({
                   ...movie,
                   runtime: movieData.runtime
                 });
               } else {
                 console.log(`Filtered out ${movie.title} (${runtime} min) - doesn't match runtime preferences`);
               }
             } else {
               console.log(`Filtered out ${movie.title} - no runtime data available`);
             }
             
             // Add small delay between requests to respect rate limits
             if (i < movies.length - 1) {
               await new Promise(resolve => setTimeout(resolve, 100));
             }
           } catch (err) {
             console.error(`Error getting runtime for movie ${movies[i].id}:`, err);
             // Continue with other movies even if one fails
           }
         }
         
         movies = moviesWithRuntime;
         console.log(`Runtime filtering: ${beforeCount} movies before, ${movies.length} after`);
         
         if (movies.length < 3) {
           console.log(`Only ${movies.length} movies found matching runtime criteria.`);
           setError(`Only found ${movies.length} movie(s) matching your runtime preferences. Please try different filters.`);
           return;
         }
       }
       
       if (movies.length < 3) {
         console.log(`Only ${movies.length} movies found matching all criteria.`);
         setError(`Only found ${movies.length} movie(s) matching your criteria. Please try different filters.`);
         return;
       }
       
       // Sample up to 50 movies for detailed info (now that we've filtered by runtime)
       const sampleSize = Math.min(movies.length, 50);
      console.log(`Fetching detailed information for ${sampleSize} movies (sampled from ${movies.length} total)...`);
      setProgressMessage(`Fetching detailed movie information... This may take a moment.`);
      
      // Take a random sample of movies to get detailed info for
      const shuffledForSampling = [...movies];
      for (let i = shuffledForSampling.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledForSampling[i], shuffledForSampling[j]] = [shuffledForSampling[j], shuffledForSampling[i]];
      }
      const sampleMovies = shuffledForSampling.slice(0, sampleSize);
      
      // Fetch details for the sample with rate limiting
      const detailedMovies = [];
      for (let i = 0; i < sampleMovies.length; i++) {
        try {
          const movie = sampleMovies[i];
          const details = await getMovieDetails(movie.id);
          detailedMovies.push({
            ...movie,
            ...details, // Include all details including runtime
            director: details.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
            cast: details.credits?.cast?.slice(0, 3).map(actor => actor.name) || [],
          });
          
          // Add small delay between requests to respect rate limits
          if (i < sampleMovies.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.error(`Error getting details for movie ${sampleMovies[i].id}:`, err);
          // Continue with other movies even if one fails
        }
      }
      
      console.log(`Successfully fetched details for ${detailedMovies.length} movies`);
      
       // All movies in detailedMovies already meet runtime criteria (we filtered them earlier)
       const filteredMovies = detailedMovies;

      // Complete random shuffle of the FILTERED pool
      console.log(`Shuffling ${filteredMovies.length} movies completely randomly...`);
      const shuffled = [...filteredMovies];
      
      // Fisher-Yates shuffle for true randomness
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Pick 3 random movies from the filtered and shuffled pool
      const picks = shuffled.slice(0, 3);
      console.log(`Selected 3 random movies from filtered pool of ${shuffled.length} movies`);
      console.log(`🎬 Perfect! We filtered ${pool.length} total movies down to ${movies.length} that meet your criteria, then randomly selected 3 from ${filteredMovies.length} detailed movies`);
      setProgressMessage(null); // Clear progress messages
      setError(null); // Clear any error messages

      // Set final recommendations
      const finalMovies = picks;

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
