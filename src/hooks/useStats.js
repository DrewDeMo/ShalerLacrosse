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
