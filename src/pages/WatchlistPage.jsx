import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Trash2, Eye, EyeOff, Filter, X, CheckCircle } from 'lucide-react';

const WatchlistPage = () => {
  const { movies, removeMovie, toggleWatched, clearWatchlist } = useWatchlist();
  const [filter, setFilter] = useState('all'); // 'all', 'watched', 'unwatched'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredMovies = movies.filter(movie => {
    switch (filter) {
      case 'watched':
        return movie.watched;
      case 'unwatched':
        return !movie.watched;
      default:
        return true;
    }
  });

  const watchedCount = movies.filter(movie => movie.watched).length;
  const unwatchedCount = movies.filter(movie => !movie.watched).length;

  const handleClearWatchlist = () => {
    clearWatchlist();
    setShowClearConfirm(false);
  };

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case 'watched':
        return <Eye size={16} />;
      case 'unwatched':
        return <EyeOff size={16} />;
      default:
        return <Filter size={16} />;
    }
  };

  const getFilterLabel = (filterType) => {
    switch (filterType) {
      case 'watched':
        return 'Watched';
      case 'unwatched':
        return 'Unwatched';
      default:
        return 'All';
    }
  };

  return (
    <div className="min-h-screen cinema-gradient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">My Watchlist</h1>
          <p className="text-white">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-white">{movies.length}</div>
            <div className="text-white">Total Movies</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-accent-gold">{watchedCount}</div>
            <div className="text-white">Watched</div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-accent-blue">{unwatchedCount}</div>
            <div className="text-white">To Watch</div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-white">Filter:</span>
            <div className="flex bg-cinema-gray rounded-lg p-1">
              {['all', 'unwatched', 'watched'].map((filterType) => (
                <motion.button
                  key={filterType}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(filterType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filter === filterType
                      ? 'bg-accent-red text-white'
                      : 'text-white hover:text-white'
                  }`}
                >
                  {getFilterIcon(filterType)}
                  {getFilterLabel(filterType)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Clear Watchlist */}
          {movies.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition-all duration-200"
            >
              <Trash2 size={16} />
              Clear Watchlist
            </motion.button>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative z-0">
                    <MovieCard 
                      movie={movie} 
                      showAddButton={false}
                    />
                    
                    {/* Watched indicator */}
                    {movie.watched && (
                      <div className="absolute top-4 left-4 z-30 pointer-events-auto bg-accent-gold text-cinema-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={12} />
                        Watched
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    <div className="absolute top-4 right-4 z-30 flex gap-2 pointer-events-auto">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWatched(movie.id)}
                        className={`p-2 rounded-full backdrop-blur-sm ${
                          movie.watched
                            ? 'bg-accent-gold/80 text-cinema-black'
                            : 'bg-cinema-dark/80 text-white hover:bg-accent-blue/80'
                        }`}
                      >
                        {movie.watched ? <Eye size={16} /> : <EyeOff size={16} />}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeMovie(movie.id)}
                        className="p-2 rounded-full bg-red-500/80 text-white backdrop-blur-sm hover:bg-red-500"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">
              {movies.length === 0 ? 'Your watchlist is empty' : 'No movies match your filter'}
            </h3>
            <p className="text-white">
              {movies.length === 0 
                ? 'Start adding movies to your watchlist to see them here!'
                : 'Try changing your filter or add more movies to your watchlist.'
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cinema-dark border border-cinema-gray rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Clear Watchlist?</h3>
              <p className="text-white mb-6">
                This will permanently remove all {movies.length} movie{movies.length !== 1 ? 's' : ''} from your watchlist. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearWatchlist}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Clear All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WatchlistPage;
