# Phase 5: Admin Dashboard

**Current Status**: ✅ Phase 4 Complete - Dynamic content from Supabase backend

**Goal**: Build a secure admin dashboard for coaches to manage games, results, and roster without touching code.

## Prerequisites

Before starting Phase 5, ensure:
- ✅ Phase 4 is complete and deployed
- ✅ Supabase database is set up with all tables
- ✅ Site is loading data from Supabase successfully
- ✅ You have access to your Supabase project dashboard

## Phase 5 Overview

This phase adds:
- **Authentication**: Secure login for coaches using Supabase Auth
- **Protected Routes**: Admin-only pages that require login
- **CRUD Forms**: Add, edit, delete games, results, and players
- **Image Upload**: Player photos stored in Supabase Storage
- **Admin UI**: Clean, intuitive interface for content management

## Architecture

```
┌─────────────────────────────────────────┐
│         Public Site (Existing)          │
│  - Home, Schedule, Results sections     │
│  - Anyone can view                      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      /admin - Protected Dashboard       │
│  ┌───────────────────────────────────┐  │
│  │  Supabase Auth (Email/Password)   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─────────┬──────────┬──────────────┐ │
│  │ Games   │ Results  │   Players    │ │
│  │ Manager │ Manager  │   Roster     │ │
│  └─────────┴──────────┴──────────────┘ │
└─────────────────────────────────────────┘
```

## Step 1: Install Additional Dependencies

```bash
# React Router for navigation
npm install react-router-dom

# React Hook Form for form management
npm install react-hook-form

# Icons
npm install lucide-react
```

## Step 2: Set Up Supabase Authentication

### 2.1 Enable Email Auth in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Navigate to **Settings** → **Authentication**
4. Configure:
   - Site URL: `https://shaler-lacrosse.netlify.app`
   - Redirect URLs: Add `http://localhost:5173/admin`, `https://shaler-lacrosse.netlify.app/admin`

### 2.2 Create Admin User

Run this SQL in Supabase SQL Editor:

```sql
-- Create your admin user (you'll use this email to login)
-- Note: User will need to confirm email before logging in
-- You can disable email confirmation in Auth settings for development
```

Or use Supabase Dashboard:
1. **Authentication** → **Users** → **Add user**
2. Enter email: `your-email@example.com`
3. Set password
4. Click **Create user**

## Step 3: Create Authentication Context

Create [`src/contexts/AuthContext.jsx`](../src/contexts/AuthContext.jsx):

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

## Step 4: Set Up React Router

Update [`src/main.jsx`](../src/main.jsx):

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
```

Update [`src/App.jsx`](../src/App.jsx):

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Schedule from './components/Schedule';
import Results from './components/Results';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminGames from './components/admin/AdminGames';
import AdminResults from './components/admin/AdminResults';
import AdminPlayers from './components/admin/AdminPlayers';
import ProtectedRoute from './components/admin/ProtectedRoute';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <Schedule />
      <Results />
      <CTA />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      
      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/games" replace />} />
        <Route path="games" element={<AdminGames />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="players" element={<AdminPlayers />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
```

## Step 5: Create Admin Components

### 5.1 Protected Route Component

Create [`src/components/admin/ProtectedRoute.jsx`](../src/components/admin/ProtectedRoute.jsx):

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
```

### 5.2 Admin Login Page

Create [`src/components/admin/AdminLogin.jsx`](../src/components/admin/AdminLogin.jsx):

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="font-bebas text-3xl text-white">T</span>
          </div>
          <h1 className="font-bebas text-4xl text-white tracking-wide">
            ADMIN LOGIN
          </h1>
          <p className="text-white/60 mt-2">Shaler Area Titans Lacrosse</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red/10 border border-red/30 rounded-xl p-4 text-red text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red transition-colors"
                placeholder="coach@example.com"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red hover:bg-red/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={20} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5.3 Admin Layout

Create [`src/components/admin/AdminLayout.jsx`](../src/components/admin/AdminLayout.jsx):

```jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Trophy, Users, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/games', icon: Calendar, label: 'Games' },
    { to: '/admin/results', icon: Trophy, label: 'Results' },
    { to: '/admin/players', icon: Users, label: 'Players' },
  ];

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red rounded-xl flex items-center justify-center">
                <span className="font-bebas text-2xl text-white">T</span>
              </div>
              <div>
                <h1 className="font-bebas text-2xl text-white tracking-wide">
                  TITANS ADMIN
                </h1>
                <p className="text-white/60 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                View Site →
              </a>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                    isActive
                      ? 'border-red text-navy'
                      : 'border-transparent text-navy/60 hover:text-navy'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

