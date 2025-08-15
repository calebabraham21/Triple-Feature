# Triple-Feature

Movie recommendations for your perfect movie night.

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Database Setup

The application expects a `profiles` table in your Supabase database with the following structure:

```sql
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## Features

- **Smart Movie Recommendations**: AI-powered suggestions based on your preferences
- **User Authentication**: Secure signup/signin with Supabase Auth
- **Profile Management**: Store and manage your personal information
- **Responsive Design**: Beautiful UI that works on all devices

## Development

```bash
npm install
npm run dev
```
