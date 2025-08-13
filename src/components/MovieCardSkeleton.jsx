import { motion } from 'framer-motion';

const MovieCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-cinema-gray/20 border border-cinema-light/20 rounded-xl overflow-hidden backdrop-blur-sm"
      role="status"
      aria-label="Loading movie recommendation"
    >
      {/* Poster skeleton */}
      <div className="relative h-80 bg-gradient-to-br from-cinema-gray/30 to-cinema-gray/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-gray/20 to-cinema-gray/40" />
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3 bg-gradient-to-b from-cinema-gray/10 to-cinema-gray/20">
        {/* Title skeleton */}
        <div className="h-6 bg-cinema-gray/40 rounded animate-pulse" />
        
        {/* Rating and year skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-cinema-gray/40 rounded animate-pulse" />
          <div className="h-4 w-12 bg-cinema-gray/40 rounded animate-pulse" />
        </div>
        
        {/* Genre skeleton */}
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-cinema-gray/40 rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-cinema-gray/40 rounded-full animate-pulse" />
        </div>
        
        {/* Overview skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-cinema-gray/40 rounded animate-pulse" />
          <div className="h-4 bg-cinema-gray/40 rounded animate-pulse w-3/4" />
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-cinema-gray/40 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  );
};

export default MovieCardSkeleton;
