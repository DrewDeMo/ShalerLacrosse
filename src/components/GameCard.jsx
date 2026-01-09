import { format, parseISO } from 'date-fns';
import TeamLogo from './common/TeamLogo';

/**
 * GameCard Component - Clean Athletic Schedule Row
 * Desktop: Horizontal layout - Date | Opponent Logo & Info | Home/Away Badge | Time
 * Mobile: Stacked card layout showing all information without truncation
 * Supports variant prop for different section backgrounds
 */
export default function GameCard({ game, variant = 'default' }) {
    const gameDate = parseISO(game.date);
    const month = format(gameDate, 'MMM').toUpperCase();
    const day = format(gameDate, 'd').padStart(2, '0');
    const weekday = format(gameDate, 'EEEE');
    const fullDate = format(gameDate, 'EEEE, MMMM d, yyyy');

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

    // Get opponent info - use full name on mobile
    const opponentTeam = game.opponent || {
        name: 'TBD',
        logo_url: null,
        primary_color: '#666666'
    };

    const opponentShortName = opponentTeam.short_name || opponentTeam.name || 'TBD';
    const opponentFullName = opponentTeam.name || 'TBD';
    const opponentColor = opponentTeam.primary_color || '#666666';
    const opponentLogo = opponentTeam.logo_url;

    const isHome = game.game_type === 'home';
    const displayNameShort = isHome ? `vs. ${opponentShortName}` : `@ ${opponentShortName}`;
    const displayNameFull = isHome ? `vs. ${opponentFullName}` : `@ ${opponentFullName}`;

    // Location - use stadium_name from the game or fallback to location field
    const locationText = game.stadium_name || game.location || (isHome ? 'Shaler Stadium' : 'Away');

    // Variant-specific styling
    const isRedSection = variant === 'red-section';

    return (
        <div
            className={`rounded-xl transition-all duration-300 group relative overflow-hidden ${isRedSection
                ? 'bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/20'
                : 'bg-white shadow-sm hover:shadow-lg'
                }`}
        >
            {/* Subtle left accent using opponent's team color */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: isRedSection ? '#061649' : opponentColor }}
            />

            {/* Desktop Layout (md and up) - Original horizontal design */}
            <div className="hidden md:flex items-center px-8 py-6">
                {/* Date Section */}
                <div className="flex-shrink-0 text-center w-20">
                    <span className={`block text-xs font-semibold tracking-widest uppercase ${isRedSection ? 'text-red' : 'text-red'
                        }`}>
                        {month}
                    </span>
                    <span className="block font-bebas text-5xl text-navy leading-none">
                        {day}
                    </span>
                    <span className={`block text-xs capitalize ${isRedSection ? 'text-navy/60' : 'text-gray-500'
                        }`}>
                        {weekday}
                    </span>
                </div>

                {/* Vertical Divider */}
                <div className={`w-px h-16 mx-6 flex-shrink-0 ${isRedSection ? 'bg-navy/10' : 'bg-gray-200'
                    }`} />

                {/* Opponent Logo & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Opponent Logo */}
                    <div className="flex-shrink-0">
                        <TeamLogo
                            logoUrl={opponentLogo}
                            teamName={opponentTeam.name}
                            primaryColor={opponentColor}
                            size="small"
                        />
                    </div>

                    {/* Opponent Name & Location */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-navy text-lg truncate group-hover:text-red transition-colors duration-200">
                            {displayNameShort}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            {/* Location Icon (SVG) */}
                            <svg
                                className={`w-3.5 h-3.5 flex-shrink-0 ${isRedSection ? 'text-navy/40' : 'text-gray-400'
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className={`text-sm truncate ${isRedSection ? 'text-navy/60' : 'text-gray-500'
                                }`}>
                                {locationText}
                                {game.notes && (
                                    <span className="text-red"> • {game.notes}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Home/Away Badge */}
                <div className="flex-shrink-0 mx-6">
                    <span
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isHome
                            ? 'bg-navy text-white'
                            : isRedSection
                                ? 'bg-transparent border-2 border-navy/20 text-navy'
                                : 'bg-transparent border-2 border-red/30 text-red'
                            }`}
                    >
                        {isHome ? 'HOME' : 'AWAY'}
                    </span>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-right">
                    <span className="font-bebas text-2xl text-navy tracking-wide">
                        {timeFormatted}
                    </span>
                </div>
            </div>

            {/* Mobile Layout (below md) - Stacked card design with full info */}
            <div className="md:hidden p-5">
                {/* Top row: Date badge + Home/Away badge */}
                <div className="flex items-center justify-between mb-4">
                    {/* Date badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${isRedSection ? 'bg-red/10' : 'bg-red/5'
                        }`}>
                        <span className="font-bebas text-2xl text-navy leading-none">
                            {month} {day}
                        </span>
                        <span className={`text-xs ${isRedSection ? 'text-navy/60' : 'text-gray-500'}`}>
                            {weekday}
                        </span>
                    </div>

                    {/* Home/Away Badge */}
                    <span
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isHome
                            ? 'bg-navy text-white'
                            : isRedSection
                                ? 'bg-transparent border-2 border-navy/20 text-navy'
                                : 'bg-transparent border-2 border-red/30 text-red'
                            }`}
                    >
                        {isHome ? 'HOME' : 'AWAY'}
                    </span>
                </div>

                {/* Opponent section with logo */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Opponent Logo */}
                    <div className="flex-shrink-0">
                        <TeamLogo
                            logoUrl={opponentLogo}
                            teamName={opponentTeam.name}
                            primaryColor={opponentColor}
                            size="small"
                        />
                    </div>

                    {/* Opponent Name - Full name, no truncation */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-navy text-lg leading-tight group-hover:text-red transition-colors duration-200">
                            {displayNameFull}
                        </h3>
                    </div>
                </div>

                {/* Game details grid */}
                <div className={`grid grid-cols-1 gap-2 pt-3 border-t ${isRedSection ? 'border-navy/10' : 'border-gray-100'
                    }`}>
                    {/* Time */}
                    <div className="flex items-center gap-2">
                        <svg
                            className={`w-4 h-4 flex-shrink-0 ${isRedSection ? 'text-red' : 'text-red'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-navy">
                            {timeFormatted || 'TBD'}
                        </span>
                    </div>

                    {/* Location - Full text, no truncation */}
                    <div className="flex items-start gap-2">
                        <svg
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isRedSection ? 'text-navy/40' : 'text-gray-400'
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className={`text-sm ${isRedSection ? 'text-navy/70' : 'text-gray-600'}`}>
                            {locationText}
                        </span>
                    </div>

                    {/* Notes - if any */}
                    {game.notes && (
                        <div className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 flex-shrink-0 mt-0.5 text-red"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-red font-medium">
                                {game.notes}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
