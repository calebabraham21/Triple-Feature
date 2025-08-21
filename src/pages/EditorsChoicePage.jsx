import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { searchMovieByTitle, getPosterUrl } from '../utils/tmdb';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

const EditorsChoicePage = () => {
  // Placeholder data for the weekly movie
  const weeklyMovie = {
    title: "Coming Soon",
    year: "TBD",
    director: "TBD",
    runtime: "TBD",
    rating: "TBD",
    poster: null,
    review: "Weekly movie reviews are coming soon. Each week I’ll share quick thoughts on a movie I watched for the first time. Honestly this is just to keep me motivated to watch at least one new one every week.",
    whyPick: "Who knows just yet!"
  };

  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const OWNER_UUID = import.meta.env.VITE_OWNER_UUID || '99f02ae0-fbcf-4c8c-b5f6-1a1200c6e073';
  const isOwner = Boolean(isAuthenticated && OWNER_UUID && user?.id === OWNER_UUID);
  const [form, setForm] = useState({ title: '', year: '', director: '', runtime: '', rating: '', poster_path: '', review: '', why_pick: '' });
  const [saving, setSaving] = useState(false);

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
        rating: form.rating || null,
        poster_path: form.poster_path || null,
        review: form.review || null,
        why_pick: form.why_pick || null,
      });
      if (error) throw error;
      setForm({ title: '', year: '', director: '', runtime: '', rating: '', poster_path: '', review: '', why_pick: '' });
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
    return () => { active = false; };
  }, []);

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

        {/* Weekly Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cinema-dark/50 border border-cinema-light/20 rounded-xl p-6 mb-8"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-gold/20 text-accent-gold rounded-full text-sm font-medium mb-3">
              <Calendar size={14} />
              <span>This Week's Pick</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Movie Poster */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              {weeklyMovie.poster ? (
                <img
                  src={weeklyMovie.poster}
                  alt={weeklyMovie.title}
                  className="w-full max-w-sm mx-auto rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-sm mx-auto h-96 bg-cinema-dark/30 border border-cinema-light/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-white/60 text-lg">Coming Soon</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Movie Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-2xl font-bold text-white">{weeklyMovie.title}</h2>
              
              {/* Movie Meta */}
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span>{weeklyMovie.year}</span>
                <span>•</span>
                <span>{weeklyMovie.director}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{weeklyMovie.runtime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-accent-gold" />
                  <span>{weeklyMovie.rating}</span>
                </div>
              </div>

              {/* Review */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">My Review</h3>
                <p className="text-white/80 text-sm leading-relaxed">{weeklyMovie.review}</p>
              </div>

              {/* Why This Pick */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">Why This Pick?</h3>
                <p className="text-white/80 text-sm leading-relaxed">{weeklyMovie.whyPick}</p>
              </div>
            </motion.div>
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

        {/* Simple Auth-only CMS block */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-cinema-dark/40 border border-cinema-light/20 rounded-xl p-4 md:p-5 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-3">Update Weekly Pick</h3>
            <form className="grid md:grid-cols-2 gap-3" onSubmit={handleSave}>
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Year (e.g. 1990)" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Director" value={form.director} onChange={e=>setForm({...form,director:e.target.value})} />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Runtime (min)" value={form.runtime} onChange={e=>setForm({...form,runtime:e.target.value})} />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Rating (e.g. 4/5)" value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} />
              <input className="bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" placeholder="Poster path (/abc123.jpg)" value={form.poster_path} onChange={e=>setForm({...form,poster_path:e.target.value})} />
              <textarea className="md:col-span-2 bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" rows="3" placeholder="Short review" value={form.review} onChange={e=>setForm({...form,review:e.target.value})} />
              <textarea className="md:col-span-2 bg-cinema-gray text-white rounded p-2 border border-cinema-light/30" rows="2" placeholder="Why this pick" value={form.why_pick} onChange={e=>setForm({...form,why_pick:e.target.value})} />
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
