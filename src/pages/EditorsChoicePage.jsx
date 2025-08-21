import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchMovieByTitle, getPosterUrl, getMovieDetails } from '../utils/tmdb';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const EditorsChoicePage = () => {
  const [currentPick, setCurrentPick] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const OWNER_UUID = import.meta.env.VITE_OWNER_UUID || '99f02ae0-fbcf-4c8c-b5f6-1a1200c6e073';
  const isOwner = Boolean(isAuthenticated && OWNER_UUID && user?.id === OWNER_UUID);
  const [form, setForm] = useState({ title: '', year: '', director: '', runtime: '', poster_path: '', review: '' });
  const [ratingValue, setRatingValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [reviewExpanded, setReviewExpanded] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('editors_choice').insert({
        user_id: user?.id || null,
        title: form.title,
        year: form.year ? Number(form.year) : null,
        director: form.director || null,
        runtime: form.runtime ? Number(form.runtime) : null,
        rating: ratingValue ? `${ratingValue}/5` : null,
        poster_path: form.poster_path || null,
        review: form.review || null,
      });
      if (error) throw error;
      setForm({ title: '', year: '', director: '', runtime: '', poster_path: '', review: '' });
      setRatingValue(0);
      await loadCurrentPick();
      alert('Saved!');
    } catch (err) {
      alert('Failed to save: ' + (err?.message || err));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const queries = [
          { title: 'Mulholland Drive', year: 2001 },
          { title: 'Paris, Texas', year: 1984 },
          { title: 'The Big Lebowski', year: 1998 },
        ];
        const results = await Promise.all(
          queries.map(async (q) => {
            const r = await searchMovieByTitle(q.title, q.year);
            const m = r?.results?.[0];
            return m ? { id: m.id, title: m.title, poster_path: m.poster_path, year: q.year } : null;
          })
        );
        if (!active) return;
        setFavorites(results.filter(Boolean));
      } catch (e) {
        if (!active) return;
        setFavorites([]);
      }
    };
    load();
    loadCurrentPick();
    return () => { active = false; };
  }, []);

  const loadCurrentPick = async () => {
    try {
      const { data, error } = await supabase
        .from('editors_choice')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      setCurrentPick(data && data.length > 0 ? data[0] : null);
      setReviewExpanded(false);
    } catch (e) {
      setCurrentPick(null);
    }
  };

  const runSearch = async () => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    try {
      setSearching(true);
      const r = await searchMovieByTitle(searchQuery.trim());
      setResults(r?.results?.slice(0, 8) || []);
    } catch (e) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const chooseMovie = async (m) => {
    try {
      const d = await getMovieDetails(m.id);
      const director = d?.credits?.crew?.find((p) => p.job === 'Director')?.name || '';
      setForm({
        title: d?.title || m.title || '',
        year: d?.release_date ? new Date(d.release_date).getFullYear().toString() : (m.release_date ? new Date(m.release_date).getFullYear().toString() : ''),
        director,
        runtime: d?.runtime ? String(d.runtime) : '',
        poster_path: d?.poster_path || m.poster_path || '',
        review: ''
      });
      setRatingValue(0);
      setResults([]);
      setSearchQuery('');
    } catch {}
  };

  // Debounce title search when typing in the title field
  useEffect(() => {
    if (!isOwner) return;
    const t = setTimeout(() => {
      if (searchQuery.trim().length >= 2) runSearch();
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="min-h-screen app-gradient">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles size={36} className="text-accent-gold" />
            <h1 className="text-3xl font-bold text-white">Editor's Choice</h1>
          </div>
          <p className="text-lg text-white/80">
          My personal pick of the week
          </p>
        </motion.div>

        {/* Weekly Pick (DB-backed) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cinema-dark/50 border border-cinema-light/20 rounded-xl p-4 md:p-5 mb-6"
        >
          {/* Mobile layout */}
          <div className="md:hidden space-y-3">
            {/* Poster full-width with bubbles */}
            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg border border-cinema-light/20 bg-cinema-dark/30">
              {currentPick?.poster_path ? (
                <img src={getPosterUrl(currentPick.poster_path)} alt={currentPick?.title || ''} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/60">🎬</div>
              )}
              {/* Runtime & Year bubbles */}
              <div className="absolute bottom-2 left-2 z-10 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs text-white">
                <Clock size={12} className="opacity-80" />
                <span>{currentPick?.runtime ? `${currentPick.runtime} min` : 'TBD'}</span>
              </div>
              <div className="absolute bottom-2 right-2 z-10 bg-cinema-dark/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs text-white">
                {currentPick?.year || 'TBD'}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white leading-snug line-clamp-2">{currentPick?.title || 'Coming Soon'}</h2>

            {/* Meta row (director + rating) */}
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div>
                <span className="font-medium text-white">Director</span> <span>{currentPick?.director || 'TBD'}</span>
              </div>
              <div className="inline-flex items-center gap-1">
                <Star size={14} className="text-accent-gold" />
                <span>{currentPick?.rating || 'TBD'}</span>
              </div>
            </div>

            {/* Review */}
            <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-3">
              <p className="text-white/80 text-sm leading-relaxed">{currentPick?.review || 'Weekly movie reviews are coming soon.'}</p>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] gap-3 md:gap-4 items-start">
            {/* Poster */}
            <div className="w-[160px] md:w-[220px]">
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg border border-cinema-light/20 bg-cinema-dark/30">
                {currentPick?.poster_path ? (
                  <img src={getPosterUrl(currentPick.poster_path)} alt={currentPick?.title || ''} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/60">🎬</div>
                )}
              </div>
            </div>

            {/* Details condensed */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-white leading-snug line-clamp-2">{currentPick?.title || 'Coming Soon'}</h2>
                <span className="text-lg md:text-xl font-semibold text-white/90">{currentPick?.year || 'TBD'}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs md:text-sm text-white/80">
                <div>
                  <div className="font-medium text-white">Director</div>
                  <div>{currentPick?.director || 'TBD'}</div>
                </div>
                <div>
                  <div className="font-medium text-white">Runtime</div>
                  <div className="inline-flex items-center gap-1"><Clock size={14} /><span>{currentPick?.runtime ? `${currentPick.runtime} min` : 'TBD'}</span></div>
                </div>
                <div>
                  <div className="font-medium text-white">Rating</div>
                  <div className="inline-flex items-center gap-1"><Star size={14} className="text-accent-gold" /><span>{currentPick?.rating || 'TBD'}</span></div>
                </div>
              </div>

              <div className="bg-cinema-dark/30 border border-cinema-light/20 rounded-lg p-3">
                <p className="text-white/80 text-sm leading-relaxed">{currentPick?.review || 'Weekly movie reviews are coming soon.'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Favorites mini section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cinema-dark/40 border border-cinema-light/20 rounded-xl p-4 md:p-5 mb-8 side-rails"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">My all‑time favorites</h3>
            <span className="text-xs text-white/60">Top 3</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {favorites.map((m, idx) => (
              <div key={m.id} className="bg-cinema-dark/40 border border-cinema-light/20 rounded-lg p-2 text-center">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md mb-2">
                  {m.poster_path ? (
                    <img src={getPosterUrl(m.poster_path)} alt={m.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-cinema-gray flex items-center justify-center text-white/60">No poster</div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-cinema-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">#{idx + 1}</div>
                </div>
                <div className="text-xs text-white line-clamp-2">{m.title}</div>
                <div className="text-[10px] text-white/70">{m.year}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auth-only CMS block with TMDB autocomplete & star rating */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-cinema-dark/40 border border-cinema-light/20 rounded-xl p-4 md:p-5 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-3">Update Weekly Pick</h3>
            <form className="grid md:grid-cols-2 gap-3" onSubmit={handleSave}>
              <div className="relative md:col-span-2">
                <input
                  className="w-full bg-cinema-gray text-white rounded p-2 border border-cinema-light/30"
                  placeholder="Title"
                  value={form.title}
                  onChange={e=>{setForm({...form,title:e.target.value}); setSearchQuery(e.target.value);}}
                  required
                />
                {results && results.length > 0 && searchQuery.trim().length >= 2 && (
                  <div className="absolute z-10 mt-1 w-full bg-cinema-dark/95 border border-cinema-light/30 rounded-lg max-h-60 overflow-auto">
                    {searching && <div className="px-3 py-2 text-white/60 text-sm">Searching…</div>}
                    {results.map((m) => (
                      <button type="button" key={m.id} onClick={() => chooseMovie(m)} className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-white/10">
                        <div className="w-8 h-12 overflow-hidden rounded bg-cinema-gray/50">
                          {m.poster_path ? <img src={getPosterUrl(m.poster_path)} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white line-clamp-1">{m.title}</div>
                          <div className="text-[11px] text-white/60">{m.release_date ? new Date(m.release_date).getFullYear() : ''}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Year (e.g. 1990)" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Director" value={form.director} onChange={e=>setForm({...form,director:e.target.value})} />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Runtime (min)" value={form.runtime} onChange={e=>setForm({...form,runtime:e.target.value})} />
              {/* Star rating */}
              <div className="flex items-center gap-2">
                <StarRating value={ratingValue} onChange={setRatingValue} />
                <span className="text-white/70 text-sm">{ratingValue ? `${ratingValue}/5` : 'Rate'}</span>
              </div>
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Poster path (/abc123.jpg)" value={form.poster_path} onChange={e=>setForm({...form,poster_path:e.target.value})} />
              <textarea className="md:col-span-2 bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" rows="3" placeholder="Short review" value={form.review} onChange={e=>setForm({...form,review:e.target.value})} />
              <div className="md:col-span-2 flex justify-end">
                <button disabled={saving} className="px-4 py-2 rounded-lg bg-accent-blue hover:bg-accent-blue/80 text-white border border-blue-700/40">
                  {saving ? 'Saving…' : 'Save Pick'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

  
      </div>
    </div>
  );
};

export default EditorsChoicePage;

// Simple star rating component with 0.5 steps
function StarRating({ value, onChange }) {
  const steps = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
  return (
    <div className="flex items-center gap-1">
      {steps.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`p-0.5 rounded ${value >= v ? 'text-accent-gold' : 'text-white/30'}`}
          title={`${v}/5`}
        >
          <Star size={18} className={value >= v ? 'fill-current' : ''} />
        </button>
      ))}
    </div>
  );
}
