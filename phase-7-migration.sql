-- ============================================
-- Phase 7: Teams Management Migration
-- Run this SQL in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
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
CREATE INDEX IF NOT EXISTS teams_name_idx ON teams(name);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view teams" ON teams;
DROP POLICY IF EXISTS "Authenticated can insert teams" ON teams;
DROP POLICY IF EXISTS "Authenticated can update teams" ON teams;
DROP POLICY IF EXISTS "Authenticated can delete teams" ON teams;

-- Create policies
CREATE POLICY "Public can view teams" ON teams
  FOR SELECT USING (true);

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
-- 2. ADD TEAM REFERENCES TO EXISTING TABLES
-- ============================================

-- Add opponent_team_id to games table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='games' AND column_name='opponent_team_id'
  ) THEN
    ALTER TABLE games ADD COLUMN opponent_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
    CREATE INDEX games_opponent_team_id_idx ON games(opponent_team_id);
  END IF;
END $$;

-- Add home_team_id to games table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='games' AND column_name='home_team_id'
  ) THEN
    ALTER TABLE games ADD COLUMN home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
    CREATE INDEX games_home_team_id_idx ON games(home_team_id);
  END IF;
END $$;

-- Add opponent_team_id to results table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='results' AND column_name='opponent_team_id'
  ) THEN
    ALTER TABLE results ADD COLUMN opponent_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
    CREATE INDEX results_opponent_team_id_idx ON results(opponent_team_id);
  END IF;
END $$;

-- Add home_team_id to results table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='results' AND column_name='home_team_id'
  ) THEN
    ALTER TABLE results ADD COLUMN home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
    CREATE INDEX results_home_team_id_idx ON results(home_team_id);
  END IF;
END $$;

-- ============================================
-- 3. INSERT SAMPLE TEAMS
-- ============================================

-- Insert home team first (Shaler Area Titans)
INSERT INTO teams (name, short_name, primary_color, secondary_color, conference) 
VALUES ('Shaler Area Titans', 'Titans', '#C8102E', '#003B5C', 'WPIAL 3A')
ON CONFLICT (name) DO NOTHING;

-- Insert opponent teams
INSERT INTO teams (name, short_name, primary_color, secondary_color, conference) VALUES
  ('North Allegheny Tigers', 'NA Tigers', '#FFD700', '#000000', 'WPIAL 3A'),
  ('Pine-Richland Rams', 'PR Rams', '#8B0000', '#FFD700', 'WPIAL 3A'),
  ('Fox Chapel Foxes', 'FC Foxes', '#FF6B00', '#000000', 'WPIAL 3A'),
  ('Seneca Valley Raiders', 'SV Raiders', '#CC0000', '#FFFFFF', 'WPIAL 3A'),
  ('Hampton Talbots', 'Hampton', '#003366', '#FFD700', 'WPIAL 3A'),
  ('Peters Township Indians', 'PT Indians', '#8B0000', '#FFD700', 'WPIAL 3A'),
  ('Mt. Lebanon Blue Devils', 'Mt. Lebo', '#003087', '#FFFFFF', 'WPIAL 3A'),
  ('Upper St. Clair Panthers', 'USC Panthers', '#000000', '#FFD700', 'WPIAL 3A')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 4. UPDATE SETTINGS WITH HOME TEAM
-- ============================================

-- Store home team ID in settings
INSERT INTO settings (key, value, description) VALUES
  ('home_team_id', (SELECT id FROM teams WHERE name = 'Shaler Area Titans' LIMIT 1)::text, 'Home team (Shaler Area Titans) ID')
ON CONFLICT (key) DO UPDATE SET
  value = (SELECT id FROM teams WHERE name = 'Shaler Area Titans' LIMIT 1)::text,
  description = 'Home team (Shaler Area Titans) ID';

-- ============================================
-- 5. VERIFICATION QUERIES (OPTIONAL)
-- ============================================

-- Check if teams were created successfully
-- SELECT * FROM teams ORDER BY name;

-- Check if columns were added
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'games' AND column_name LIKE '%team%';

-- Check settings
-- SELECT * FROM settings WHERE key = 'home_team_id';
