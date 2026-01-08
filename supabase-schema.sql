-- ============================================
-- Shaler Lacrosse - Supabase Database Schema
-- Phase 7: Teams Management System
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
-- 5. TEAMS TABLE (Phase 7)
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  conference TEXT,
  notes TEXT
);

-- Create index
CREATE INDEX teams_name_idx ON teams(name);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view teams" ON teams
  FOR SELECT USING (true);

-- Only authenticated users can manage
CREATE POLICY "Authenticated can insert teams" ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update teams" ON teams
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete teams" ON teams
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 6. UPDATE EXISTING TABLES WITH TEAM REFERENCES (Phase 7)
-- ============================================

-- Add opponent_team_id to games table (renamed for clarity)
ALTER TABLE games ADD COLUMN opponent_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
CREATE INDEX games_opponent_team_id_idx ON games(opponent_team_id);

-- Add home_team_id to games table
ALTER TABLE games ADD COLUMN home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
CREATE INDEX games_home_team_id_idx ON games(home_team_id);

-- Add opponent_team_id to results table (renamed for clarity)
ALTER TABLE results ADD COLUMN opponent_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
CREATE INDEX results_opponent_team_id_idx ON results(opponent_team_id);

-- Add home_team_id to results table
ALTER TABLE results ADD COLUMN home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
CREATE INDEX results_home_team_id_idx ON results(home_team_id);

-- ============================================
-- 7. SAMPLE DATA
-- ============================================

-- Insert home team first (Shaler Area Titans)
INSERT INTO teams (name, short_name, primary_color, secondary_color, conference) VALUES
  ('Shaler Area Titans', 'Titans', '#C8102E', '#003B5C', 'WPIAL 3A');

-- Insert opponent teams
INSERT INTO teams (name, short_name, primary_color, secondary_color, conference) VALUES
  ('North Allegheny Tigers', 'NA Tigers', '#FFD700', '#000000', 'WPIAL 3A'),
  ('Pine-Richland Rams', 'PR Rams', '#8B0000', '#FFD700', 'WPIAL 3A'),
  ('Fox Chapel Foxes', 'FC Foxes', '#FF6B00', '#000000', 'WPIAL 3A'),
  ('Seneca Valley Raiders', 'SV Raiders', '#CC0000', '#FFFFFF', 'WPIAL 3A'),
  ('Hampton Talbots', 'Hampton', '#003366', '#FFD700', 'WPIAL 3A'),
  ('Peters Township Indians', 'PT Indians', '#8B0000', '#FFD700', 'WPIAL 3A'),
  ('Mt. Lebanon Blue Devils', 'Mt. Lebo', '#003087', '#FFFFFF', 'WPIAL 3A'),
  ('Upper St. Clair Panthers', 'USC Panthers', '#000000', '#FFD700', 'WPIAL 3A');

-- Store home team ID in settings for easy reference
INSERT INTO settings (key, value, description) VALUES
  ('home_team_id', (SELECT id FROM teams WHERE name = 'Shaler Area Titans' LIMIT 1)::text, 'Home team (Shaler Area Titans) ID');

-- Note: After creating teams, you can update existing games and results to reference them
-- Example queries to link existing data:
-- UPDATE games SET opponent_team_id = (SELECT id FROM teams WHERE name = opponent) WHERE opponent IS NOT NULL;
-- UPDATE games SET home_team_id = (SELECT id FROM settings WHERE key = 'home_team_id')::uuid WHERE home_team_id IS NULL;
-- UPDATE results SET opponent_team_id = (SELECT id FROM teams WHERE name = opponent) WHERE opponent IS NOT NULL;
-- UPDATE results SET home_team_id = (SELECT id FROM settings WHERE key = 'home_team_id')::uuid WHERE home_team_id IS NULL;

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
