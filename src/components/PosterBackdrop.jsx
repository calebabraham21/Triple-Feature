import { useEffect, useState } from 'react';
import { getTrendingMovies, getPosterUrl } from '../utils/tmdb';

const PosterBackdrop = ({ count = 12 }) => {
  const [posterUrls, setPosterUrls] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const trending = await getTrendingMovies('week');
        const results = trending?.results || [];
        const posters = results
          .filter((m) => m.poster_path)
          .slice(0, count)
          .map((m) => getPosterUrl(m.poster_path, 'w500'));
        if (isMounted) setPosterUrls(posters);
      } catch (e) {
        // ignore background failures
      }
    };
    load();
    return () => { isMounted = false; };
  }, [count]);

  if (posterUrls.length === 0) return null;

  // Duplicate to ensure coverage if needed
  const tiles = posterUrls.length < count ? [...posterUrls, ...posterUrls].slice(0, count) : posterUrls;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80 z-10" />
      <div className="relative w-full h-full opacity-25">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 w-full h-full filter blur-2xl scale-110">
          {tiles.map((src, idx) => (
            <div key={idx} className="w-full h-56 sm:h-60 md:h-64">
              <img src={src} alt="poster" className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PosterBackdrop;


