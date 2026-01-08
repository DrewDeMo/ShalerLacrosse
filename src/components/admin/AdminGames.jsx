import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import TeamSelector from './TeamSelector';

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
                .select(`
                    *,
                    opponent:opponent_team_id(id, name),
                    home:home_team_id(id, name)
                `)
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
                                        {game.opponent?.name || 'Unknown Team'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-navy/70">
                                        {game.location}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${game.game_type === 'home'
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
        opponent_team_id: game?.opponent_team_id || '',
        home_team_id: game?.home_team_id || '',
        location: game?.location || '',
        game_type: game?.game_type || 'home',
        notes: game?.notes || '',
        season: game?.season || '2025-26',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Auto-populate home team ID from settings
        if (!game) {
            fetchHomeTeam();
        }
    }, []);

    const fetchHomeTeam = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'home_team_id')
                .single();

            if (error) throw error;
            if (data?.value) {
                setFormData(prev => ({ ...prev, home_team_id: data.value }));
            }
        } catch (error) {
            console.error('Error fetching home team:', error);
        }
    };

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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                            />
                        </div>
                    </div>

                    <TeamSelector
                        value={formData.opponent_team_id}
                        onChange={(value) => setFormData({ ...formData, opponent_team_id: value })}
                        required
                    />

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
