-- ============================================
-- Shaler Lacrosse - Supabase Database Schema
-- Phase 4: Backend Integration
-- ============================================

-- ============================================
-- 1. GAMES TABLE
-- ============================================
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  date DATE NOT NULL,
  time TIME NOT NULL,
  opponent VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  game_type VARCHAR(10) CHECK (game_type IN ('home', 'away')) NOT NULL,
  notes TEXT,
  season VARCHAR(10) DEFAULT '2025-26'
);

-- Create indexes
CREATE INDEX games_date_idx ON games(date);
CREATE INDEX games_season_idx ON games(season);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view games" ON games
  FOR SELECT USING (true);

-- Only authenticated users can manage
CREATE POLICY "Authenticated can manage games" ON games
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 2. RESULTS TABLE
-- ============================================
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  game_date DATE NOT NULL,
  opponent VARCHAR(255) NOT NULL,
  titans_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  location VARCHAR(255) NOT NULL,
  leading_scorer VARCHAR(255),
  leading_scorer_goals INTEGER,
  notes TEXT,
  season VARCHAR(10) DEFAULT '2025-26'
);

-- Create indexes
CREATE INDEX results_date_idx ON results(game_date DESC);
CREATE INDEX results_season_idx ON results(season);

-- Enable Row Level Security
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view results" ON results
  FOR SELECT USING (true);

-- Only authenticated users can manage
CREATE POLICY "Authenticated can manage results" ON results
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 3. PLAYERS TABLE
-- ============================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  jersey_number INTEGER,
  position VARCHAR(50),
  grade INTEGER CHECK (grade >= 9 AND grade <= 12),
  photo_url TEXT,
  bio TEXT,
  season VARCHAR(10) DEFAULT '2025-26',
  is_active BOOLEAN DEFAULT true
);

-- Create indexes
CREATE INDEX players_name_idx ON players(last_name, first_name);
CREATE INDEX players_season_idx ON players(season);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active players
CREATE POLICY "Public can view active players" ON players
  FOR SELECT USING (is_active = true);

-- Only authenticated users can manage
CREATE POLICY "Authenticated can manage players" ON players
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 4. SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

-- Only authenticated users can manage
CREATE POLICY "Authenticated can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('current_season', '2025-26', 'Current season year'),
  ('hero_tagline', 'Built on discipline. Played with pride. Representing Shaler Area with honor on every field.', 'Hero section tagline'),
  ('contact_email', 'ShalerAreaLacrosse@gmail.com', 'Contact email address'),
  ('instagram_url', 'https://www.instagram.com', 'Instagram profile URL'),
  ('facebook_url', '#', 'Facebook profile URL'),
  ('twitter_url', '#', 'Twitter profile URL');

-- ============================================
-- 5. SAMPLE DATA
-- ============================================

-- Insert sample games
INSERT INTO games (date, time, opponent, location, game_type, season) VALUES
  ('2025-03-15', '13:00:00', 'North Allegheny Tigers', 'Titans Field • Season Opener', 'home', '2025-26'),
  ('2025-03-22', '14:00:00', 'Pine-Richland Rams', 'Pine-Richland Stadium', 'away', '2025-26'),
  ('2025-03-29', '13:00:00', 'Fox Chapel Foxes', 'Titans Field', 'home', '2025-26'),
  ('2025-04-05', '12:00:00', 'Seneca Valley Raiders', 'NexTier Stadium', 'away', '2025-26'),
  ('2025-04-12', '13:00:00', 'Hampton Talbots', 'Titans Field • Youth Day', 'home', '2025-26'),
  ('2025-04-19', '14:00:00', 'Peters Township Indians', 'Peters Township HS', 'away', '2025-26'),
  ('2025-04-26', '13:00:00', 'Mt. Lebanon Blue Devils', 'Titans Field', 'home', '2025-26'),
  ('2025-05-03', '15:00:00', 'Upper St. Clair Panthers', 'USC Stadium', 'away', '2025-26');

-- Insert sample result (this will show on the site)
INSERT INTO results (game_date, opponent, titans_score, opponent_score, location, leading_scorer, leading_scorer_goals, season) VALUES
  ('2025-03-15', 'North Allegheny Tigers', 12, 8, 'Titans Field', 'Jake Morrison', 4, '2025-26');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your setup:

-- Check games count
-- SELECT COUNT(*) as total_games FROM games;

-- Check upcoming games
-- SELECT * FROM games WHERE date >= CURRENT_DATE ORDER BY date LIMIT 5;

-- Check latest result
-- SELECT * FROM results ORDER BY game_date DESC LIMIT 1;

-- Check settings
-- SELECT * FROM settings;
