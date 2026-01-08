import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useResults(limit = 1) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, [limit]);

    async function fetchResults() {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('results')
                .select('*')
                .order('game_date', { ascending: false })
                .limit(limit);

            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { results, loading, error, refetch: fetchResults };
}
