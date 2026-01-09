import { useResults } from '../hooks/useResults';
import { format, parseISO } from 'date-fns';
import TeamLogo from './common/TeamLogo';

/**
 * Results Component - Responsive 2025/26 Athletic Design
 * Features: Mobile-first responsive design, consistent logo sizing for any aspect ratio
 */

// Clean SVG Icon Components
const LocationIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const TrophyIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const HomeIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h3v9h6v-6h2v6h6v-9h3L12 2z" />
    </svg>
);

const AwayIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

/**
 * TeamDisplay Component - Handles logo display with consistent sizing
 * Uses fixed square container with max-height/max-width constraints
 * to handle logos of varying aspect ratios
 */
const TeamDisplay = ({ team, score, isWinner, isHome, teamColor, position }) => {
    const isLeft = position === 'left';

    return (
        <div className={`flex flex-col items-center ${isLeft ? 'sm:items-end' : 'sm:items-start'}`}>
            {/* Home/Away Badge */}
            <div className={`mb-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isHome
                ? 'bg-gradient-to-r from-red to-red/80 text-white shadow-lg shadow-red/20'
                : 'bg-white/10 text-white/70 border border-white/20'
                }`}>
                {isHome ? <HomeIcon className="w-3 h-3" /> : <AwayIcon className="w-3 h-3" />}
                <span>{isHome ? 'HOME' : 'AWAY'}</span>
            </div>

            {/* Logo Container - Fixed square with max constraints for consistent alignment */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-2">
                <div className="w-full h-full flex items-center justify-center">
                    <TeamLogo
                        logoUrl={team.logo_url}
                        teamName={team.name}
                        primaryColor={teamColor}
                        size="large"
                    />
                </div>
            </div>

            {/* Team Name */}
            <div className={`font-bebas text-sm sm:text-base md:text-lg lg:text-xl tracking-wide text-center ${isWinner ? 'text-white' : 'text-white/70'
                }`}>
                {team.short_name || team.name}
                {isWinner && (
                    <div className="flex justify-center mt-1">
                        <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Score (visible on mobile stacked layout) */}
            <div className="sm:hidden mt-3">
                <span className={`font-bebas text-4xl ${isWinner ? 'text-emerald-400' : 'text-white/50'
                    }`} style={{
                        textShadow: isWinner ? '0 0 30px rgba(16, 185, 129, 0.5)' : 'none'
                    }}>
                    {score}
                </span>
            </div>
        </div>
    );
};

/**
 * ScoreDisplay Component - Central score display for tablet/desktop
 */
const ScoreDisplay = ({ titansScore, opponentScore, isWin, isTie }) => {
    const winColor = '#10B981';
    const lossColor = '#EF4444';
    const tieColor = '#F59E0B';

    return (
        <div className="hidden sm:flex flex-col items-center justify-center px-4 md:px-8">
            {/* Score Box */}
            <div
                className="flex items-center gap-3 md:gap-6 px-4 md:px-8 py-3 md:py-4 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.05)'
                }}
            >
                {/* Titans Score */}
                <span
                    className={`font-bebas text-4xl md:text-6xl lg:text-7xl ${isWin ? 'text-emerald-400' : (isTie ? 'text-amber-400' : 'text-white')
                        }`}
                    style={{
                        textShadow: isWin ? `0 0 40px ${winColor}60` : 'none',
                        minWidth: '60px',
                        textAlign: 'center'
                    }}
                >
                    {titansScore}
                </span>

                {/* Divider */}
                <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 md:h-6 bg-white/20" />
                    <span className="text-white/40 text-[10px] md:text-xs font-bold tracking-wider">VS</span>
                    <div className="w-px h-4 md:h-6 bg-white/20" />
                </div>

                {/* Opponent Score */}
                <span
                    className={`font-bebas text-4xl md:text-6xl lg:text-7xl ${!isWin && !isTie ? 'text-red-400' : (isTie ? 'text-amber-400' : 'text-white/50')
                        }`}
                    style={{
                        textShadow: !isWin && !isTie ? `0 0 40px ${lossColor}60` : 'none',
                        minWidth: '60px',
                        textAlign: 'center'
                    }}
                >
                    {opponentScore}
                </span>
            </div>

            {/* FINAL Label */}
            <div className="mt-3 bg-white/10 px-4 py-1 rounded-full">
                <span className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase">Final</span>
            </div>
        </div>
    );
};

