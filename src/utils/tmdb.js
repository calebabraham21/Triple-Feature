const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Replace this with your actual API key
const API_KEY = '4614f689c6b3d5f9ff93b23e24ca590b';

export const tmdbConfig = {
  baseURL: TMDB_BASE_URL,
  imageBaseURL: TMDB_IMAGE_BASE_URL,
  apiKey: API_KEY,
};

// Helper function to make API requests
const makeRequest = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('TMDB API request failed:', error);
    throw error;
  }
};

// Get movie genres
export const getGenres = async () => {
  return makeRequest('/genre/movie/list');
};

// Get movies by genre and other filters
export const getMoviesByFilters = async (filters = {}) => {
  const {
    genres = [],
    decades = null,
    streamingOnly = false,
    page = 1,
    sortBy = 'popularity.desc',
    minRating = 6.0,
    includeAdult = false,
    languagePreference = 'both',
  } = filters;

  let params = {
    page,
    'sort_by': sortBy,
    'vote_average.gte': minRating,
    'vote_count.gte': 75, // Minimum vote count for quality
  };

  if (genres.length > 0) {
    params.with_genres = genres.join(',');
  }

  // Handle adult content preference using US certification system
  // adult: false = family-friendly (up to PG-13), adult: true = R-rated and above, null = any rating
  if (includeAdult === false) {
    params.certification_country = 'US';
    params['certification.lte'] = 'PG-13';
  } else if (includeAdult === true) {
    params.certification_country = 'US';
    params['certification.gte'] = 'R';
  }
  // If includeAdult is null, no certification filtering at API level
  
  // Always keep include_adult=false unless we want pornographic content
  params.include_adult = false;
  
  // Add US region bias for better theatrical data
  params.region = 'US';
  params.with_release_type = '2|3'; // Theatrical and digital releases

  // Note: Language filtering will be done client-side for better accuracy
  // TMDB's with_original_language and without_original_language don't work reliably

  // If specific decades are provided, pass the broadest range to TMDB (min..max)
  if (Array.isArray(decades) && decades.length > 0) {
    const minDecade = Math.min(...decades);
    const maxDecade = Math.max(...decades) + 9;
    params['primary_release_date.gte'] = `${minDecade}-01-01`;
    params['primary_release_date.lte'] = `${maxDecade}-12-31`;
  }

  // Note: Runtime filtering is now done client-side after fetching detailed movie information
  // since the discover endpoint doesn't reliably include runtime data

  // Note: Streaming availability filtering will be done client-side
  // TMDB doesn't provide reliable streaming availability data in the discover endpoint

  console.log('Making TMDB API call with params:', params);
  console.log(`Adult content preference: ${includeAdult === null ? 'Any rating' : includeAdult ? 'R-rated and above' : 'Family-friendly (up to PG-13)'}`);
  console.log(`Runtime filtering will be applied after fetching detailed movie information`);
  console.log(`Streaming only: ${streamingOnly ? 'Yes' : 'No'}`);
  const response = await makeRequest('/discover/movie', params);
  
  // Apply strict certification filtering if not "any" mode
  if (includeAdult !== null) { // null means "any" mode
    console.log(`Applying strict certification filtering for ${includeAdult ? 'adult' : 'family'} mode...`);
    
    const beforeCount = response.results.length;
    const moviesToCheck = response.results.slice(0, 20); // Check first 20 movies for efficiency
    
    try {
      // Fetch release dates for movies in parallel
      const releaseDatesPromises = moviesToCheck.map(movie => 
        getMovieReleaseDates(movie.id).catch(err => {
          console.warn(`Failed to fetch release dates for ${movie.title}:`, err);
          return null;
        })
      );
      
      const releaseDatesResults = await Promise.all(releaseDatesPromises);
      
      // Filter movies based on strict certification requirements
      const filteredResults = [];
      let checkedCount = 0;
      
      for (let i = 0; i < response.results.length; i++) {
        const movie = response.results[i];
        
        if (i < moviesToCheck.length) {
          // Check certification for movies we fetched release dates for
          const releaseDates = releaseDatesResults[i];
          if (releaseDates) {
            const certification = parseUSCertification(releaseDates);
            const meetsRequirement = meetsCertificationRequirement(certification, includeAdult);
            
            if (meetsRequirement) {
              filteredResults.push(movie);
            } else {
              console.log(`Excluded ${movie.title} - US cert: ${certification || 'none'} (${includeAdult ? 'adult' : 'family'} mode)`);
            }
            checkedCount++;
          } else {
            // If we couldn't fetch release dates, exclude for safety
            console.log(`Excluded ${movie.title} - couldn't fetch release dates`);
          }
        } else {
          // For movies beyond our check limit, include them (they passed initial API filtering)
          filteredResults.push(movie);
        }
      }
      
      response.results = filteredResults;
      console.log(`Strict certification filtering: ${beforeCount} movies before, ${response.results.length} after (checked ${checkedCount} movies)`);
      
    } catch (error) {
      console.error('Error during strict certification filtering:', error);
      console.log('Falling back to API-level filtering only');
    }
  }
  
  // Apply language filtering client-side for better accuracy
  if (languagePreference !== 'both' && response.results) {
    const beforeCount = response.results.length;
    response.results = response.results.filter(movie => {
      const originalLanguage = movie.original_language;
      
      if (languagePreference === 'english') {
        return originalLanguage === 'en';
      } else if (languagePreference === 'non-english') {
        return originalLanguage !== 'en';
      }
      
      return true; // 'both' case
    });
    
    console.log(`Language filtering: ${beforeCount} movies before, ${response.results.length} after (${languagePreference})`);
    
    // Log a few examples for debugging
    if (response.results.length > 0) {
      console.log('Sample movies after language filtering:', 
        response.results.slice(0, 3).map(m => ({ 
          title: m.title, 
          original_language: m.original_language 
        }))
      );
    }
  }

  // Note: Runtime filtering is now applied after fetching detailed movie information
  // Streaming filtering will be applied in the useRecommendations hook
  // as TMDB doesn't provide reliable data for these filters
  
  return response;
};

