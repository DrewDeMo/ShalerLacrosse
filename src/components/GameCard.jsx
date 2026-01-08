import { format, parseISO } from 'date-fns';

export default function GameCard({ game }) {
    const gameDate = parseISO(game.date);
    const month = format(gameDate, 'MMM');
    const day = format(gameDate, 'd');
    const weekday = format(gameDate, 'EEEE');

    // Format time from database (e.g., "13:00:00" to "1:00 PM")
    let timeFormatted = '';
    if (game.time) {
        try {
            // Parse time string (HH:MM:SS format from database)
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

    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 grid grid-cols-[100px_1fr_auto_auto] items-center gap-8 shadow-lg transition-all duration-300 border border-transparent hover:border-red hover:translate-x-2 hover:shadow-2xl">
            <div className="text-center pr-8 border-r border-gray-200">
                <div className="text-xs uppercase tracking-widest text-red font-semibold">
                    {month}
                </div>
                <div className="font-bebas text-5xl leading-none text-navy">
                    {day}
                </div>
                <div className="text-sm text-gray-600">
                    {weekday}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-1 text-navy">
                    {game.game_type === 'home' ? 'vs. ' : '@ '}{game.opponent}
                </h3>
                <p className="text-sm text-gray-600">
                    {game.location}
                </p>
            </div>

            <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${game.game_type === 'home'
                ? 'bg-navy/10 text-navy'
                : 'bg-red/10 text-red'
                }`}>
                {game.game_type}
            </span>

            <div className="font-bebas text-2xl text-navy">
                {timeFormatted}
            </div>
        </div>
    );
}
