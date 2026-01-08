import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';

export default function Schedule() {
    const { games, loading, error } = useGames(5);

    if (loading) {
        return (
            <section id="schedule" className="py-24 px-12 bg-off-white text-navy relative">
                <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-navy/5 to-transparent" />

                <div className="max-w-7xl mx-auto relative text-center">
                    <h2 className="font-bebas text-6xl tracking-wide leading-none mb-8">
                        <span className="block text-sm text-red tracking-widest mb-2">Upcoming Games</span>
                        SCHEDULE
                    </h2>
                    <p className="text-navy/60">Loading schedule...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="schedule" className="py-24 px-12 bg-off-white text-navy relative">
                <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-navy/5 to-transparent" />

                <div className="max-w-7xl mx-auto relative text-center">
                    <h2 className="font-bebas text-6xl tracking-wide leading-none mb-8">
                        <span className="block text-sm text-red tracking-widest mb-2">Upcoming Games</span>
                        SCHEDULE
                    </h2>
                    <p className="text-red">Error loading schedule: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="schedule" className="py-24 px-12 bg-off-white text-navy relative">
            <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-navy/5 to-transparent" />

            <div className="max-w-7xl mx-auto relative">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="font-bebas text-6xl tracking-wide leading-none">
                        <span className="block text-sm text-red tracking-widest mb-2">Upcoming Games</span>
                        SCHEDULE
                    </h2>
                    <a href="#" className="view-all-link">
                        View Full Schedule
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

                {games.length === 0 ? (
                    <p className="text-center py-12 text-navy/60">No upcoming games scheduled.</p>
                ) : (
                    <div className="grid gap-4">
                        {games.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
