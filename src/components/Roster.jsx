import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Roster() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, attack, midfield, defense, goalie

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('is_active', true)
                .order('jersey_number', { ascending: true });

            if (error) throw error;
            setPlayers(data || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlayers = filter === 'all'
        ? players
        : players.filter(p => p.position?.toLowerCase().includes(filter.toLowerCase()));

    if (loading) {
        return (
            <section className="py-24 px-12 bg-off-white">
                <div className="max-w-7xl mx-auto text-center">
                    <p>Loading roster...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="roster" className="py-24 px-12 bg-off-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-bebas text-6xl tracking-wide leading-none text-navy">
                        <span className="block text-sm text-red tracking-widest mb-2">Meet the Team</span>
                        ROSTER
                    </h2>
                </div>

                {/* Filter Buttons */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {['all', 'attack', 'midfield', 'defense', 'goalie'].map((pos) => (
                        <button
                            key={pos}
                            onClick={() => setFilter(pos)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${filter === pos
                                    ? 'bg-red text-white'
                                    : 'bg-white text-navy hover:bg-navy/5'
                                }`}
                        >
                            {pos.charAt(0).toUpperCase() + pos.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Player Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlayers.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-navy/60">
                            No players found for this position.
                        </div>
                    ) : (
                        filteredPlayers.map((player) => (
                            <div
                                key={player.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Player Photo */}
                                <div className="aspect-square bg-navy/5 flex items-center justify-center">
                                    {player.photo_url ? (
                                        <img
                                            src={player.photo_url}
                                            alt={`${player.first_name} ${player.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-navy rounded-full flex items-center justify-center">
                                            <span className="font-bebas text-4xl text-white">
                                                {player.first_name[0]}{player.last_name[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Player Info */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bebas text-2xl text-navy tracking-wide">
                                                {player.first_name} {player.last_name}
                                            </h3>
                                            {player.position && (
                                                <p className="text-sm text-navy/60">{player.position}</p>
                                            )}
                                        </div>
                                        {player.jersey_number && (
                                            <div className="w-12 h-12 bg-red rounded-lg flex items-center justify-center">
                                                <span className="font-bebas text-2xl text-white">
                                                    {player.jersey_number}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {player.grade && (
                                        <p className="text-sm text-navy/60 mb-3">Grade {player.grade}</p>
                                    )}

                                    {player.bio && (
                                        <p className="text-sm text-navy/70 line-clamp-3">{player.bio}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
