import { useResults } from '../hooks/useResults';
import { format, parseISO } from 'date-fns';
import TeamLogo from './common/TeamLogo';

/**
 * Results Component - Modern Game Result Display
 * Features: Team logos, dynamic win/loss styling, team color accents
 */
export default function Results() {
    const { results, loading, error } = useResults(1);

    // Don't render section if loading or no results
    if (loading || !results.length) {
        return null;
    }

    const latestResult = results[0];
    const isWin = latestResult.titans_score > latestResult.opponent_score;

    // Determine teams - Titans always on left
    const titansTeam = latestResult.home || {
        name: 'Shaler Area Titans',
        logo_url: null,
        primary_color: '#C8102E',
        secondary_color: '#003B5C'
    };

    const opponentTeam = latestResult.opponent || {
        name: latestResult.opponent || 'Opponent',
        logo_url: null,
        primary_color: '#666666',
        secondary_color: '#999999'
    };

    // Get team colors
    const titansColor = titansTeam.primary_color || '#C8102E';
    const opponentColor = opponentTeam.primary_color || '#666666';
    const winColor = '#10B981'; // Green
    const lossColor = '#EF4444'; // Red

    return (
        <section id="results" className="py-24 px-6 md:px-12 bg-navy relative overflow-hidden">
            {/* Background text effect */}
            <div className="absolute inset-0 flex items-center justify-center font-bebas text-[25vw] text-white/5 select-none pointer-events-none">
                TITANS
            </div>

            <div className="max-w-5xl mx-auto relative">
                {/* Section Header */}
                <div className="mb-8">
                    <h2 className="font-bebas text-5xl md:text-6xl tracking-wide leading-none">
                        <span className="block text-sm text-red tracking-widest mb-2">Latest Update</span>
                        RECENT RESULT
                    </h2>
                </div>

                {/* Result Card */}
                <div
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-6 md:p-12 relative overflow-hidden group hover:border-white/30 transition-all duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${titansColor}10, ${opponentColor}10)`,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Top accent bar with win/loss color */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                            background: `linear-gradient(90deg, ${isWin ? winColor : lossColor}, transparent)`
                        }}
                    />

                    {/* Win/Loss Badge */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="text-white/60 text-sm">
                            {format(parseISO(latestResult.game_date), 'MMMM d, yyyy')}
                        </div>
                        <div
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all duration-300 ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}
                            style={{
                                boxShadow: `0 0 20px ${isWin ? winColor : lossColor}30`
                            }}
                        >
                            {isWin ? (
                                <>
                                    <span className="text-base">✓</span>
                                    <span>VICTORY</span>
                                </>
                            ) : (
                                <>
                                    <span>FINAL</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Team Matchup & Score */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8 mb-8">
                        {/* Shaler Titans (Left) */}
                        <div className="text-center">
                            <TeamLogo
                                logoUrl={titansTeam.logo_url}
                                teamName={titansTeam.name}
                                primaryColor={titansColor}
                                size="large"
                                className="mx-auto mb-4"
                            />
                            <div className="font-medium text-white text-sm md:text-base">
                                {titansTeam.short_name || titansTeam.name || 'Shaler Area Titans'}
                            </div>
                        </div>

                        {/* Score Display */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <span
                                className={`font-bebas text-5xl md:text-6xl leading-none transition-all duration-300 ${isWin ? 'text-green-400' : 'text-white'
                                    }`}
                                style={{
                                    textShadow: isWin ? `0 0 30px ${winColor}50` : 'none'
                                }}
                            >
                                {latestResult.titans_score}
                            </span>
                            <span className="w-4 md:w-5 h-0.5 bg-white/30" />
                            <span
                                className={`font-bebas text-5xl md:text-6xl leading-none transition-all duration-300 ${!isWin ? 'text-red-400' : 'text-white/60'
                                    }`}
                                style={{
                                    textShadow: !isWin ? `0 0 30px ${lossColor}50` : 'none'
                                }}
                            >
                                {latestResult.opponent_score}
                            </span>
                        </div>

                        {/* Opponent (Right) */}
                        <div className="text-center">
                            <TeamLogo
                                logoUrl={opponentTeam.logo_url}
                                teamName={opponentTeam.name}
                                primaryColor={opponentColor}
                                size="large"
                                className="mx-auto mb-4"
                            />
                            <div className="font-medium text-white text-sm md:text-base">
                                {opponentTeam.short_name || opponentTeam.name}
                            </div>
                        </div>
                    </div>

                    {/* Game Details */}
                    <div className="flex justify-center gap-6 md:gap-12 pt-6 md:pt-8 border-t border-white/10 flex-wrap">
                        {/* Location */}
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
                                📍 Location
                            </div>
                            <div className="font-semibold text-white text-sm md:text-base">
                                {latestResult.location}
                            </div>
                        </div>

                        {/* Leading Scorer */}
                        {latestResult.leading_scorer && (
                            <div className="text-center">
                                <div className="text-xs uppercase tracking-widest text-white/50 mb-1">
                                    ⚡ Leading Scorer
                                </div>
                                <div className="font-semibold text-white text-sm md:text-base">
                                    {latestResult.leading_scorer} • {latestResult.leading_scorer_goals} {latestResult.leading_scorer_goals === 1 ? 'Goal' : 'Goals'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes if any */}
                    {latestResult.notes && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-sm text-white/70 text-center italic">
                                {latestResult.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
