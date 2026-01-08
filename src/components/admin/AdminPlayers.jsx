import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function AdminPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .order('last_name', { ascending: true });

            if (error) throw error;
            setPlayers(data || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this player?')) return;

        try {
            const { error } = await supabase.from('players').delete().eq('id', id);
            if (error) throw error;
            fetchPlayers();
        } catch (error) {
            alert('Error deleting player: ' + error.message);
        }
    };

    const handleEdit = (player) => {
        setEditingPlayer(player);
        setShowForm(true);
    };

    if (loading) {
        return <div className="text-center py-12">Loading players...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-bebas text-4xl text-navy tracking-wide">
                        MANAGE PLAYERS
                    </h2>
                    <p className="text-navy/60 mt-1">
                        Add, edit, or remove roster players
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingPlayer(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-red hover:bg-red/90 text-white font-semibold rounded-xl transition-colors"
                >
                    <Plus size={20} />
                    Add Player
                </button>
            </div>

            {showForm && (
                <PlayerForm
                    player={editingPlayer}
                    onClose={() => {
                        setShowForm(false);
                        setEditingPlayer(null);
                    }}
                    onSuccess={() => {
                        fetchPlayers();
                        setShowForm(false);
                        setEditingPlayer(null);
                    }}
                />
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-navy text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Jersey #</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Grade</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {players.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-navy/60">
                                    No players in roster. Click "Add Player" to create one.
                                </td>
                            </tr>
                        ) : (
                            players.map((player) => (
                                <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-navy">
                                        {player.first_name} {player.last_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-navy">
                                        {player.jersey_number || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-navy/70">
                                        {player.position || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-navy/70">
                                        {player.grade ? `Grade ${player.grade}` : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${player.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {player.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(player)}
                                                className="p-2 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(player.id)}
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

function PlayerForm({ player, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        first_name: player?.first_name || '',
        last_name: player?.last_name || '',
        jersey_number: player?.jersey_number || '',
        position: player?.position || '',
        grade: player?.grade || '',
        photo_url: player?.photo_url || '',
        bio: player?.bio || '',
        season: player?.season || '2025-26',
        is_active: player?.is_active !== undefined ? player.is_active : true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert numeric fields
            const dataToSubmit = {
                ...formData,
                jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
                grade: formData.grade ? parseInt(formData.grade) : null,
            };

            if (player) {
                // Update existing player
                const { error } = await supabase
                    .from('players')
                    .update(dataToSubmit)
                    .eq('id', player.id);
                if (error) throw error;
            } else {
                // Create new player
                const { error } = await supabase.from('players').insert([dataToSubmit]);
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
                        {player ? 'EDIT PLAYER' : 'ADD NEW PLAYER'}
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
                                First Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.first_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, first_name: e.target.value })
                                }
                                placeholder="John"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.last_name}
                                onChange={(e) =>
                                    setFormData({ ...formData, last_name: e.target.value })
                                }
                                placeholder="Smith"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Jersey Number
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="99"
                                value={formData.jersey_number}
                                onChange={(e) =>
                                    setFormData({ ...formData, jersey_number: e.target.value })
                                }
                                placeholder="10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Grade
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) =>
                                    setFormData({ ...formData, grade: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
                            >
                                <option value="">Select Grade</option>
                                <option value="9">9th Grade</option>
                                <option value="10">10th Grade</option>
                                <option value="11">11th Grade</option>
                                <option value="12">12th Grade</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                            Position
                        </label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) =>
                                setFormData({ ...formData, position: e.target.value })
                            }
                            placeholder="Attack, Midfield, Defense, Goalie"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
                        />
                    </div>

                    <ImageUpload
                        currentImage={formData.photo_url}
                        onImageUploaded={(url) =>
                            setFormData({ ...formData, photo_url: url || '' })
                        }
                    />

                    <div>
                        <label className="block text-sm font-medium text-navy mb-2">
                            Bio (optional)
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) =>
                                setFormData({ ...formData, bio: e.target.value })
                            }
                            placeholder="Player achievements, strengths, etc."
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) =>
                                    setFormData({ ...formData, is_active: e.target.checked })
                                }
                                className="w-4 h-4 text-red border-gray-300 rounded focus:ring-red"
                            />
                            <span className="text-sm font-medium text-navy">
                                Active Player (visible on roster)
                            </span>
                        </label>
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
                            {loading ? 'Saving...' : player ? 'Update Player' : 'Add Player'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
