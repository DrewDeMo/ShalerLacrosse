import { format, parseISO } from 'date-fns';
import TeamLogo from './common/TeamLogo';

/**
 * GameCard Component - Clean Athletic Schedule Row
 * Horizontal layout: Date | Opponent Logo & Info | Home/Away Badge | Time
 */
export default function GameCard({ game }) {
    const gameDate = parseISO(game.date);
    const month = format(gameDate, 'MMM').toUpperCase();
    const day = format(gameDate, 'd').padStart(2, '0');
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

    // Get opponent info
    const opponentTeam = game.opponent || {
        name: 'TBD',
        logo_url: null,
        primary_color: '#666666'
    };

    const opponentName = opponentTeam.short_name || opponentTeam.name || 'TBD';
    const opponentColor = opponentTeam.primary_color || '#666666';
    const opponentLogo = opponentTeam.logo_url;

    const isHome = game.game_type === 'home';
    const displayName = isHome ? `vs. ${opponentName}` : `@ ${opponentName}`;

    // Location - use stadium_name from the game or fallback to location field
    const locationText = game.stadium_name || game.location || (isHome ? 'Shaler Stadium' : 'Away');

    return (
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
            {/* Subtle left accent using opponent's team color */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: opponentColor }}
            />

            <div className="flex items-center px-6 py-5 md:px-8 md:py-6">
                {/* Date Section */}
                <div className="flex-shrink-0 text-center w-16 md:w-20">
                    <span className="block text-xs font-semibold text-red tracking-widest uppercase">
                        {month}
                    </span>
                    <span className="block font-bebas text-4xl md:text-5xl text-navy leading-none">
                        {day}
                    </span>
                    <span className="block text-xs text-gray-500 capitalize">
                        {weekday}
                    </span>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-16 bg-gray-200 mx-6 flex-shrink-0" />
                <div className="md:hidden w-px h-12 bg-gray-200 mx-4 flex-shrink-0" />

                {/* Opponent Logo & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Opponent Logo */}
                    <div className="flex-shrink-0 hidden sm:block">
                        <TeamLogo
                            logoUrl={opponentLogo}
                            teamName={opponentTeam.name}
                            primaryColor={opponentColor}
                            size="small"
                        />
                    </div>

                    {/* Opponent Name & Location */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-navy text-base md:text-lg truncate group-hover:text-red transition-colors duration-200">
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            {/* Location Icon (SVG) */}
                            <svg
                                className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm text-gray-500 truncate">
                                {locationText}
                                {game.notes && (
                                    <span className="text-red"> • {game.notes}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Home/Away Badge */}
                <div className="flex-shrink-0 mx-4 md:mx-6">
                    <span
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isHome
                                ? 'bg-navy text-white'
                                : 'bg-transparent border-2 border-red/30 text-red'
                            }`}
                    >
                        {isHome ? 'HOME' : 'AWAY'}
                    </span>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-right">
                    <span className="font-bebas text-xl md:text-2xl text-navy tracking-wide">
                        {timeFormatted}
                    </span>
                </div>
            </div>
        </div>
    );
}
