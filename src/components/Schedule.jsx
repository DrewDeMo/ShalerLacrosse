import GameCard from './GameCard';

const games = [
    {
        month: 'Mar',
        day: '15',
        weekday: 'Saturday',
        opponent: 'North Allegheny Tigers',
        location: 'Titans Field • Season Opener',
        type: 'home',
        time: '1:00 PM'
    },
    {
        month: 'Mar',
        day: '22',
        weekday: 'Saturday',
        opponent: 'Pine-Richland Rams',
        location: 'Pine-Richland Stadium',
        type: 'away',
        time: '2:00 PM'
    },
    {
        month: 'Mar',
        day: '29',
        weekday: 'Saturday',
        opponent: 'Fox Chapel Foxes',
        location: 'Titans Field',
        type: 'home',
        time: '1:00 PM'
    },
    {
        month: 'Apr',
        day: '05',
        weekday: 'Saturday',
        opponent: 'Seneca Valley Raiders',
        location: 'NexTier Stadium',
        type: 'away',
        time: '12:00 PM'
    },
    {
        month: 'Apr',
        day: '12',
        weekday: 'Saturday',
        opponent: 'Hampton Talbots',
        location: 'Titans Field • Youth Day',
        type: 'home',
        time: '1:00 PM'
    },
];

export default function Schedule() {
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

                <div className="grid gap-4">
                    {games.map((game, index) => (
                        <GameCard key={index} game={game} />
                    ))}
                </div>
            </div>
        </section>
    );
}
