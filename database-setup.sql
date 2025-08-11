-- Database setup for Triple Feature movie app
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  overview TEXT,
  release_date DATE,
  vote_average DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_movie_id ON watchlist(movie_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_created_at ON watchlist(created_at DESC);

-- Row Level Security Policies

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Watchlist: Users can only see and manage their own watchlist
CREATE POLICY "Users can view own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist items" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist items" ON watchlist
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist items" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.watchlist TO anon, authenticated;
GRANT USAGE ON SEQUENCE watchlist_id_seq TO anon, authenticated;
