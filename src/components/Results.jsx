import { useResults } from '../hooks/useResults';
import { format, parseISO } from 'date-fns';

export default function Results() {
    const { results, loading, error } = useResults(1);

    // Don't render section if loading or no results
    if (loading || !results.length) {
        return null;
    }

    const latestResult = results[0];
    const isWin = latestResult.titans_score > latestResult.opponent_score;
    const opponentInitials = latestResult.opponent
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <section id="results" className="py-24 px-12 bg-navy relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center font-bebas text-[25vw] text-white/5 select-none pointer-events-none">
                TITANS
            </div>

            <div className="max-w-5xl mx-auto relative">
                <div className="mb-8">
                    <h2 className="font-bebas text-6xl tracking-wide leading-none">
                        <span className="block text-sm text-red tracking-widest mb-2">Latest Update</span>
                        RECENT RESULT
                    </h2>
                </div>

                <div className="bg-gradient-to-br from-red/15 to-navy/50 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red to-transparent" />

                    <div className="inline-block bg-red text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wide mb-6">
                        {isWin ? 'Victory' : 'Final Score'}
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 mb-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4">
                                T
                            </div>
                            <div className="font-medium mb-1">Shaler Area Titans</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`font-bebas text-6xl leading-none ${isWin ? 'text-red' : ''}`}>
                                {latestResult.titans_score}
                            </span>
                            <span className="w-5 h-0.5 bg-white/30" />
                            <span className={`font-bebas text-6xl leading-none ${!isWin ? 'text-red' : ''}`}>
                                {latestResult.opponent_score}
                            </span>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4">
                                {opponentInitials}
                            </div>
                            <div className="font-medium mb-1">{latestResult.opponent}</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-12 pt-8 border-t border-white/10 flex-wrap">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Date</div>
                            <div className="font-semibold">
                                {format(parseISO(latestResult.game_date), 'MMMM d, yyyy')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Location</div>
                            <div className="font-semibold">{latestResult.location}</div>
                        </div>
                        {latestResult.leading_scorer && (
                            <div className="text-center">
                                <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Leading Scorer</div>
                                <div className="font-semibold">
                                    {latestResult.leading_scorer} – {latestResult.leading_scorer_goals} Goals
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
