const MovieCardSkeleton = () => {
  return (
    <div
      className="flex gap-5 py-5 px-1 border-b border-smoke"
      role="status"
      aria-label="Loading movie recommendation"
    >
      <div className="flex-shrink-0 w-14 sm:w-16">
        <div className="aspect-[2/3] bg-smoke rounded-sm animate-pulse" />
      </div>
      <div className="flex-1 space-y-2.5 py-0.5">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 bg-smoke rounded animate-pulse w-2/3" />
          <div className="h-3 bg-smoke rounded animate-pulse w-16 flex-shrink-0" />
        </div>
        <div className="h-3 bg-smoke rounded animate-pulse w-2/5" />
        <div className="space-y-1.5 mt-1">
          <div className="h-3 bg-smoke rounded animate-pulse w-full" />
          <div className="h-3 bg-smoke rounded animate-pulse w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