export default function Results() {
    const { results, loading, error } = useResults(1);

    // Don't render section if loading or no results
    if (loading || !results.length) {
        return null;
    }

    const latestResult = results[0];
    const isWin = latestResult.titans_score > latestResult.opponent_score;
    const isTie = latestResult.titans_score === latestResult.opponent_score;
    const isHomeGame = latestResult.game_type === 'home';

    // Team data
    const titansTeam = latestResult.home || {
        name: 'Shaler Area Titans',
        short_name: 'Titans',
        logo_url: null,
        primary_color: '#ad1d34'
    };

    const opponentTeam = latestResult.opponent || {
        name: latestResult.opponent || 'Opponent',
        short_name: null,
        logo_url: null,
        primary_color: '#666666'
    };

    // Colors
    const titansColor = titansTeam.primary_color || '#ad1d34';
    const opponentColor = opponentTeam.primary_color || '#666666';
    const winColor = '#10B981';
    const lossColor = '#EF4444';
    const tieColor = '#F59E0B';
    const resultColor = isTie ? tieColor : (isWin ? winColor : lossColor);
    const resultText = isTie ? 'TIE' : (isWin ? 'VICTORY' : 'DEFEAT');
    const resultBgClass = isTie ? 'bg-amber-500/20 text-amber-400' : (isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400');

    return (
        <section id="results" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-navy relative overflow-hidden">
            {/* Grass texture background with duotone effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'url(/field_grass_closeup.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2)',
                    opacity: 0.08,
                    mixBlendMode: 'overlay'
                }}
            />
            {/* Navy/Red duotone color overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(6, 22, 73, 0.95) 0%, rgba(173, 29, 52, 0.15) 50%, rgba(6, 22, 73, 0.9) 100%)',
                    mixBlendMode: 'color'
                }}
            />
            {/* Radial vignette */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0, 36, 54, 0.6) 70%, rgba(0, 36, 54, 0.95) 100%)'
                }}
            />

            {/* Background text effect */}
            <div className="absolute inset-0 flex items-center justify-center font-bebas text-[15vw] sm:text-[20vw] text-white/[0.03] select-none pointer-events-none tracking-wider">
                {isWin ? 'VICTORY' : 'TITANS'}
            </div>

            <div className="max-w-5xl mx-auto relative">
                {/* Section Header */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-red to-red/50 rounded-full" />
                        <div className="inline-flex items-center gap-3 bg-red/10 border border-red/20 px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-red tracking-[0.2em] uppercase">Latest Update</span>
                        </div>
                    </div>
                    <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-none text-white">
                        RECENT <span className="text-red">RESULT</span>
                    </h2>
                </div>

                {/* Result Card */}
                <div
                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
                    }}
                >
                    {/* Gradient border */}
                    <div
                        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-50"
                        style={{
                            padding: '1px',
                            background: `linear-gradient(135deg, ${titansColor}40, transparent, ${opponentColor}40)`,
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                        }}
                    />

                    {/* Top accent bar */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                            background: `linear-gradient(90deg, ${resultColor}, ${resultColor}80, transparent 80%)`
                        }}
                    />

                    <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-white/60">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <CalendarIcon />
                                </div>
                                <span className="text-sm font-medium">
                                    {format(parseISO(latestResult.game_date), 'EEE, MMM d, yyyy')}
                                </span>
                            </div>

                            {/* Result Badge */}
                            <div
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${resultBgClass}`}
                                style={{
                                    boxShadow: `0 0 30px ${resultColor}25, inset 0 1px 1px rgba(255,255,255,0.1)`,
                                    border: `1px solid ${resultColor}30`
                                }}
                            >
                                {isWin && <CheckCircleIcon />}
                                {isTie && <span className="text-base">⚖</span>}
                                <span className="font-bebas text-sm tracking-wider">{resultText}</span>
                            </div>
                        </div>

                        {/* Mobile: Stacked Layout with VS divider */}
                        <div className="sm:hidden">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                {/* Titans */}
                                <TeamDisplay
                                    team={titansTeam}
                                    score={latestResult.titans_score}
                                    isWinner={isWin}
                                    isHome={isHomeGame}
                                    teamColor={titansColor}
                                    position="left"
                                />

                                {/* VS Divider */}
                                <div className="flex flex-col items-center">
                                    <div className="w-px h-8 bg-white/20" />
                                    <span className="text-white/30 text-xs font-bold my-2">VS</span>
                                    <div className="w-px h-8 bg-white/20" />
                                </div>

                                {/* Opponent */}
                                <TeamDisplay
                                    team={opponentTeam}
                                    score={latestResult.opponent_score}
                                    isWinner={!isWin && !isTie}
                                    isHome={!isHomeGame}
                                    teamColor={opponentColor}
                                    position="right"
                                />
                            </div>

                            {/* Mobile FINAL Label */}
                            <div className="flex justify-center mt-4">
                                <div className="bg-white/10 px-4 py-1.5 rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase leading-none">Final</span>
                                </div>
                            </div>
                        </div>

                        {/* Tablet/Desktop: Horizontal Layout */}
                        <div className="hidden sm:flex items-center justify-center gap-6 md:gap-8 lg:gap-12">
                            {/* Titans */}
                            <TeamDisplay
                                team={titansTeam}
                                score={latestResult.titans_score}
                                isWinner={isWin}
                                isHome={isHomeGame}
                                teamColor={titansColor}
                                position="left"
                            />

                            {/* Central Score */}
                            <ScoreDisplay
                                titansScore={latestResult.titans_score}
                                opponentScore={latestResult.opponent_score}
                                isWin={isWin}
                                isTie={isTie}
                            />

                            {/* Opponent */}
                            <TeamDisplay
                                team={opponentTeam}
                                score={latestResult.opponent_score}
                                isWinner={!isWin && !isTie}
                                isHome={!isHomeGame}
                                teamColor={opponentColor}
                                position="right"
                            />
                        </div>

                        {/* Game Details Bar */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-6 mt-6 border-t border-white/10">
                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <LocationIcon />
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5">Location</div>
                                    <div className="font-medium text-white text-sm">{latestResult.location}</div>
                                </div>
                            </div>

                            {/* Leading Scorer */}
                            {latestResult.leading_scorer && (
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-amber-500/10">
                                        <StarIcon />
                                    </div>
                                    <div>
                                        <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5">Top Scorer</div>
                                        <div className="font-medium text-white text-sm flex items-center gap-2">
                                            <span>{latestResult.leading_scorer}</span>
                                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                                                {latestResult.leading_scorer_goals}G
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Game Type */}
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <TrophyIcon />
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5">Game Type</div>
                                    <div className="font-medium text-white text-sm capitalize">
                                        {latestResult.season_type || 'Regular Season'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {latestResult.notes && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div
                                    className="flex items-start gap-2 p-3 rounded-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)'
                                    }}
                                >
                                    <div className="p-1.5 rounded-lg bg-white/10 mt-0.5 shrink-0">
                                        <svg className="w-3 h-3 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-white/70 italic leading-relaxed">
                                        {latestResult.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
