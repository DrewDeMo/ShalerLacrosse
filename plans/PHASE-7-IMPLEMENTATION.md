# Phase 7: Teams Management System (Simplified v1)

**Current Status**: ✅ Phase 6 Complete - Roster, Image Uploads, Real Stats, SEO

**Goal**: Create a simple Teams management system in the admin dashboard to store opponent information, logos, and track game history against each team.

## Prerequisites

Before starting Phase 7, ensure:
- ✅ Phase 6 is complete and deployed
- ✅ Admin dashboard is functional
- ✅ Games and results data exists

## Phase 7 Overview

This phase adds:
- **Teams Database**: Store opponent team names, logos, and colors
- **Admin Teams Page**: CRUD interface to manage opponent teams
- **Team Logo Upload**: Upload and display opponent logos
- **Enhanced Game/Result Forms**: Select teams from dropdown instead of typing
- **Team History View**: See win/loss record against each opponent
- **Public Display**: Show opponent logos on schedule and results pages

## Database Schema Updates

### New Table: `teams`

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  short_name TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  conference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (true);

-- Create index
CREATE INDEX idx_teams_name ON teams(name);
```

### Update Existing Tables

```sql
-- Add team_id to games table (optional - can keep opponent text field for flexibility)
ALTER TABLE games ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Add team_id to results table
ALTER TABLE results ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE SET NULL;
```

## Feature 1: Create Storage Bucket for Team Logos

In Supabase Dashboard:
1. Go to **Storage** → **Create bucket**
2. Name: `team-logos`
3. Make it **Public**
4. Add same RLS policies as player-photos bucket

## Feature 2: Admin Teams Management

### 2.1 Create AdminTeams Component

Create `src/components/admin/AdminTeams.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) throw error;
      fetchTeams();
    } catch (error) {
      alert('Error deleting team: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading teams...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-bebas text-4xl text-navy tracking-wide">
            MANAGE TEAMS
          </h2>
          <p className="text-navy/60 mt-1">
            Add opponent teams, logos, and track history
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTeam(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red hover:bg-red/90 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus size={20} />
          Add Team
        </button>
      </div>

      {showForm && (
        <TeamForm
          team={editingTeam}
          onClose={() => {
            setShowForm(false);
            setEditingTeam(null);
          }}
          onSuccess={() => {
            fetchTeams();
            setShowForm(false);
            setEditingTeam(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-navy/60">
            No teams added. Click "Add Team" to create one.
          </div>
        ) : (
          teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => {
                setEditingTeam(team);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(team.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TeamCard({ team, onEdit, onDelete }) {
  const [record, setRecord] = useState({ wins: 0, losses: 0 });

  useEffect(() => {
    fetchTeamRecord();
  }, [team.id]);

  const fetchTeamRecord = async () => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('titans_score, opponent_score')
        .eq('team_id', team.id);

      if (error) throw error;

      const wins = data.filter(r => r.titans_score > r.opponent_score).length;
      const losses = data.length - wins;
      setRecord({ wins, losses });
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* Team Logo */}
      <div className="flex items-center gap-4 mb-4">
        {team.logo_url ? (
          <img
            src={team.logo_url}
            alt={team.name}
            className="w-16 h-16 object-contain rounded-lg bg-gray-50 p-2"
          />
        ) : (
          <div className="w-16 h-16 bg-navy/10 rounded-lg flex items-center justify-center">
            <Shield className="text-navy" size={32} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bebas text-xl text-navy">{team.name}</h3>
          {team.conference && (
            <p className="text-sm text-navy/60">{team.conference}</p>
          )}
        </div>
      </div>

      {/* Record */}
      <div className="mb-4 p-4 bg-navy/5 rounded-lg">
        <p className="text-sm text-navy/60 mb-1">All-Time Record</p>
        <p className="font-bebas text-2xl text-navy">
          {record.wins}W - {record.losses}L
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-navy/10 hover:bg-navy/20 text-navy rounded-lg transition-colors"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red/10 hover:bg-red/20 text-red rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function TeamForm({ team, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    short_name: team?.short_name || '',
    logo_url: team?.logo_url || '',
    primary_color: team?.primary_color || '#000000',
    secondary_color: team?.secondary_color || '#FFFFFF',
    conference: team?.conference || '',
    notes: team?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (team) {
        const { error } = await supabase
          .from('teams')
          .update(formData)
          .eq('id', team.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('teams').insert([formData]);
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
            {team ? 'EDIT TEAM' : 'ADD NEW TEAM'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red/10 border border-red/30 rounded-xl p-4 text-red text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="North Allegheny Tigers"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Short Name (optional)
            </label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
              placeholder="NA Tigers"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
            />
          </div>

          <ImageUpload
            currentImage={formData.logo_url}
            onImageUploaded={(url) => setFormData({ ...formData, logo_url: url || '' })}
            bucketName="team-logos"
            label="Team Logo"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Secondary Color
              </label>
              <input
                type="color"
                value={formData.secondary_color}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Conference (optional)
            </label>
            <input
              type="text"
              value={formData.conference}
              onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
              placeholder="WPIAL 3A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Rivalry game, playoff opponent, etc."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors resize-none text-navy"
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
              className="flex-1 px-6 py-3 bg-red hover:bg-red/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : team ? 'Update Team' : 'Add Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## Feature 3: Update ImageUpload Component

Modify `src/components/admin/ImageUpload.jsx` to accept a bucket name prop so it can be reused for team logos.

## Feature 4: Enhance Game/Result Forms

Update `AdminGames.jsx` and `AdminResults.jsx` to include team selection dropdown that pulls from the teams table.

## Feature 5: Display Team Logos Publicly

Update `Schedule.jsx` and `Results.jsx` to show opponent logos when available.

## Feature 6: Add Teams to Admin Navigation

Update `src/components/admin/AdminLayout.jsx` to include Teams in the navigation.

## Implementation Checklist

- [ ] Create teams table in Supabase
- [ ] Create team-logos storage bucket
- [ ] Add storage policies for team-logos
- [ ] Update ImageUpload to accept bucket name prop
- [ ] Create AdminTeams component with CRUD
- [ ] Add Teams tab to admin navigation
- [ ] Update AdminGames to use team dropdown
- [ ] Update AdminResults to use team dropdown
- [ ] Display team logos on public Schedule page
- [ ] Display team logos on public Results page
- [ ] Test team management workflow
- [ ] Test game/result creation with teams

## Benefits

✅ **Centralized Team Data** - Store all opponent info in one place  
✅ **Visual Recognition** - Team logos make schedule/results more engaging  
✅ **Historical Tracking** - See win/loss record against each opponent  
✅ **Consistency** - No typos in opponent names  
✅ **Easy Management** - Add teams once, use everywhere  
✅ **Simple v1** - No overwhelming features, just what's needed

## Next Phase Ideas

**Phase 8**: Enhanced Features (when ready)
- Team detail pages with full history
- Conference standings
- Photo galleries
- News/blog section

---

**Current Phase**: Phase 7 - Teams Management (Simplified)  
**Status**: Ready to implement
