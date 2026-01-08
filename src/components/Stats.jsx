import { useStats } from '../hooks/useStats';

export default function Stats() {
    const { stats, loading } = useStats();

    const displayStats = [
        { number: stats.totalGames || '0', label: 'Games Played' },
        { number: stats.wins || '0', label: 'Wins' },
        { number: stats.losses || '0', label: 'Losses' },
        { number: stats.totalGoals || '0', label: 'Total Goals' },
    ];

    if (loading) {
        return (
            <div className="bg-white/5 border-y border-white/10 py-12 px-12">
                <div className="max-w-7xl mx-auto text-center text-white/60">
                    Loading stats...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border-y border-white/10 py-12 px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                {displayStats.map((stat, index) => (
                    <div key={index} className="text-center p-4 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="font-bebas text-6xl text-red leading-none mb-2">
                            {stat.number}
                        </div>
                        <div className="text-xs uppercase tracking-widest text-white/60">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
