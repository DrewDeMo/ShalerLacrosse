import { format, parseISO } from 'date-fns';
import TeamLogo from './common/TeamLogo';

/**
 * GameCard Component - Modern Sports Matchup Display
 * Titans always displayed on left, opponent on right
 * Features: Team logos, color theming, home/away badges, glassmorphism design
 */
export default function GameCard({ game }) {
    const gameDate = parseISO(game.date);
    const month = format(gameDate, 'MMM');
    const day = format(gameDate, 'd');
    const weekday = format(gameDate, 'EEEE');

    // Format time from database (e.g., "13:00:00" to "1:00 PM")
    let timeFormatted = '';
    if (game.time) {
        try {
            const [hours, minutes] = game.time.split(':');
            const hour = parseInt(hours, 10);
            const minute = minutes || '00';
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            timeFormatted = `${displayHour}:${minute} ${period}`;
        } catch (e) {
            timeFormatted = game.time;
        }
    }

    // Determine teams - Titans always on left
    const titansTeam = game.home || {
        name: 'Shaler Area Titans',
        logo_url: null,
        primary_color: '#C8102E',
        secondary_color: '#003B5C'
    };

    const opponentTeam = game.opponent || {
        name: game.opponent || 'TBD',
        logo_url: null,
        primary_color: '#666666',
        secondary_color: '#999999'
    };

    // Get team colors for styling
    const titansColor = titansTeam.primary_color || '#C8102E';
    const opponentColor = opponentTeam.primary_color || '#666666';

    const isHome = game.game_type === 'home';

    return (
        <div
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            style={{
                background: `linear-gradient(135deg, ${titansColor}03, ${opponentColor}03)`,
                borderTop: `3px solid transparent`,
                borderImage: `linear-gradient(90deg, ${titansColor}40, ${opponentColor}40) 1`,
                borderImageSlice: 1
            }}
        >
            {/* Subtle gradient overlay on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, ${isHome ? titansColor : opponentColor}05, transparent)`
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Date Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-navy/5 rounded-full">
                        <span className="text-xs font-semibold text-red uppercase tracking-widest">
                            {month}
                        </span>
                        <span className="font-bebas text-3xl text-navy leading-none">
                            {day}
                        </span>
                        <span className="text-xs text-gray-600">
                            {weekday}
                        </span>
                    </div>
                </div>

                {/* Team Matchup */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    {/* Shaler Titans (Left) */}
                    <div className="flex-1 text-center">
                        <TeamLogo
                            logoUrl={titansTeam.logo_url}
                            teamName={titansTeam.name}
                            primaryColor={titansColor}
                            size="large"
                            className="mx-auto mb-3"
                        />
                        <p className="font-semibold text-navy text-sm md:text-base">
                            {titansTeam.short_name || titansTeam.name || 'Shaler Titans'}
                        </p>
                    </div>

                    {/* VS Indicator */}
                    <div className="flex flex-col items-center px-4">
                        <span className="font-bebas text-4xl text-navy/40 leading-none">
                            VS
                        </span>
                    </div>

                    {/* Opponent (Right) */}
                    <div className="flex-1 text-center">
                        <TeamLogo
                            logoUrl={opponentTeam.logo_url}
                            teamName={opponentTeam.name}
                            primaryColor={opponentColor}
                            size="large"
                            className="mx-auto mb-3"
                        />
                        <p className="font-semibold text-navy text-sm md:text-base">
                            {opponentTeam.short_name || opponentTeam.name}
                        </p>
                    </div>
                </div>

                {/* Game Details */}
                <div className="space-y-2 mb-4 text-center">
                    <p className="font-bebas text-2xl text-navy">
                        {timeFormatted}
                    </p>
                    <p className="text-sm text-gray-600">
                        {game.location}
                    </p>
                </div>

                {/* Home/Away Badge */}
                <div className="flex justify-center">
                    <span
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isHome
                                ? 'bg-navy/10 text-navy'
                                : 'bg-red/10 text-red'
                            }`}
                        style={{
                            boxShadow: isHome
                                ? `0 0 20px ${titansColor}15`
                                : `0 0 20px ${opponentColor}15`
                        }}
                    >
                        {isHome ? '🏠 HOME' : '✈️ AWAY'}
                    </span>
                </div>

                {/* Notes if any */}
                {game.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center italic">
                            {game.notes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
