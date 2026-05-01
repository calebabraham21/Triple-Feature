/**
 * Public Supabase client — anon key only (VITE_SUPABASE_ANON_KEY). Never expose a service-role key here.
 *
 * This app is read-only from the browser: only SELECT via RLS-approved policies.
 * Sessions / sign-in UI have been removed; auth options are minimized so stray tokens are not persisted.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
