import { createContext, useContext, useReducer, useEffect } from 'react';

const WatchlistContext = createContext();

const initialState = {
  movies: [],
  loading: false,
  error: null,
};

const watchlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      const existingMovie = state.movies.find(movie => movie.id === action.payload.id);
      if (existingMovie) {
        return state; // Movie already exists
      }
      return {
        ...state,
        movies: [...state.movies, { ...action.payload, addedAt: new Date().toISOString() }],
      };
    
    case 'REMOVE_MOVIE':
      return {
        ...state,
        movies: state.movies.filter(movie => movie.id !== action.payload),
      };
    
    case 'TOGGLE_WATCHED':
      return {
        ...state,
        movies: state.movies.map(movie =>
          movie.id === action.payload
            ? { ...movie, watched: !movie.watched, watchedAt: !movie.watched ? new Date().toISOString() : null }
            : movie
        ),
      };
    
    case 'CLEAR_WATCHLIST':
      return {
        ...state,
        movies: [],
      };
    
    case 'LOAD_WATCHLIST':
      return {
        ...state,
        movies: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export const WatchlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(watchlistReducer, initialState);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('triple-feature-watchlist');
      if (savedWatchlist) {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        dispatch({ type: 'LOAD_WATCHLIST', payload: parsedWatchlist });
      }
    } catch (error) {
      console.error('Error loading watchlist from localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load watchlist' });
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('triple-feature-watchlist', JSON.stringify(state.movies));
    } catch (error) {
      console.error('Error saving watchlist to localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save watchlist' });
    }
  }, [state.movies]);

  const addMovie = (movie) => {
    dispatch({ type: 'ADD_MOVIE', payload: movie });
  };

  const removeMovie = (movieId) => {
    dispatch({ type: 'REMOVE_MOVIE', payload: movieId });
  };

  const toggleWatched = (movieId) => {
    dispatch({ type: 'TOGGLE_WATCHED', payload: movieId });
  };

  const clearWatchlist = () => {
    dispatch({ type: 'CLEAR_WATCHLIST' });
  };

  const isInWatchlist = (movieId) => {
    return state.movies.some(movie => movie.id === movieId);
  };

  const getWatchedMovies = () => {
    return state.movies.filter(movie => movie.watched);
  };

  const getUnwatchedMovies = () => {
    return state.movies.filter(movie => !movie.watched);
  };

  const value = {
    ...state,
    addMovie,
    removeMovie,
    toggleWatched,
    clearWatchlist,
    isInWatchlist,
    getWatchedMovies,
    getUnwatchedMovies,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
