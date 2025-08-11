import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth.js';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Load profile when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, create one
          await createProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          first_name: '',
          last_name: '',
          phone: null
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.message);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    if (isAuthenticated && user) {
      loadProfile();
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    loadProfile
  };
};
