import { useGames } from '../hooks/useGames';
import GameCard from './GameCard';

export default function Schedule() {
    const { games, loading, error } = useGames(5);

    if (loading) {
        return (
            <section id="schedule" className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden">
                {/* Red-accented background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red via-red to-red-600" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,22,73,0.3),transparent_60%)]" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                        <div>
                            <span className="block text-xs font-semibold text-white/80 tracking-[0.2em] uppercase mb-2">
                                Upcoming Games
                            </span>
                            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide text-white">
                                SCHEDULE
                            </h2>
                        </div>
                    </div>

                    {/* Loading skeleton */}
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white/10 backdrop-blur-sm rounded-xl h-24 animate-pulse border border-white/10"
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
            <section id="schedule" className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden">
                {/* Red-accented background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red via-red to-red-600" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,22,73,0.3),transparent_60%)]" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                        <div>
                            <span className="block text-xs font-semibold text-white/80 tracking-[0.2em] uppercase mb-2">
                                Upcoming Games
                            </span>
                            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide text-white">
                                SCHEDULE
                            </h2>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
                        <p className="text-white/90">Unable to load schedule. Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="schedule" className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden">
            {/* Red-accented background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red via-red to-red-600" />

            {/* Subtle navy overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,22,73,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,22,73,0.2),transparent_50%)]" />

            {/* Decorative pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            />

            {/* Top and bottom decorative lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12">
                    <div>
                        <span className="block text-xs font-semibold text-white/80 tracking-[0.2em] uppercase mb-2">
                            Upcoming Games
                        </span>
                        <h2 className="font-bebas text-5xl md:text-6xl tracking-wide text-white">
                            SCHEDULE
                        </h2>
                    </div>
                    <a
                        href="#full-schedule"
                        className="inline-flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wider hover:gap-4 transition-all duration-300 mt-4 md:mt-0 group"
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
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
                        <svg
                            className="w-16 h-16 mx-auto text-white/40 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-white/90 font-medium">No upcoming games scheduled</p>
                        <p className="text-white/60 text-sm mt-1">Check back soon for updates</p>
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
                                <GameCard game={game} variant="red-section" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
