import { useResults } from '../hooks/useResults';
import { format, parseISO } from 'date-fns';
import TeamLogo from './common/TeamLogo';

/**
 * Results Component - Premium 2025/26 Athletic Design
 * Features: Clean SVG icons, Home/Away visual indicators, Modern athletic styling
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

const HomeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 12h3v9h6v-6h2v6h6v-9h3L12 2z" />
    </svg>
);

const AwayIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function Results() {
    const { results, loading, error } = useResults(1);

    // Don't render section if loading or no results
    if (loading || !results.length) {
        return null;
    }

    const latestResult = results[0];
    const isWin = latestResult.titans_score > latestResult.opponent_score;
    const isTie = latestResult.titans_score === latestResult.opponent_score;

    // Determine which team is home/away
    const isHomeGame = latestResult.game_type === 'home';

    // Determine teams - Titans always on left
    const titansTeam = latestResult.home || {
        name: 'Shaler Area Titans',
        logo_url: null,
        primary_color: '#ad1d34',
        secondary_color: '#061649'
    };

    const opponentTeam = latestResult.opponent || {
        name: latestResult.opponent || 'Opponent',
        logo_url: null,
        primary_color: '#666666',
        secondary_color: '#999999'
    };

    // Get team colors
    const titansColor = titansTeam.primary_color || '#ad1d34';
    const opponentColor = opponentTeam.primary_color || '#666666';
    const winColor = '#10B981';
    const lossColor = '#EF4444';
    const tieColor = '#F59E0B';

    const resultColor = isTie ? tieColor : (isWin ? winColor : lossColor);
    const resultText = isTie ? 'TIE' : (isWin ? 'VICTORY' : 'DEFEAT');
    const resultBgClass = isTie ? 'bg-amber-500/20 text-amber-400' : (isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400');

    return (
        <section id="results" className="py-20 lg:py-24 px-6 lg:px-12 bg-navy relative overflow-hidden">
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
            {/* Navy/Red duotone color overlay for grass */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(6, 22, 73, 0.95) 0%, rgba(173, 29, 52, 0.15) 50%, rgba(6, 22, 73, 0.9) 100%)',
                    mixBlendMode: 'color'
                }}
            />
            {/* Radial vignette to fade edges and focus center */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0, 36, 54, 0.6) 70%, rgba(0, 36, 54, 0.95) 100%)'
                }}
            />

            {/* Dynamic background text effect */}
            <div className="absolute inset-0 flex items-center justify-center font-bebas text-[20vw] text-white/[0.03] select-none pointer-events-none tracking-wider">
                {isWin ? 'VICTORY' : 'TITANS'}
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Section Header with athletic styling */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-red to-red/50 rounded-full" />
                        <div className="inline-flex items-center gap-3 bg-red/10 border border-red/20 px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-red tracking-[0.2em] uppercase">Latest Update</span>
                        </div>
                    </div>
                    <h2 className="font-bebas text-5xl lg:text-6xl tracking-wide leading-none text-white">
                        RECENT <span className="text-red">RESULT</span>
                    </h2>
                </div>

                {/* Premium Result Card */}
                <div
                    className="relative rounded-3xl overflow-hidden group"
                    style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
                    }}
                >
                    {/* Animated gradient border */}
                    <div
                        className="absolute inset-0 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            padding: '1px',
                            background: `linear-gradient(135deg, ${titansColor}40, transparent, ${opponentColor}40)`,
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                        }}
                    />

                    {/* Top accent bar with result color */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1.5"
                        style={{
                            background: `linear-gradient(90deg, ${resultColor}, ${resultColor}80, transparent 80%)`
                        }}
                    />

                    <div className="p-6 md:p-10 lg:p-12">
                        {/* Header Row: Date + Result Badge */}
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            {/* Date with clean icon */}
                            <div className="flex items-center gap-3 text-white/60">
                                <div className="p-2 rounded-lg bg-white/5">
                                    <CalendarIcon />
                                </div>
                                <span className="text-sm font-medium tracking-wide">
                                    {format(parseISO(latestResult.game_date), 'EEEE, MMMM d, yyyy')}
                                </span>
                            </div>

                            {/* Result Badge - Premium design */}
                            <div
                                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 ${resultBgClass}`}
                                style={{
                                    boxShadow: `0 0 30px ${resultColor}25, inset 0 1px 1px rgba(255,255,255,0.1)`,
                                    border: `1px solid ${resultColor}30`
                                }}
                            >
                                {isWin && <CheckCircleIcon />}
                                {isTie && <span className="text-lg">⚖</span>}
                                <span className="font-bebas text-base tracking-wider">{resultText}</span>
                            </div>
                        </div>

                        {/* Team Matchup & Score - Premium Layout */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6 lg:gap-10 mb-10">
                            {/* Shaler Titans (Left) */}
                            <div className="text-center relative group/titans cursor-default">
                                {/* Home/Away Badge for Titans - Enhanced with icon animation */}
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 z-10 transition-all duration-300 group-hover/titans:scale-105 ${isHomeGame
                                    ? 'bg-gradient-to-r from-red via-red to-red/80 text-white shadow-lg shadow-red/20'
                                    : 'bg-white/10 text-white/70 border border-white/10 hover:bg-white/15'
                                    }`}>
                                    {isHomeGame ? (
                                        <>
                                            <HomeIcon />
                                            <span>HOME</span>
                                        </>
                                    ) : (
                                        <>
                                            <AwayIcon />
                                            <span>AWAY</span>
                                        </>
                                    )}
                                </div>

                                {/* Interactive Team Card */}
                                <div
                                    className="relative mx-auto pt-8 pb-4 px-4 rounded-2xl transition-all duration-300 group-hover/titans:bg-white/5"
                                    style={{
                                        filter: isWin ? `drop-shadow(0 0 25px ${winColor}30)` : 'none'
                                    }}
                                >
                                    {/* Win indicator glow ring */}
                                    {isWin && (
                                        <div
                                            className="absolute inset-0 rounded-2xl animate-pulse"
                                            style={{
                                                background: `radial-gradient(circle at center, ${winColor}10, transparent 70%)`,
                                                animation: 'pulse 2s ease-in-out infinite'
                                            }}
                                        />
                                    )}

                                    <TeamLogo
                                        logoUrl={titansTeam.logo_url}
                                        teamName={titansTeam.name}
                                        primaryColor={titansColor}
                                        size="large"
                                        className="mx-auto mb-3"
                                    />

                                    {/* Team Name with winner badge */}
                                    <div className={`font-bebas text-lg md:text-xl tracking-wide transition-colors duration-300 ${isWin ? 'text-white' : 'text-white/80'}`}>
                                        {titansTeam.short_name || 'Titans'}
                                        {isWin && (
                                            <span className="ml-2 inline-flex items-center">
                                                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Score Display - Premium Athletic Style */}
                            <div className="flex flex-col items-center">
                                {/* Score container with athletic diamond shape hint */}
                                <div
                                    className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6 px-4 md:px-6 py-4 rounded-2xl group/score cursor-default transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.05)'
                                    }}
                                >
                                    {/* Titans Score */}
                                    <div className="text-center min-w-[60px] md:min-w-[80px]">
                                        <span
                                            className={`font-bebas text-5xl md:text-7xl lg:text-8xl leading-none transition-all duration-300 inline-block group-hover/score:scale-110 ${isWin ? 'text-emerald-400' : (isTie ? 'text-amber-400' : 'text-white')
                                                }`}
                                            style={{
                                                textShadow: isWin ? `0 0 40px ${winColor}60, 0 4px 20px rgba(0,0,0,0.3)` : '0 4px 20px rgba(0,0,0,0.3)',
                                                WebkitTextStroke: isWin ? `1px ${winColor}` : 'none'
                                            }}
                                        >
                                            {latestResult.titans_score}
                                        </span>
                                    </div>

                                    {/* Divider with VS */}
                                    <div className="flex flex-col items-center gap-1 mx-2">
                                        <div className="w-px h-4 md:h-6 bg-white/20" />
                                        <span className="text-white/40 text-xs font-bold tracking-widest">VS</span>
                                        <div className="w-px h-4 md:h-6 bg-white/20" />
                                    </div>

                                    {/* Opponent Score */}
                                    <div className="text-center min-w-[60px] md:min-w-[80px]">
                                        <span
                                            className={`font-bebas text-5xl md:text-7xl lg:text-8xl leading-none transition-all duration-300 inline-block group-hover/score:scale-110 ${!isWin && !isTie ? 'text-red-400' : (isTie ? 'text-amber-400' : 'text-white/50')
                                                }`}
                                            style={{
                                                textShadow: !isWin && !isTie ? `0 0 40px ${lossColor}60, 0 4px 20px rgba(0,0,0,0.3)` : '0 4px 20px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {latestResult.opponent_score}
                                        </span>
                                    </div>
                                </div>

                                {/* FINAL label below score - properly centered */}
                                <div className="mt-4 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm hover:bg-white/15 transition-colors">
                                    <span className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase">Final</span>
                                </div>
                            </div>

                            {/* Opponent (Right) */}
                            <div className="text-center relative group/opponent cursor-default">
                                {/* Home/Away Badge for Opponent - Enhanced styling */}
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 z-10 transition-all duration-300 group-hover/opponent:scale-105 ${!isHomeGame
                                    ? 'bg-gradient-to-r from-slate-600 via-slate-600 to-slate-600/80 text-white shadow-lg shadow-slate-600/20'
                                    : 'bg-white/10 text-white/70 border border-white/10 hover:bg-white/15'
                                    }`}>
                                    {!isHomeGame ? (
                                        <>
                                            <HomeIcon />
                                            <span>HOME</span>
                                        </>
                                    ) : (
                                        <>
                                            <AwayIcon />
                                            <span>AWAY</span>
                                        </>
                                    )}
                                </div>

                                {/* Interactive Team Card */}
                                <div
                                    className="relative mx-auto pt-8 pb-4 px-4 rounded-2xl transition-all duration-300 group-hover/opponent:bg-white/5"
                                    style={{
                                        filter: !isWin && !isTie ? `drop-shadow(0 0 25px ${lossColor}30)` : 'none'
                                    }}
                                >
                                    {/* Loss indicator glow ring (if opponent won) */}
                                    {!isWin && !isTie && (
                                        <div
                                            className="absolute inset-0 rounded-2xl animate-pulse"
                                            style={{
                                                background: `radial-gradient(circle at center, ${lossColor}10, transparent 70%)`,
                                                animation: 'pulse 2s ease-in-out infinite'
                                            }}
                                        />
                                    )}

                                    <TeamLogo
                                        logoUrl={opponentTeam.logo_url}
                                        teamName={opponentTeam.name}
                                        primaryColor={opponentColor}
                                        size="large"
                                        className="mx-auto mb-3"
                                    />

                                    {/* Team Name with winner badge (if they won) */}
                                    <div className={`font-bebas text-lg md:text-xl tracking-wide transition-colors duration-300 ${!isWin && !isTie ? 'text-white' : 'text-white/60'}`}>
                                        {opponentTeam.short_name || opponentTeam.name}
                                        {!isWin && !isTie && (
                                            <span className="ml-2 inline-flex items-center">
                                                <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Game Details - Premium Stats Bar */}
                        <div
                            className="flex justify-center gap-6 md:gap-10 lg:gap-16 pt-8 mt-4 border-t border-white/10 flex-wrap"
                        >
                            {/* Location */}
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 rounded-xl bg-white/5 group-hover/item:bg-white/10 transition-colors">
                                    <LocationIcon />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-0.5">
                                        Location
                                    </div>
                                    <div className="font-semibold text-white text-sm">
                                        {latestResult.location}
                                    </div>
                                </div>
                            </div>

                            {/* Leading Scorer */}
                            {latestResult.leading_scorer && (
                                <div className="flex items-center gap-3 group/item">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 group-hover/item:from-amber-500/30 group-hover/item:to-amber-500/10 transition-colors">
                                        <StarIcon />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-0.5">
                                            Top Scorer
                                        </div>
                                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                                            <span>{latestResult.leading_scorer}</span>
                                            <span
                                                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400"
                                            >
                                                {latestResult.leading_scorer_goals}G
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Game Type Badge */}
                            <div className="flex items-center gap-3 group/item">
                                <div className="p-2.5 rounded-xl bg-white/5 group-hover/item:bg-white/10 transition-colors">
                                    <TrophyIcon />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-0.5">
                                        Game Type
                                    </div>
                                    <div className="font-semibold text-white text-sm capitalize">
                                        {latestResult.season_type || 'Regular Season'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes if any */}
                        {latestResult.notes && (
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <div
                                    className="flex items-start gap-3 p-4 rounded-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)'
                                    }}
                                >
                                    <div className="p-1.5 rounded-lg bg-white/10 mt-0.5">
                                        <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
