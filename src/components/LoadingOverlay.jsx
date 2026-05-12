import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LoadingOverlay = ({ isVisible, message = "Finding your perfect movies..." }) => {
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

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-reel/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
    >
      <div className="text-center max-w-xs mx-4">
        <div className="mb-7 flex justify-center">
          <div className="rounded-full h-9 w-9 border border-paper/15 border-t-paper/70 animate-spin" />
        </div>
        <h2 id="loading-title" className="font-cinema text-base font-medium text-paper mb-2">
          Building your lineup
        </h2>
        <p className="text-paper/50 text-sm mb-7 leading-relaxed">{message}</p>
        <div className="w-40 mx-auto h-px bg-paper/10 overflow-hidden rounded-full">
          <div className="h-full w-1/3 bg-paper/50 rounded-full indeterminate-bar" />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
