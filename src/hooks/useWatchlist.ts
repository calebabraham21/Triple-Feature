import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export interface WatchlistMovie {
  id: string;
  movie_id: number;
  user_id: string;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  created_at: string;
}

export function useWatchlist() {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWatchlist(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add movie to watchlist
  const addToWatchlist = async (movie: any) => {
    if (!isAuthenticated) {
      throw new Error('You must be signed in to add movies to your watchlist');
    }

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          movie_id: movie.id,
          user_id: user?.id,
          title: movie.title,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        })
        .select()
        .single();

      if (error) throw error;

      setWatchlist(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error adding to watchlist:', err);
      throw err;
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId: number) => {
    if (!isAuthenticated) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('movie_id', movieId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setWatchlist(prev => prev.filter(movie => movie.movie_id !== movieId));
    } catch (err: any) {
      console.error('Error removing from watchlist:', err);
      throw err;
    }
  };

  // Check if movie is in watchlist
  const isInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.movie_id === movieId);
  };

  // Toggle movie in watchlist
  const toggleWatchlist = async (movie: any) => {
    if (isInWatchlist(movie.id)) {
      await removeFromWatchlist(movie.id);
    } else {
      await addToWatchlist(movie);
    }
  };

  // Fetch watchlist on mount and when user changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [isAuthenticated, user?.id]);

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    fetchWatchlist,
  };
}
