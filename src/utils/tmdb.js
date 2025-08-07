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
    page = 1,
    sortBy = 'popularity.desc',
    minRating = 6.0,
  } = filters;

  let params = {
    page,
    'sort_by': sortBy,
    'vote_average.gte': minRating,
    'vote_count.gte': 100, // Minimum vote count for quality
  };

  if (genres.length > 0) {
    params.with_genres = genres.join(',');
  }

  // If specific decades are provided, pass the broadest range to TMDB (min..max)
  if (Array.isArray(decades) && decades.length > 0) {
    const minDecade = Math.min(...decades);
    const maxDecade = Math.max(...decades) + 9;
    params['primary_release_date.gte'] = `${minDecade}-01-01`;
    params['primary_release_date.lte'] = `${maxDecade}-12-31`;
  }

  return makeRequest('/discover/movie', params);
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

// Helper function to get decade from year
export const getDecade = (year) => {
  return Math.floor(year / 10) * 10;
};

// Helper function to get year from decade
export const getYearFromDecade = (decade) => {
  return decade + Math.floor(Math.random() * 10);
};
