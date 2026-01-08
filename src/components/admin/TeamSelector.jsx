import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';

export default function TeamSelector({ value, onChange, required = false }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const { data, error } = await supabase
                .from('teams')
                .select('id, name')
                .order('name', { ascending: true });

            if (error) throw error;
            setTeams(data || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-navy mb-2">
                Opponent Team {required && '*'}
            </label>

            {loading ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-navy/60">
                    Loading teams...
                </div>
            ) : teams.length === 0 ? (
                <div className="space-y-2">
                    <div className="w-full px-4 py-2 border border-red/30 bg-red/5 rounded-lg text-navy/60">
                        No teams available. Please add teams first.
                    </div>
                    <a
                        href="/admin/teams"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-navy/10 hover:bg-navy/20 text-navy rounded-lg transition-colors text-sm"
                    >
                        <Plus size={16} />
                        Go to Teams Management
                    </a>
                </div>
            ) : (
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red transition-colors text-navy"
                >
                    <option value="">Select a team...</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
