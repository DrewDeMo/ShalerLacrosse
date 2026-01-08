-- ============================================
-- Add Stadium Column to Teams Table
-- Add Game Type Column to Results Table
-- ============================================

-- Add stadium column to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS stadium TEXT;

-- Optional: Add comment to column for documentation
COMMENT ON COLUMN teams.stadium IS 'Home field/stadium location for the team';

-- Add game_type column to results table
ALTER TABLE results ADD COLUMN IF NOT EXISTS game_type VARCHAR(10) CHECK (game_type IN ('home', 'away'));

-- Optional: Add comment to column for documentation
COMMENT ON COLUMN results.game_type IS 'Game type: home or away';

-- ============================================
-- Sample data update (optional)
-- ============================================
-- Update Shaler Area Titans with their home field
-- UPDATE teams
-- SET stadium = 'Titan Stadium at Shaler Area High School'
-- WHERE name = 'Shaler Area Titans';

-- ============================================
-- Verification
-- ============================================
-- SELECT id, name, stadium FROM teams ORDER BY name;
-- SELECT id, opponent, game_type, location FROM results ORDER BY game_date DESC LIMIT 5;
