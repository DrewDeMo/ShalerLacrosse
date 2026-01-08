export default function Results() {
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
                        Season Opener
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 mb-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4">
                                T
                            </div>
                            <div className="font-medium mb-1">Shaler Area Titans</div>
                            <div className="text-sm text-white/50">(1-0)</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bebas text-6xl leading-none text-red">12</span>
                            <span className="w-5 h-0.5 bg-white/30" />
                            <span className="font-bebas text-6xl leading-none">8</span>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center font-bebas text-3xl mx-auto mb-4">
                                NA
                            </div>
                            <div className="font-medium mb-1">North Allegheny</div>
                            <div className="text-sm text-white/50">(0-1)</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-12 pt-8 border-t border-white/10">
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Date</div>
                            <div className="font-semibold">March 15, 2025</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Location</div>
                            <div className="font-semibold">Titans Field</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/50 mb-1">Leading Scorer</div>
                            <div className="font-semibold">Player Name – 4 Goals</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
