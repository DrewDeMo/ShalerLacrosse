# Phase 6: Advanced Features & Enhancements

**Current Status**: ✅ Phase 5 Complete - Admin Dashboard with full CRUD operations

**Goal**: Add advanced features like roster page, enhanced UI/UX, stats tracking, and production optimizations.

## Prerequisites

Before starting Phase 6, ensure:
- ✅ Phase 5 is complete and deployed
- ✅ Admin dashboard is working and tested
- ✅ You can login and manage games, results, and players
- ✅ Database has some sample data

## Phase 6 Overview

This phase focuses on:
- **Public Roster Page**: Display team roster with player cards
- **Enhanced Schedule/Results**: Better filtering and search
- **Stats Dashboard**: Track team and player statistics
- **Image Upload**: Add Supabase Storage for player photos
- **SEO & Performance**: Meta tags, sitemap, analytics
- **Polish & UX**: Loading states, animations, error handling

## Feature 1: Public Roster Page

### 1.1 Create Roster Component

Create [`src/components/Roster.jsx`](../src/components/Roster.jsx):

```jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Roster() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, attack, midfield, defense, goalie

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('is_active', true)
        .order('jersey_number', { ascending: true });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = filter === 'all' 
    ? players 
    : players.filter(p => p.position?.toLowerCase().includes(filter.toLowerCase()));

  if (loading) {
    return (
      <section className="py-24 px-12 bg-off-white">
        <div className="max-w-7xl mx-auto text-center">
          <p>Loading roster...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="roster" className="py-24 px-12 bg-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bebas text-6xl tracking-wide leading-none text-navy">
            <span className="block text-sm text-red tracking-widest mb-2">Meet the Team</span>
            ROSTER
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {['all', 'attack', 'midfield', 'defense', 'goalie'].map((pos) => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === pos
                  ? 'bg-red text-white'
                  : 'bg-white text-navy hover:bg-navy/5'
              }`}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-navy/60">
              No players found for this position.
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Player Photo */}
                <div className="aspect-square bg-navy/5 flex items-center justify-center">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={`${player.first_name} ${player.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-navy rounded-full flex items-center justify-center">
                      <span className="font-bebas text-4xl text-white">
                        {player.first_name[0]}{player.last_name[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bebas text-2xl text-navy tracking-wide">
                        {player.first_name} {player.last_name}
                      </h3>
                      {player.position && (
                        <p className="text-sm text-navy/60">{player.position}</p>
                      )}
                    </div>
                    {player.jersey_number && (
                      <div className="w-12 h-12 bg-red rounded-lg flex items-center justify-center">
                        <span className="font-bebas text-2xl text-white">
                          {player.jersey_number}
                        </span>
                      </div>
                    )}
                  </div>

                  {player.grade && (
                    <p className="text-sm text-navy/60 mb-3">Grade {player.grade}</p>
                  )}

                  {player.bio && (
                    <p className="text-sm text-navy/70 line-clamp-3">{player.bio}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
```

### 1.2 Add Roster to HomePage

Update [`src/App.jsx`](../src/App.jsx) to include Roster:

```jsx
import Roster from './components/Roster';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <Schedule />
      <Results />
      <Roster />  {/* Add this */}
      <CTA />
      <Footer />
    </>
  );
}
```

## Feature 2: Supabase Storage for Images

### 2.1 Create Storage Bucket

In Supabase Dashboard:
1. Go to **Storage** → **Create bucket**
2. Name: `player-photos`
3. Make it **Public**

### 2.2 Create Image Upload Component

Create [`src/components/admin/ImageUpload.jsx`](../src/components/admin/ImageUpload.jsx):

```jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ currentImage, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setPreview(publicUrl);
      onImageUploaded(publicUrl);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">
        Player Photo
      </label>
      
      {preview ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red text-white rounded-full hover:bg-red/90"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload photo'}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
```

### 2.3 Integrate into AdminPlayers

Update [`src/components/admin/AdminPlayers.jsx`](../src/components/admin/AdminPlayers.jsx) PlayerForm to use ImageUpload.

## Feature 3: Enhanced Stats Component

### 3.1 Create Stats Hook

Create [`src/hooks/useStats.js`](../src/hooks/useStats.js):

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStats() {
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    totalGoals: 0,
    goalsAgainst: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('game_date', { ascending: false });

      if (error) throw error;

      const totalGames = data.length;
      const wins = data.filter(r => r.titans_score > r.opponent_score).length;
      const losses = totalGames - wins;
      const totalGoals = data.reduce((sum, r) => sum + r.titans_score, 0);
      const goalsAgainst = data.reduce((sum, r) => sum + r.opponent_score, 0);

      setStats({ totalGames, wins, losses, totalGoals, goalsAgainst });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return { stats, loading };
}
```

### 3.2 Update Stats Component

Update [`src/components/Stats.jsx`](../src/components/Stats.jsx) to use real data from useStats hook.

## Feature 4: SEO & Meta Tags

### 4.1 Install React Helmet

```bash
npm install react-helmet-async
```

### 4.2 Add Meta Tags

Update [`index.html`](../index.html):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Shaler Area Titans Lacrosse - High school boys lacrosse team representing Shaler Area. Check our schedule, results, and roster." />
    <meta name="keywords" content="Shaler Area, Titans, Lacrosse, High School Sports, Pennsylvania Lacrosse" />
    <meta name="author" content="Shaler Area Titans Lacrosse" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Shaler Area Titans Lacrosse" />
    <meta property="og:description" content="Built on discipline. Played with pride. Representing Shaler Area with honor on every field." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://shaler-lacrosse.netlify.app/" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Shaler Area Titans Lacrosse" />
    <meta name="twitter:description" content="Built on discipline. Played with pride." />
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <title>Shaler Area Titans Lacrosse</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Feature 5: Loading States & Error Boundaries

### 5.1 Create Loading Component

Create [`src/components/common/Loading.jsx`](../src/components/common/Loading.jsx):

```jsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red"></div>
    </div>
  );
}
```

### 5.2 Create Error Boundary

Create [`src/components/common/ErrorBoundary.jsx`](../src/components/common/ErrorBoundary.jsx) for production error handling.

## Feature 6: Analytics & Monitoring

### 6.1 Google Analytics (Optional)

Add Google Analytics to [`index.html`](../index.html) if desired.

### 6.2 Supabase Realtime (Optional)

Enable realtime subscriptions for live updates when data changes.

## Feature 7: Mobile Optimization

### 7.1 Responsive Improvements
- Test all pages on mobile devices
- Improve touch targets
- Optimize images for mobile

### 7.2 PWA Support (Optional)
- Add service worker
- Create manifest.json
- Enable offline support

## Implementation Priority

**High Priority:**
1. Public Roster Page
2. Image Upload for Players
3. Real Stats from Database
4. SEO Meta Tags

**Medium Priority:**
5. Enhanced Loading States
6. Error Boundaries
7. Mobile Optimization

**Low Priority:**
8. PWA Support
9. Analytics Integration
10. Realtime Updates

## Next Steps After Phase 6

**Phase 7**: Advanced Analytics
- Player statistics tracking
- Season comparisons
- Performance graphs

**Phase 8**: Community Features
- Fan comments
- Photo galleries
- News/blog section

---

**Current Phase**: Phase 6 - Advanced Features  
**Status**: Ready to implement

**Note**: Phase 5 admin dashboard is complete and deployed. You can now enhance the public-facing features and add polish to the application.