// Get movie details including credits
export const getMovieDetails = async (movieId) => {
  const [movie, credits] = await Promise.all([
    makeRequest(`/movie/${movieId}`),
    makeRequest(`/movie/${movieId}/credits`),
  ]);

  return {
    ...movie,
    credits,
  };
};

// Get movie recommendations
export const getMovieRecommendations = async (movieId, count = 10) => {
  const response = await makeRequest(`/movie/${movieId}/recommendations`, {
    page: 1,
  });
  
  return response.results.slice(0, count);
};

// Get trending movies
export const getTrendingMovies = async (timeWindow = 'week') => {
  return makeRequest(`/trending/movie/${timeWindow}`);
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  return makeRequest('/movie/popular', { page });
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  return makeRequest('/movie/top_rated', { page });
};

// Helper function to get image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Helper function to get poster URL
export const getPosterUrl = (path, size = 'w500') => {
  return getImageUrl(path, size);
};

// Helper function to get backdrop URL
export const getBackdropUrl = (path, size = 'w1280') => {
  return getImageUrl(path, size);
};

// Helper function to get profile URL
export const getProfileUrl = (path, size = 'w185') => {
  return getImageUrl(path, size);
};

// Helper function to format movie data
export const formatMovieData = (movie) => {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genreIds: movie.genre_ids || [],
    adult: movie.adult,
    video: movie.video,
  };
};

// Helper function to get director from credits
export const getDirector = (credits) => {
  if (!credits?.crew) return null;
  return credits.crew.find(person => person.job === 'Director');
};

// Helper function to get main cast
export const getMainCast = (credits, count = 5) => {
  if (!credits?.cast) return [];
  return credits.cast.slice(0, count);
};

// Helper function to truncate text
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Helper function to format rating
export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

// Map ISO 639-1 language codes to readable names
export const getLanguageName = (code) => {
  if (!code) return 'Unknown';
  const map = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    pt: 'Portuguese',
    ru: 'Russian',
    hi: 'Hindi',
    ar: 'Arabic',
    tr: 'Turkish',
    nl: 'Dutch',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    pl: 'Polish',
    cs: 'Czech',
    fi: 'Finnish',
    he: 'Hebrew',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
  };
  return map[code] || code.toUpperCase();
};

// Get watch providers for a movie (country-scoped)
export const getWatchProviders = async (movieId) => {
  return makeRequest(`/movie/${movieId}/watch/providers`);
};

// Get release dates for a movie
export const getMovieReleaseDates = async (movieId) => {
  return makeRequest(`/movie/${movieId}/release_dates`);
};

// Parse US certification from release dates
export const parseUSCertification = (releaseDates) => {
  if (!releaseDates?.results) return null;
  
  // Find US release dates
  const usRelease = releaseDates.results.find(country => country.iso_3166_1 === 'US');
  if (!usRelease?.release_dates || usRelease.release_dates.length === 0) return null;
  
  // Sort by release type priority: theatrical (3) > digital (4) > physical (5) > tv (6)
  const sortedReleases = usRelease.release_dates.sort((a, b) => {
    const typePriority = { 3: 1, 4: 2, 5: 3, 6: 4, 2: 5, 1: 6 };
    return (typePriority[a.type] || 999) - (typePriority[b.type] || 999);
  });
  
  // Return the certification from the most relevant release
  return sortedReleases[0]?.certification || null;
};

// Check if certification meets the strict requirements
export const meetsCertificationRequirement = (certification, includeAdult) => {
  if (!certification) return false; // No US certification = exclude
  
  const ratingOrder = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'X'];
  const certIndex = ratingOrder.indexOf(certification);
  
  if (certIndex === -1) return false; // Unknown rating = exclude
  
  if (!includeAdult) {
    // Family mode: must be ≤ PG-13
    return certIndex <= 2; // G, PG, or PG-13
  } else {
    // Adult mode: must be ≥ R
    return certIndex >= 3; // R, NC-17, or X
  }
};

// Helper function to get decade from year
export const getDecade = (year) => {
  return Math.floor(year / 10) * 10;
};

// Helper function to get year from decade
export const getYearFromDecade = (decade) => {
  return decade + Math.floor(Math.random() * 10);
};
