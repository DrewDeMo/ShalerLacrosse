# Phase 8: Beautiful Team Display on Public Website

**Current Status**: ✅ Phase 7 Complete - Teams Management System with home/opponent team support

**Goal**: Transform public website to beautifully display team logos and colors in Schedule and Results sections with visual matchup displays.

## Prerequisites

Before starting Phase 8, ensure:
- ✅ Phase 7 is complete (Teams management system implemented)
- ✅ Database has `teams` table with home_team_id and opponent_team_id columns
- ✅ Shaler Area Titans added as home team with colors (Red: #C8102E, Navy: #003B5C)
- ✅ Opponent teams added with their logos and colors
- ✅ `team-logos` storage bucket created and configured

## Phase 8 Overview

This phase focuses on:
- **Visual Team Matchups**: Display both team logos in schedule/results
- **Team Color Theming**: Use team colors for accents and borders
- **Professional Design**: Create sports-style matchup cards
- **Responsive Logos**: Optimize for all screen sizes
- **Fallback Handling**: Graceful display when logos are missing

## Database Schema (Phase 7)

### Teams Table
```sql
teams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  conference TEXT,
  notes TEXT
)
```

### Games Table (Updated)
```sql
games (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  opponent_team_id UUID REFERENCES teams(id),  -- NEW
  home_team_id UUID REFERENCES teams(id),      -- NEW
  location TEXT NOT NULL,
  game_type TEXT NOT NULL,
  notes TEXT,
  season TEXT
)
```

### Results Table (Updated)
```sql
results (
  id UUID PRIMARY KEY,
  game_date DATE NOT NULL,
  opponent_team_id UUID REFERENCES teams(id),  -- NEW
  home_team_id UUID REFERENCES teams(id),      -- NEW
  titans_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  location TEXT NOT NULL,
  leading_scorer TEXT,
  leading_scorer_goals INTEGER,
  notes TEXT,
  season TEXT
)
```

## Implementation Checklist

### 1. Update Data Hooks

**File**: `src/hooks/useGames.js`
- [ ] Add join with `home:home_team_id(...)` to fetch home team data
- [ ] Add join with `opponent:opponent_team_id(...)` to fetch opponent team data
- [ ] Include: id, name, logo_url, primary_color, secondary_color

**File**: `src/hooks/useResults.js`
- [ ] Add join with `home:home_team_id(...)` to fetch home team data
- [ ] Add join with `opponent:opponent_team_id(...)` to fetch opponent team data
- [ ] Include: id, name, logo_url, primary_color, secondary_color

### 2. Create Reusable Components

**New File**: `src/components/common/TeamLogo.jsx`
- [ ] Accept props: logoUrl, teamName, size (default, small, large)
- [ ] Display team logo with proper sizing
- [ ] Show fallback with team initials if logo missing
- [ ] Add loading state
- [ ] Make responsive

### 3. Redesign GameCard Component

**File**: `src/components/GameCard.jsx`
- [ ] Create visual matchup layout (Home Logo | VS | Opponent Logo)
- [ ] Display team names below logos
- [ ] Add team color accent borders
- [ ] Show date/time in current format
- [ ] Display location info
- [ ] Add home/away indicator
- [ ] Make fully responsive
- [ ] Handle missing logo fallback

**Design Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  MAR    │  [Titans Logo]    VS    [Opponent Logo]   │ HOME │
│   15    │   Shaler Titans        North Allegheny    │      │
│ Friday  │                                            │ 1:00 │
│         │   Location: Titans Field                   │  PM  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Update Results Component

**File**: `src/components/Results.jsx`
- [ ] Fetch results with team data
- [ ] Create result card with team logos
- [ ] Display scores with team branding
- [ ] Add win/loss color indicators
- [ ] Show team colors in design
- [ ] Handle missing logos

**Design Structure**:
```
┌──────────────────────────────────────────────────────────────┐
│ Mar 15, 2025                                           WIN ✓ │
│                                                               │
│  [Titans Logo]        12  -  8        [Opponent Logo]       │
│  Shaler Titans                        North Allegheny        │
│                                                               │
│  Leading Scorer: Jake Morrison (4 goals)                     │
│  Location: Titans Field                                      │
└──────────────────────────────────────────────────────────────┘
```

### 5. Add Team Color Theming

- [ ] Use home team primary color for left side accents
- [ ] Use opponent team primary color for right side accents
- [ ] Add subtle color gradient backgrounds
- [ ] Ensure colors meet accessibility standards
- [ ] Provide fallback colors when missing

### 6. Responsive Design

- [ ] Desktop: Full logos (80-100px)
- [ ] Tablet: Medium logos (60-80px)
- [ ] Mobile: Small logos (40-60px)
- [ ] Ensure text remains readable at all sizes
- [ ] Test on various screen sizes

### 7. Performance Optimization

- [ ] Add lazy loading for team logo images
- [ ] Use loading="lazy" attribute
- [ ] Provide low-quality placeholders
- [ ] Optimize image sizes in storage
- [ ] Cache team data where possible

## Implementation Example

### TeamLogo Component

```jsx
export default function TeamLogo({ logoUrl, teamName, size = 'default', className = '' }) {
  const sizeClasses = {
    small: 'w-12 h-12',
    default: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const [imageError, setImageError] = useState(false);
  
  if (!logoUrl || imageError) {
    // Fallback: Show team initials
    const initials = teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
      
    return (
      <div className={`${sizeClasses[size]} ${className} bg-navy rounded-full flex items-center justify-center`}>
        <span className="font-bebas text-white text-xl">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${teamName} logo`}
      className={`${sizeClasses[size]} ${className} object-contain`}
      loading="lazy"
      onError={() => setImageError(true)}
    />
  );
}
```

### Updated useGames Hook

```javascript
async function fetchGames() {
  let query = supabase
    .from('games')
    .select(`
      *,
      home:home_team_id(id, name, logo_url, primary_color, secondary_color),
      opponent:opponent_team_id(id, name, logo_url, primary_color, secondary_color)
    `)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  setGames(data || []);
}
```

### Updated GameCard Component

```jsx
export default function GameCard({ game }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
      {/* Date Section */}
      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest text-red font-semibold">
          {format(parseISO(game.date), 'MMM')}
        </div>
        <div className="font-bebas text-5xl leading-none text-navy">
          {format(parseISO(game.date), 'd')}
        </div>
      </div>

      {/* Team Matchup Section */}
      <div className="flex items-center justify-between gap-6 mb-4">
        {/* Home Team */}
        <div className="flex-1 text-center">
          <TeamLogo 
            logoUrl={game.home?.logo_url} 
            teamName={game.home?.name || 'Shaler Titans'}
            size="large"
            className="mx-auto mb-2"
          />
          <p className="font-semibold text-navy text-sm">
            {game.home?.name || 'Shaler Titans'}
          </p>
        </div>

        {/* VS Indicator */}
        <div className="font-bebas text-3xl text-navy/40">VS</div>

        {/* Opponent Team */}
        <div className="flex-1 text-center">
          <TeamLogo 
            logoUrl={game.opponent?.logo_url} 
            teamName={game.opponent?.name || game.opponent}
            size="large"
            className="mx-auto mb-2"
          />
          <p className="font-semibold text-navy text-sm">
            {game.opponent?.name || game.opponent}
          </p>
        </div>
      </div>

      {/* Game Info */}
      <div className="text-center text-sm text-gray-600 space-y-1">
        <p className="font-semibold">{timeFormatted}</p>
        <p>{game.location}</p>
      </div>

      {/* Home/Away Badge */}
      <div className="mt-4 text-center">
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
          game.game_type === 'home' ? 'bg-navy/10 text-navy' : 'bg-red/10 text-red'
        }`}>
          {game.game_type.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
```

