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
  const [selectedMood, setSelectedMood] = useState(null);
  
  // New consent state variables
  const [includeAdult, setIncludeAdult] = useState(null);
  const [languagePreference, setLanguagePreference] = useState('both'); // 'english', 'non-english', 'both'
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      selectedMood,
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
        sortBy: 'popularity.desc',
        minRating: 6.5,
        includeAdult: includeAdult,
        languagePreference: languagePreference,
      };

      // Fetch a larger pool by sampling multiple random pages
      const firstPage = await getMoviesByFilters({ ...baseFilters, page: 1 });
      const totalPages = Math.max(1, Math.min(firstPage?.total_pages || 1, 15)); // cap for perf
      const pool = [...(firstPage?.results || [])];

      // Choose up to 4 additional random distinct pages among available pages
      const pagesToFetch = new Set();
      while (pagesToFetch.size < 4 && pagesToFetch.size < totalPages - 1) {
        const randomPage = Math.floor(Math.random() * totalPages) + 1; // 1..totalPages
        if (randomPage !== 1) pagesToFetch.add(randomPage);
      }

      const additionalResponses = await Promise.all(
        Array.from(pagesToFetch).map((p) => getMoviesByFilters({ ...baseFilters, page: p }))
      );
      additionalResponses.forEach((r) => {
        if (r?.results) pool.push(...r.results);
      });

      // Deduplicate by id
      const seenIds = new Set();
      let movies = pool.filter((m) => {
        if (!m || !m.id) return false;
        if (seenIds.has(m.id)) return false;
        seenIds.add(m.id);
        return true;
      });

      // If a subset of decades was selected, filter client-side to include only those decades
      if (selectedDecades && selectedDecades.length > 0 && selectedDecades.length < getAllDecades().length) {
        movies = movies.filter((movie) => {
          const year = movie.release_date ? parseInt(movie.release_date.slice(0, 4), 10) : null;
          if (!year) return false;
          const decade = Math.floor(year / 10) * 10;
          return selectedDecades.includes(decade);
        });
      }

      // Filter based on mood/context
      if (selectedMood) {
        movies = filterByMood(movies, selectedMood);
      }

      // Filter out recently shown movies to avoid repetition
      movies = movies.filter(movie => !recentlyShown.has(movie.id));

      // Advanced shuffling with multiple randomization passes
      const advancedShuffle = (arr) => {
        let a = [...arr];
        
        // First pass: Standard Fisher-Yates shuffle
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        
        // Second pass: Random chunk swapping for extra randomness
        const chunkSize = Math.max(1, Math.floor(a.length / 8));
        for (let i = 0; i < 3; i++) {
          const start1 = Math.floor(Math.random() * (a.length - chunkSize));
          const start2 = Math.floor(Math.random() * (a.length - chunkSize));
          
          if (start1 !== start2) {
            const chunk1 = a.slice(start1, start1 + chunkSize);
            const chunk2 = a.slice(start2, start2 + chunkSize);
            
            // Swap chunks
            a.splice(start1, chunkSize, ...chunk2);
            a.splice(start2, chunkSize, ...chunk1);
          }
        }
        
        // Third pass: Random individual swaps
        for (let i = 0; i < Math.floor(a.length / 2); i++) {
          const idx1 = Math.floor(Math.random() * a.length);
          const idx2 = Math.floor(Math.random() * a.length);
          [a[idx1], a[idx2]] = [a[idx2], a[idx1]];
        }
        
        return a;
      };
      
      const randomized = advancedShuffle(movies);

      // Use weighted selection for final picks to avoid always picking from the start
      const picks = [];
      const availableMovies = [...randomized];
      
      for (let i = 0; i < 3 && availableMovies.length > 0; i++) {
        // Weighted selection: higher chance for earlier indices, but still random
        const weights = availableMovies.map((_, idx) => Math.pow(0.8, idx));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;
        
        for (let j = 0; j < weights.length; j++) {
          random -= weights[j];
          if (random <= 0) {
            selectedIndex = j;
            break;
          }
        }
        
        picks.push(availableMovies[selectedIndex]);
        availableMovies.splice(selectedIndex, 1);
      }

      // Get detailed information for selected movies
      const detailedMovies = await Promise.all(
        picks.map(async (movie) => {
          try {
            const details = await getMovieDetails(movie.id);
            return {
              ...movie,
              director: details.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
              cast: details.credits?.cast?.slice(0, 3).map(actor => actor.name) || [],
            };
          } catch (err) {
            console.error(`Error getting details for movie ${movie.id}:`, err);
            return movie;
          }
        })
      );

      setRecommendations(detailedMovies);
      
      // Track these movies as recently shown
      const newRecentlyShown = new Set(recentlyShown);
      detailedMovies.forEach(movie => newRecentlyShown.add(movie.id));
      
      // Keep only the last 30 movies to prevent the set from growing too large
      if (newRecentlyShown.size > 30) {
        const recentArray = Array.from(newRecentlyShown);
        const trimmed = new Set(recentArray.slice(-30));
        setRecentlyShown(trimmed);
      } else {
        setRecentlyShown(newRecentlyShown);
      }
      
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to generate recommendations');
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies based on mood/context
  const filterByMood = (movies, mood) => {
    switch (mood) {
      case 'solo':
        // Prefer critically acclaimed, thought-provoking films
        return movies
          .filter(movie => movie.vote_average >= 7.0)
          .sort((a, b) => b.vote_average - a.vote_average);
      
      case 'date':
        // Prefer romantic, feel-good, or visually stunning films
        return movies
          .filter(movie => 
            movie.vote_average >= 6.5 && 
            (movie.genre_ids?.includes(10749) || // Romance
             movie.genre_ids?.includes(35) || // Comedy
             movie.genre_ids?.includes(14)) // Fantasy
          )
          .sort((a, b) => b.popularity - a.popularity);
      
      case 'group':
        // Prefer action, comedy, or crowd-pleasing films
        return movies
          .filter(movie => 
            movie.vote_average >= 6.0 && 
            (movie.genre_ids?.includes(28) || // Action
             movie.genre_ids?.includes(35) || // Comedy
             movie.genre_ids?.includes(12)) // Adventure
          )
          .sort((a, b) => b.popularity - a.popularity);
      
      default:
        return movies;
    }
  };

  // Reset the recommendation flow
  const resetFlow = () => {
    setSelectedGenres([]);
    setSelectedDecades(getAllDecades());
    setSelectedMood(null);
    setIncludeAdult(null);
    setLanguagePreference('both');
    setRecommendations([]);
    setError(null);
    setCurrentStep(1);
    // Optionally clear recently shown movies on reset (uncomment if desired)
    // setRecentlyShown(new Set());
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 4) {
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

  // Get decade options (1900s to 2020s)
  const getDecadeOptions = () => {
    const decades = [];
    for (let year = 1900; year <= 2020; year += 10) {
      decades.push({ value: year, label: `${year}s` });
    }
    return decades;
  };

  // Get mood options
  const getMoodOptions = () => [
    { value: 'solo', label: 'Solo', description: 'Thought-provoking films for personal viewing' },
    { value: 'date', label: 'Date Night', description: 'Romantic and feel-good movies' },
    { value: 'group', label: 'Group', description: 'Crowd-pleasing action and comedy' },
  ];

  return {
    // State
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
    
    // Actions
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
    
    // Helpers
    getDecadeOptions,
    getMoodOptions,
  };
};
