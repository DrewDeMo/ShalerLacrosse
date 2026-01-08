export default function Hero() {
    return (
        <section id="home" className="min-h-screen flex items-center relative overflow-hidden px-12 pt-24 pb-16">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-radial from-red-glow/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            </div>

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto w-full items-center">
                <div className="animate-fadeSlideUp">
                    <div className="inline-flex items-center gap-2 bg-red/15 border border-red/30 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 text-red">
                        <span className="w-2 h-2 bg-red rounded-full animate-pulse" />
                        2025–26 Season
                    </div>
                    <h1 className="font-bebas text-8xl lg:text-9xl leading-none tracking-tight mb-6">
                        SHALER AREA
                        <span className="block text-red text-5xl tracking-wide">TITANS LACROSSE</span>
                    </h1>
                    <p className="text-xl text-white/70 font-light mb-10 max-w-md leading-relaxed">
                        Built on discipline. Played with pride. Representing Shaler Area with honor on every field.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <a href="#schedule" className="btn-primary">
                            View Schedule
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12l7-7M5 5h7v7" />
                            </svg>
                        </a>
                        <a href="#contact" className="btn-secondary">Contact Us</a>
                    </div>
                </div>

                <div className="relative animate-fadeSlideUp animation-delay-300">
                    <div className="aspect-[4/5] bg-gradient-to-br from-red/20 to-navy/80 rounded-3xl overflow-hidden relative border border-white/10">
                        <div className="absolute inset-0 flex items-center justify-center font-bebas text-2xl tracking-widest text-white/30">
                            ACTION PHOTO
                        </div>
                    </div>
                    <div className="absolute -inset-5 border-2 border-red rounded-[2rem] opacity-30 pointer-events-none" />
                    <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-red rounded-full blur-[80px] opacity-40" />
                </div>
            </div>
        </section>
    );
}
