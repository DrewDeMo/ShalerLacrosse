import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';

export default function Schedule() {
    const { games, loading, error } = useGames(5);

    if (loading) {
        return (
            <section id="schedule" className="py-20 md:py-28 px-6 md:px-12 bg-off-white text-navy">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                        <div>
                            <span className="block text-xs font-semibold text-red tracking-[0.2em] uppercase mb-2">
                                Upcoming Games
                            </span>
                            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide text-navy">
                                SCHEDULE
                            </h2>
                        </div>
                    </div>

                    {/* Loading skeleton */}
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl h-24 animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="schedule" className="py-20 md:py-28 px-6 md:px-12 bg-off-white text-navy">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                        <div>
                            <span className="block text-xs font-semibold text-red tracking-[0.2em] uppercase mb-2">
                                Upcoming Games
                            </span>
                            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide text-navy">
                                SCHEDULE
                            </h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-8 text-center">
                        <p className="text-red">Unable to load schedule. Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="schedule" className="py-20 md:py-28 px-6 md:px-12 bg-off-white text-navy">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                    <div>
                        <span className="block text-xs font-semibold text-red tracking-[0.2em] uppercase mb-2">
                            Upcoming Games
                        </span>
                        <h2 className="font-bebas text-5xl md:text-6xl tracking-wide text-navy">
                            SCHEDULE
                        </h2>
                    </div>
                    <a
                        href="#full-schedule"
                        className="inline-flex items-center gap-2 text-red font-semibold text-sm uppercase tracking-wider hover:gap-4 transition-all duration-300 mt-4 md:mt-0 group"
                    >
                        View Full Schedule
                        <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>

                {/* Games List */}
                {games.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <svg
                            className="w-16 h-16 mx-auto text-gray-300 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">No upcoming games scheduled</p>
                        <p className="text-gray-400 text-sm mt-1">Check back soon for updates</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {games.map((game, index) => (
                            <div
                                key={game.id}
                                className="transform transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                <GameCard game={game} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
