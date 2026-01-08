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
        if (!confirm('Are you sure you want to delete this team? This will remove team associations from games and results.')) return;

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
                .eq('opponent_team_id', team.id);

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

            {/* Colors Preview */}
            {(team.primary_color || team.secondary_color) && (
                <div className="flex gap-2 mb-4">
                    {team.primary_color && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: team.primary_color }}
                            />
                            <span className="text-xs text-navy/60">Primary</span>
                        </div>
                    )}
                    {team.secondary_color && (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: team.secondary_color }}
                            />
                            <span className="text-xs text-navy/60">Secondary</span>
                        </div>
                    )}
                </div>
            )}

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
