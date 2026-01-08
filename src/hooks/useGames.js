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
            setError(null);

            let query = supabase
                .from('games')
                .select(`
                    *,
                    home:home_team_id(id, name, short_name, logo_url, primary_color, secondary_color),
                    opponent:opponent_team_id(id, name, short_name, logo_url, primary_color, secondary_color)
                `)
                .gte('date', new Date().toISOString().split('T')[0])
                .order('date', { ascending: true });

            if (limit) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error) throw error;
            setGames(data || []);
        } catch (error) {
            console.error('Error fetching games:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { games, loading, error, refetch: fetchGames };
}