### 5.4 Games Manager

Create [`src/components/admin/AdminGames.jsx`](../src/components/admin/AdminGames.jsx):

```jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const { error } = await supabase.from('games').delete().eq('id', id);
      if (error) throw error;
      fetchGames();
    } catch (error) {
      alert('Error deleting game: ' + error.message);
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading games...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-bebas text-4xl text-navy tracking-wide">
            MANAGE GAMES
          </h2>
          <p className="text-navy/60 mt-1">
            Add, edit, or remove scheduled games
          </p>
        </div>
        <button
          onClick={() => {
            setEditingGame(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red hover:bg-red/90 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus size={20} />
          Add Game
        </button>
      </div>

      {showForm && (
        <GameForm
          game={editingGame}
          onClose={() => {
            setShowForm(false);
            setEditingGame(null);
          }}
          onSuccess={() => {
            fetchGames();
            setShowForm(false);
            setEditingGame(null);
          }}
        />
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Opponent</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {games.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-navy/60">
                  No games scheduled. Click "Add Game" to create one.
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-navy">
                    {format(parseISO(game.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-navy">
                    {game.opponent}
                  </td>
                  <td className="px-6 py-4 text-sm text-navy/70">
                    {game.location}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        game.game_type === 'home'
                          ? 'bg-navy/10 text-navy'
                          : 'bg-red/10 text-red'
                      }`}
                    >
                      {game.game_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-navy/70">{game.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(game)}
                        className="p-2 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="p-2 text-red/60 hover:text-red hover:bg-red/5 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GameForm({ game, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    date: game?.date || '',
    time: game?.time || '',
    opponent: game?.opponent || '',
    location: game?.location || '',
    game_type: game?.game_type || 'home',
    notes: game?.notes || '',
    season: game?.season || '2025-26',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (game) {
        // Update existing game
        const { error } = await supabase
          .from('games')
          .update(formData)
          .eq('id', game.id);
        if (error) throw error;
      } else {
        // Create new game
        const { error } = await supabase.from('games').insert([formData]);
        if (error) throw error;
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bebas text-3xl text-navy tracking-wide">
            {game ? 'EDIT GAME' : 'ADD NEW GAME'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red/10 border border-red/30 rounded-xl p-4 text-red text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Opponent *
            </label>
            <input
              type="text"
              required
              value={formData.opponent}
              onChange={(e) =>
                setFormData({ ...formData, opponent: e.target.value })
              }
              placeholder="North Allegheny Tigers"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Titans Field"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Game Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="home"
                  checked={formData.game_type === 'home'}
                  onChange={(e) =>
                    setFormData({ ...formData, game_type: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-navy">Home</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="away"
                  checked={formData.game_type === 'away'}
                  onChange={(e) =>
                    setFormData({ ...formData, game_type: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-navy">Away</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Season opener, youth day, etc."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-navy font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-red hover:bg-red/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : game ? 'Update Game' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 5.5 Results Manager (Similar pattern)

Create [`src/components/admin/AdminResults.jsx`](../src/components/admin/AdminResults.jsx) - similar structure to AdminGames but for results.

### 5.6 Players Manager (Similar pattern)

Create [`src/components/admin/AdminPlayers.jsx`](../src/components/admin/AdminPlayers.jsx) - similar structure to AdminGames but for roster.

## Step 6: Update Header Navigation

Update [`src/components/Header.jsx`](../src/components/Header.jsx) to detect admin routes:

```jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Don't show header on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // ... rest of existing header code
}
```

## Step 7: Test Locally

```bash
npm run dev
```

Test flow:
1. Visit http://localhost:5173 - public site works
2. Visit http://localhost:5173/admin - redirects to login
3. Login with your admin credentials
4. Access /admin/games, /admin/results, /admin/players
5. Test CRUD operations

## Step 8: Deploy

```bash
npm run build
git add -A
git commit -m "Phase 5: Add admin dashboard with authentication and CRUD"
git push
```

## Benefits Achieved

✅ **Secure Authentication** - Only authorized coaches can access admin  
✅ **No Code Updates Needed** - Manage all content through UI  
✅ **Real-time Updates** - Changes reflect immediately on public site  
✅ **Protected Data** - RLS policies prevent unauthorized changes  
✅ **User-Friendly** - Clean, intuitive interface  

## Next Phase Ideas

**Phase 6**: Advanced Features
- Team stats and analytics dashboard
- Player statistics tracking
- Photo galleries
- News/blog section
- Season archives
- Mobile app with React Native

---

**Current Phase**: Phase 5 - Admin Dashboard  
**Status**: Ready to implement
