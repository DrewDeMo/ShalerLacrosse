export default function GameCard({ game }) {
    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 grid grid-cols-[100px_1fr_auto_auto] items-center gap-8 shadow-lg transition-all duration-300 border border-transparent hover:border-red hover:translate-x-2 hover:shadow-2xl">
            <div className="text-center pr-8 border-r border-gray-200">
                <div className="text-xs uppercase tracking-widest text-red font-semibold">
                    {game.month}
                </div>
                <div className="font-bebas text-5xl leading-none text-navy">
                    {game.day}
                </div>
                <div className="text-sm text-gray-600">
                    {game.weekday}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-1 text-navy">
                    {game.type === 'home' ? 'vs. ' : '@ '}{game.opponent}
                </h3>
                <p className="text-sm text-gray-600">
                    {game.location}
                </p>
            </div>

            <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${game.type === 'home'
                    ? 'bg-navy/10 text-navy'
                    : 'bg-red/10 text-red'
                }`}>
                {game.type}
            </span>

            <div className="font-bebas text-2xl text-navy">
                {game.time}
            </div>
        </div>
    );
}
