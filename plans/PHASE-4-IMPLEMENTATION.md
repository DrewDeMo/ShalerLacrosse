# Phase 4: Supabase Backend Integration

**Current Status**: ✅ Phase 3 Complete - React + Tailwind deployed at https://shaler-lacrosse.netlify.app/

**Goal**: Add Supabase backend for dynamic content management, authentication, and real-time data updates.

## Prerequisites

Before starting Phase 4, ensure:
- ✅ Phase 3 is complete and deployed
- ✅ React application is running smoothly
- ✅ You have a Supabase account (https://supabase.com)
- ✅ Basic understanding of databases and API concepts

## Phase 4 Overview

This phase will add:
- **Database**: Store games, results, roster, and settings
- **Authentication**: Secure admin access for coaches
- **API**: RESTful endpoints and real-time subscriptions
- **Admin Dashboard**: Manage content without code changes

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: Shaler Lacrosse
   - **Database Password**: (secure password)
   - **Region**: Choose closest to Pennsylvania
4. Click "Create new project" (takes ~2 minutes)

### 1.2 Get Project Credentials

Once created, navigate to **Settings > API**:
- Copy `Project URL` (e.g., https://xxxxx.supabase.co)
- Copy `anon public` API key
- Save these for later use

## Step 2: Install Supabase Client

```bash
# Install Supabase JavaScript client
npm install @supabase/supabase-js

# Install additional utilities
npm install date-fns
```

## Step 3: Create Database Schema

Navigate to **SQL Editor** in Supabase and run these commands:

### 3.1 Games Table

```sql
-- Create games table
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

-- Create index for faster queries
CREATE INDEX games_date_idx ON games(date);
CREATE INDEX games_season_idx ON games(season);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view games" ON games
  FOR SELECT USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated can manage games" ON games
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3.2 Results Table

```sql
-- Create results table
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

-- Create index
CREATE INDEX results_date_idx ON results(game_date DESC);
CREATE INDEX results_season_idx ON results(season);

-- Enable RLS
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view results" ON results
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage results" ON results
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3.3 Players Table

```sql
-- Create players table
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

-- Create index
CREATE INDEX players_name_idx ON players(last_name, first_name);
CREATE INDEX players_season_idx ON players(season);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active players" ON players
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can manage players" ON players
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3.4 Settings Table

```sql
-- Create settings table for site configuration
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('current_season', '2025-26', 'Current season year'),
  ('hero_tagline', 'Built on discipline. Played with pride. Representing Shaler Area with honor on every field.', 'Hero section tagline'),
  ('contact_email', 'ShalerAreaLacrosse@gmail.com', 'Contact email address'),
  ('instagram_url', 'https://www.instagram.com', 'Instagram profile URL'),
  ('facebook_url', '#', 'Facebook profile URL'),
  ('twitter_url', '#', 'Twitter profile URL');

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');
```

## Step 4: Configure Supabase Client

### 4.1 Create Supabase Config

Create [`src/lib/supabase.js`](../src/lib/supabase.js):

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.2 Create Environment Variables

Create [`.env.local`](../.env.local) in project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Add `.env.local` to [`.gitignore`](../.gitignore)

### 4.3 Update .gitignore

```bash
# Environment variables
.env.local
.env.*.local
```

## Step 5: Create Data Hooks

### 5.1 Games Hook

Create [`src/hooks/useGames.js`](../src/hooks/useGames.js):

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useGames(limit = null) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGames();
  }, [limit]);

  async function fetchGames() {
    try {
      setLoading(true);
      let query = supabase
        .from('games')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return { games, loading, error, refetch: fetchGames };
}
```

### 5.2 Results Hook

Create [`src/hooks/useResults.js`](../src/hooks/useResults.js):

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useResults(limit = 1) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [limit]);

  async function fetchResults() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('game_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, refetch: fetchResults };
}
```

## Step 6: Update Components to Use Supabase

### 6.1 Update Schedule Component

Update [`src/components/Schedule.jsx`](../src/components/Schedule.jsx):

```jsx
import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';

export default function Schedule() {
  const { games, loading, error } = useGames(5);

  if (loading) {
    return (
      <section id="schedule" className="py-24 px-12 bg-off-white text-navy relative">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading schedule...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="schedule" className="py-24 px-12 bg-off-white text-navy relative">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red">Error loading schedule: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="schedule" className="py-24 px-12 bg-off-white text-navy relative">
      <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-navy/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-bebas text-6xl tracking-wide leading-none">
            <span className="block text-sm text-red tracking-widest mb-2">Upcoming Games</span>
            SCHEDULE
          </h2>
          <a href="#" className="view-all-link">
            View Full Schedule
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        
        {games.length === 0 ? (
          <p className="text-center py-12">No upcoming games scheduled.</p>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

### 6.2 Update GameCard Component

Update [`src/components/GameCard.jsx`](../src/components/GameCard.jsx):

```jsx
import { format, parseISO } from 'date-fns';

export default function GameCard({ game }) {
  const gameDate = parseISO(game.date);
  const month = format(gameDate, 'MMM');
  const day = format(gameDate, 'd');
  const weekday = format(gameDate, 'EEEE');

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 grid grid-cols-[100px_1fr_auto_auto] items-center gap-8 shadow-lg transition-all duration-300 border border-transparent hover:border-red hover:translate-x-2 hover:shadow-2xl">
      <div className="text-center pr-8 border-r border-gray-200">
        <div className="text-xs uppercase tracking-widest text-red font-semibold">
          {month}
        </div>
        <div className="font-bebas text-5xl leading-none text-navy">
          {day}
        </div>
        <div className="text-sm text-gray-600">
          {weekday}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-1 text-navy">
          {game.game_type === 'home' ? 'vs. ' : '@ '}{game.opponent}
        </h3>
        <p className="text-sm text-gray-600">
          {game.location}
        </p>
      </div>
      
      <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
        game.game_type === 'home' 
          ? 'bg-navy/10 text-navy' 
          : 'bg-red/10 text-red'
      }`}>
        {game.game_type}
      </span>
      
      <div className="font-bebas text-2xl text-navy">
        {game.time}
      </div>
    </div>
  );
}
```

### 6.3 Update Results Component

Update [`src/components/Results.jsx`](../src/components/Results.jsx):

```jsx
import { useResults } from '../hooks/useResults';
import { format, parseISO } from 'date-fns';

export default function Results() {
  const { results, loading, error } = useResults(1);

  if (loading || !results.length) {
    return null; // Or show loading state
  }

  const latestResult = results[0];
  const isWin = latestResult.titans_score > latestResult.opponent_score;

  return (
    <section id="results" className="py-24 px-12 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center font-bebas text-[25vw] text-white/5 select-none pointer-events-none">
        TITANS
      </div>
      
      <div className="max-w-5xl mx-auto relative">
        <div className="mb-8">
          <h2 className="font-bebas text-6xl tracking-wide leading-none">
            <span className="block text-sm text-red tracking-widest mb-2">Latest Update</span>
            RECENT RESULT
          </h2>
        </div>
        
        <div className="bg-gradient-to-br from-red/15 to-navy/50 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red to-transparent" />
          
          <div className="inline-block bg-red text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide mb-6">
            {isWin ? 'Victory' : 'Final Score'}
          </div>
          
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4">
                T
              </div>
              <div className="font-medium mb-1">Shaler Area Titans</div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`font-bebas text-6xl leading-none ${isWin ? 'text-red' : ''}`}>
                {latestResult.titans_score}
              </span>
              <span className="w-5 h-0.5 bg-white/30" />
              <span className={`font-bebas text-6xl leading-none ${!isWin ? 'text-red' : ''}`}>
                {latestResult.opponent_score}
              </span>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4">
                {latestResult.opponent.substring(0, 2).toUpperCase()}
              </div>
              <div className="font-medium mb-1">{latestResult.opponent}</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Date</div>
              <div className="font-semibold">
                {format(parseISO(latestResult.game_date), 'MMMM d, yyyy')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Location</div>
              <div className="font-semibold">{latestResult.location}</div>
            </div>
            {latestResult.leading_scorer && (
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Leading Scorer</div>
                <div className="font-semibold">
                  {latestResult.leading_scorer} – {latestResult.leading_scorer_goals} Goals
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

## Step 7: Configure Netlify Environment Variables

1. Go to Netlify dashboard
2. Navigate to **Site settings > Environment variables**
3. Add variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Step 8: Test Locally

```bash
# Run development server
npm run dev
```

Test:
- [ ] Schedule loads from Supabase
- [ ] Results display correctly
- [ ] Loading states work
- [ ] Error handling works

## Step 9: Deploy

```bash
# Build and commit
npm run build
git add -A
git commit -m "Phase 4: Add Supabase backend integration"
git push
```

## Verification Checklist

After deployment:
- [ ] Database tables created successfully
- [ ] Sample data inserted
- [ ] Schedule component fetches real data
- [ ] Results component displays latest game
- [ ] No console errors
- [ ] Performance is acceptable

## Benefits Achieved

✅ **Dynamic Content**: Update schedule without code changes  
✅ **Real-time Data**: Automatic updates when database changes  
✅ **Scalability**: Easy to add new features (roster, stats, etc.)  
✅ **Authentication Ready**: Foundation for admin dashboard  
✅ **API Access**: RESTful endpoints for future integrations  

## Next Steps (Phase 5)

**Phase 5**: Admin Dashboard
- Build admin interface for coaches
- Add authentication with Supabase Auth
- Create forms for managing games, results, players
- Add image upload for player photos
- Implement user roles and permissions

---

**Current Phase**: Phase 4 - Supabase Backend Integration  
**Next Phase**: Phase 5 - Admin Dashboard
