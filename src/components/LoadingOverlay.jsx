import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LoadingOverlay = ({ isVisible, message = "Finding your perfect movies..." }) => {
  // Lock/unlock scroll whenever visibility changes; also unlock on unmount
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isVisible]);

  return (
    isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div className="bg-cinema-dark/95 border border-cinema-light/20 rounded-2xl p-8 max-w-md mx-4 text-center">
        {/* Loading spinner */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full h-12 w-12 border-2 border-transparent border-t-accent-blue border-l-accent-blue animate-[spin_0.9s_linear_infinite]" />
        </div>
        
        {/* Title */}
        <h2 id="loading-title" className="text-xl font-bold text-white mb-3">
          Building Your Movie Database
        </h2>
        
        {/* Description */}
        <p id="loading-description" className="text-white/80 text-sm mb-6">
          {message}
        </p>
        
        {/* Indeterminate progress bar */}
        <div className="w-full bg-cinema-gray/30 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-red indeterminate-bar" />
        </div>
        
        {/* Additional info */}
        <p className="text-white/60 text-xs mt-4">
          This may take a moment as we search through thousands of movies...
        </p>
      </div>
    </motion.div>
    )
  );
};

export default LoadingOverlay;
