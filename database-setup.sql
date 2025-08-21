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

-- Editor's Choice table for weekly featured movie
CREATE TABLE IF NOT EXISTS editors_choice (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  year INTEGER,
  director TEXT,
  runtime INTEGER,
  rating TEXT,
  poster_path TEXT,
  review TEXT,
  why_pick TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE IF EXISTS editors_choice ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read; authenticated users can insert; owners can update/delete
CREATE POLICY "Public can view editor picks" ON editors_choice
  FOR SELECT USING (true);

-- Only a specific owner UUID can insert/update/delete; set via a Supabase function comparing to a config var
CREATE OR REPLACE FUNCTION public.is_owner() RETURNS boolean AS $$
  SELECT auth.uid() = COALESCE(current_setting('app.owner_uuid', true), '99f02ae0-fbcf-4c8c-b5f6-1a1200c6e073')::uuid;
$$ LANGUAGE sql STABLE;

-- Allow the owner to insert/update/delete
CREATE POLICY "Owner can insert editor pick" ON editors_choice
  FOR INSERT WITH CHECK (public.is_owner());

CREATE POLICY "Owner can update editor pick" ON editors_choice
  FOR UPDATE USING (public.is_owner());

CREATE POLICY "Owner can delete editor pick" ON editors_choice
  FOR DELETE USING (public.is_owner());