import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import TeamSelector from './TeamSelector';

export default function AdminResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingResult, setEditingResult] = useState(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const { data, error } = await supabase
                .from('results')
                .select(`
                    *,
                    opponent:opponent_team_id(id, name, logo_url, primary_color, secondary_color),
                    home:home_team_id(id, name, logo_url, primary_color, secondary_color)
                `)
                .order('game_date', { ascending: false });

            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this result?')) return;

        try {
            const { error } = await supabase.from('results').delete().eq('id', id);
            if (error) throw error;
            fetchResults();
        } catch (error) {
            alert('Error deleting result: ' + error.message);
        }
    };

    const handleEdit = (result) => {
        setEditingResult(result);
        setShowForm(true);
    };

    if (loading) {
        return <div className="text-center py-12">Loading results...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-bebas text-4xl text-navy tracking-wide">
                        MANAGE RESULTS
                    </h2>
                    <p className="text-navy/60 mt-1">
                        Add, edit, or remove game results
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingResult(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-red hover:bg-red/90 text-white font-semibold rounded-xl transition-colors"
                >
                    <Plus size={20} />
                    Add Result
                </button>
            </div>

            {showForm && (
                <ResultForm
                    result={editingResult}
                    onClose={() => {
                        setShowForm(false);
                        setEditingResult(null);
                    }}
                    onSuccess={() => {
                        fetchResults();
                        setShowForm(false);
                        setEditingResult(null);
                    }}
                />
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-navy text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Opponent</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Result</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-navy/60">
                                    No results recorded. Click "Add Result" to create one.
                                </td>
                            </tr>
                        ) : (
                            results.map((result) => {
                                const isWin = result.titans_score > result.opponent_score;
                                return (
                                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-navy">
                                            {format(parseISO(result.game_date), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-navy">
                                            {result.opponent?.name || 'Unknown Team'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-navy">
                                            {result.titans_score} - {result.opponent_score}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${isWin
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red/10 text-red'
                                                    }`}
                                            >
                                                {isWin ? 'Win' : 'Loss'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-navy/70">
                                            {result.location}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(result)}
                                                    className="p-2 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(result.id)}
                                                    className="p-2 text-red/60 hover:text-red hover:bg-red/5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ResultForm({ result, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        game_date: result?.game_date || '',
        opponent_team_id: result?.opponent_team_id || '',
        home_team_id: result?.home_team_id || '',
        titans_score: result?.titans_score || 0,
        opponent_score: result?.opponent_score || 0,
        location: result?.location || '',
        leading_scorer: result?.leading_scorer || '',
        leading_scorer_goals: result?.leading_scorer_goals || 0,
        notes: result?.notes || '',
        season: result?.season || '2025-26',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Auto-populate home team ID from settings
        if (!result) {
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
            // Fetch the opponent team name for the opponent field (for backward compatibility)
            let opponentName = '';
            if (formData.opponent_team_id) {
                const { data: teamData, error: teamError } = await supabase
                    .from('teams')
                    .select('name')
                    .eq('id', formData.opponent_team_id)
                    .single();

                if (teamError) throw teamError;
                opponentName = teamData.name;
            }

            // Convert scores to integers
            const dataToSubmit = {
                ...formData,
                opponent: opponentName, // Set opponent name for backward compatibility
                titans_score: parseInt(formData.titans_score),
                opponent_score: parseInt(formData.opponent_score),
                leading_scorer_goals: formData.leading_scorer_goals
                    ? parseInt(formData.leading_scorer_goals)
                    : null,
            };

            if (result) {
                // Update existing result
                const { error } = await supabase
                    .from('results')
                    .update(dataToSubmit)
                    .eq('id', result.id);
                if (error) throw error;
            } else {
                // Create new result
                const { error } = await supabase.from('results').insert([dataToSubmit]);
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
                        {result ? 'EDIT RESULT' : 'ADD NEW RESULT'}
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
                            Game Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.game_date}
                            onChange={(e) =>
                                setFormData({ ...formData, game_date: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                        />
                    </div>

                    <TeamSelector
                        value={formData.opponent_team_id}
                        onChange={(value) => setFormData({ ...formData, opponent_team_id: value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Titans Score *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.titans_score}
                                onChange={(e) =>
                                    setFormData({ ...formData, titans_score: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Opponent Score *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.opponent_score}
                                onChange={(e) =>
                                    setFormData({ ...formData, opponent_score: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                            />
                        </div>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Leading Scorer (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.leading_scorer}
                                onChange={(e) =>
                                    setFormData({ ...formData, leading_scorer: e.target.value })
                                }
                                placeholder="John Smith"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-navy mb-2">
                                Goals Scored (optional)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.leading_scorer_goals}
                                onChange={(e) =>
                                    setFormData({ ...formData, leading_scorer_goals: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors"
                            />
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
                            placeholder="Game highlights, key moments, etc."
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
                            {loading ? 'Saving...' : result ? 'Update Result' : 'Add Result'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
