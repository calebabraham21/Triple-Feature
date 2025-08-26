import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getPosterUrl } from '../utils/tmdb';
import GlowButton from '../components/GlowButton';
import { Calendar, Search, ArrowUpDown, Clock, Star } from 'lucide-react';

const PAGE_SIZE = 20;

const formatPickDate = (value) => {
  try {
    const d = value ? new Date(value) : null;
    if (!d || isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const PicksPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest' | 'oldest'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const debounceRef = useRef(null);

  const orderAscending = sort === 'oldest';

  const effectiveQuery = useMemo(() => query.trim(), [query]);

  const resetAndLoad = () => {
    setItems([]);
    setPage(1);
    setHasMore(false);
    loadPage({ page: 1, replace: true });
  };

  useEffect(() => {
    // Initial load
    resetAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Debounce search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      resetAndLoad();
    }, 350);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveQuery]);

  useEffect(() => {
    resetAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const buildBaseQuery = () => {
    let q = supabase.from('editors_choice').select('*');
    if (effectiveQuery.length >= 1) {
      const like = `%${effectiveQuery}%`;
      q = q.or(
        `title.ilike.${like},director.ilike.${like},review.ilike.${like}`
      );
    }
    return q;
  };

  const loadPage = async ({ page: p, replace = false } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const from = (p - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Try ordering by picked_at first, fall back to created_at if column doesn't exist
      let { data, error: err } = await buildBaseQuery()
        .order('picked_at', { ascending: orderAscending, nullsFirst: orderAscending })
        .range(from, to);

      if (err) {
        // Fallback to created_at
        const res2 = await buildBaseQuery()
          .order('created_at', { ascending: orderAscending })
          .range(from, to);
        data = res2.data;
        err = res2.error;
      }

      if (err) throw err;

      const next = Array.isArray(data) ? data : [];
      setItems((prev) => (replace ? next : [...prev, ...next]));
      setHasMore(next.length === PAGE_SIZE);
      setPage(p);
    } catch (e) {
      setError(e?.message || 'Failed to load picks');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    loadPage({ page: page + 1, replace: false });
  };

  return (
    <div className="min-h-screen app-gradient">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">All Editor's Picks</h1>
            <p className="text-white/75 text-sm">Browse past selections</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center bg-cinema-dark/40 border border-cinema-light/30 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-2 text-sm text-white inline-flex items-center gap-1 ${sort === 'newest' ? 'bg-accent-blue/20' : ''}`}
                onClick={() => setSort('newest')}
              >
                <ArrowUpDown size={14} /> Newest
              </button>
              <button
                className={`px-3 py-2 text-sm text-white inline-flex items-center gap-1 ${sort === 'oldest' ? 'bg-accent-blue/20' : ''}`}
                onClick={() => setSort('oldest')}
              >
                <ArrowUpDown size={14} /> Oldest
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, director, or blurb..."
              className="w-full bg-cinema-dark/50 border border-cinema-light/30 text-white rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-accent-blue/70"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {items.map((pick) => {
            const dateValue = pick.picked_at || pick.created_at;
            return (
              <div
                key={pick.id}
                className="bg-cinema-dark/40 border border-cinema-light/20 rounded-xl p-3 md:p-4"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  {/* Poster */}
                  <div className="w-full md:w-[160px] shrink-0">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg border border-cinema-light/20 bg-cinema-dark/30">
                      {pick.poster_path ? (
                        <img
                          src={getPosterUrl(pick.poster_path)}
                          alt={pick.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/60">🎬</div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h2 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2">{pick.title}</h2>
                        {pick.year ? (
                          <span className="text-white/85 font-semibold">{pick.year}</span>
                        ) : null}
                      </div>
                      {pick.director && (
                        <div className="text-sm text-white/80 mb-2">Dir. {pick.director}</div>
                      )}
                      {pick.review && (
                        <p className="text-sm text-white/85 leading-relaxed mb-2 md:mb-3">{pick.review}</p>
                      )}
                    </div>

                    {/* Footer metadata pinned to bottom */}
                    <div className="mt-3 pt-2 border-t border-cinema-light/20 flex items-center flex-wrap gap-2 text-xs text-white/85">
                      <div className="inline-flex items-center gap-1.5 bg-cinema-dark/40 border border-cinema-light/20 rounded-full px-2.5 py-1">
                        <Calendar size={12} className="opacity-80" />
                        <span>Picked {formatPickDate(dateValue)}</span>
                      </div>
                      {typeof pick.runtime === 'number' && pick.runtime > 0 && (
                        <div className="inline-flex items-center gap-1.5 bg-cinema-dark/40 border border-cinema-light/20 rounded-full px-2.5 py-1">
                          <Clock size={12} className="opacity-80" />
                          <span>{pick.runtime} min</span>
                        </div>
                      )}
                      {pick.rating && (
                        <div className="inline-flex items-center gap-1.5 bg-cinema-dark/40 border border-cinema-light/20 rounded-full px-2.5 py-1">
                          <Star size={12} className="text-accent-gold" />
                          <span>{pick.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-6">
          {error && (
            <div className="text-red-300 text-sm mr-3">{error}</div>
          )}
          {hasMore && (
            <GlowButton onClick={handleLoadMore} disabled={loading} className="px-4 py-2 text-sm">
              {loading ? 'Loading…' : 'Load more'}
            </GlowButton>
          )}
        </div>

        {/* Empty/Loading states */}
        {loading && items.length === 0 && (
          <div className="text-center text-white/70 py-16">Loading picks…</div>
        )}
        {!loading && items.length === 0 && !error && (
          <div className="text-center text-white/70 py-16">No picks found.</div>
        )}
      </div>
    </div>
  );
};

export default PicksPage;