## Testing Checklist

- [ ] Test schedule page with team logos displayed
- [ ] Test results page with team logos and scores
- [ ] Verify home team logo displays (Shaler Titans)
- [ ] Verify opponent team logos display correctly
- [ ] Test fallback when logos are missing
- [ ] Test responsive design on mobile
- [ ] Test responsive design on tablet
- [ ] Test responsive design on desktop
- [ ] Verify team colors are used correctly
- [ ] Check image loading performance
- [ ] Verify accessibility (alt tags, color contrast)
- [ ] Test with various team combinations

## Files to Modify

1. `src/hooks/useGames.js` - Add team joins
2. `src/hooks/useResults.js` - Add team joins
3. `src/components/common/TeamLogo.jsx` - NEW: Create component
4. `src/components/GameCard.jsx` - Complete redesign
5. `src/components/Results.jsx` - Add team logo display
6. `src/components/Schedule.jsx` - May need minor updates

## Benefits

✅ **Professional Sports Appearance** - Visual matchups like ESPN/NFL  
✅ **Team Branding** - Showcase all team identities  
✅ **Easy Recognition** - Fans instantly recognize teams by logos  
✅ **Color Coordination** - Team colors create visual hierarchy  
✅ **Scalable Design** - Easy to add more teams

## Next Phase Ideas

**Phase 9**: Advanced Features (when ready)
- Team detail pages with full history
- Head-to-head records visualization
- Animated score reveals
- Live game updates
- Social media integration

---

**Current Phase**: Phase 8 - Beautiful Team Display  
**Status**: Ready to implement
