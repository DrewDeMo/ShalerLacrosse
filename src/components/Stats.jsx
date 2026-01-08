import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { useStats } from '../hooks/useStats';

// Icon components for each stat type
const GameIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const TrophyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
);

const ChartIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const GoalIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
);

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }) => {
    const counterRef = useRef(null);
    const [displayValue, setDisplayValue] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        const numValue = parseInt(value) || 0;
                        const duration = 2000;
                        const startTime = Date.now();

                        const animate = () => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Easing function for smooth animation
                            const easeOut = 1 - Math.pow(1 - progress, 3);
                            setDisplayValue(Math.round(numValue * easeOut));

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            }
                        };
                        requestAnimationFrame(animate);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [value]);

    return (
        <span ref={counterRef}>
            {displayValue}{suffix}
        </span>
    );
};

// Individual stat card component
const StatCard = ({ icon: Icon, number, label, index, accentColor = 'red' }) => {
    const cardRef = useRef(null);

    useGSAP(() => {
        gsap.set(cardRef.current, { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: cardRef.current,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(cardRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            }
        });
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className="group relative"
        >
            {/* Card background - light theme */}
            <div className="relative bg-white rounded-xl p-4 lg:p-5 border border-navy/[0.08] overflow-hidden transition-all duration-500 hover:border-red/30 hover:shadow-[0_8px_30px_rgba(6,22,73,0.12)]">
                {/* Diagonal accent stripe */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-red/10 to-transparent rotate-45 transition-all duration-500 group-hover:scale-150 group-hover:from-red/20" />

                {/* Icon container */}
                <div className="relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red/10 text-red mb-3 transition-all duration-300 group-hover:bg-red/20 group-hover:scale-110">
                    <Icon />
                </div>

                {/* Number with animated glow */}
                <div className="relative z-10">
                    <div className="font-bebas text-4xl lg:text-5xl text-navy leading-none mb-1 transition-all duration-300 group-hover:text-red">
                        <AnimatedCounter value={number} />
                    </div>

                    {/* Glow effect behind number on hover */}
                    <div className="absolute inset-0 font-bebas text-4xl lg:text-5xl text-red/30 leading-none blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
                        {number}
                    </div>
                </div>

                {/* Label with animated underline */}
                <div className="relative z-10 mt-1">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-navy/50 font-medium">
                        {label}
                    </div>
                    <div className="h-px w-0 bg-gradient-to-r from-red to-red/50 mt-1.5 transition-all duration-500 group-hover:w-full" />
                </div>

                {/* Corner decoration */}
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b border-navy/[0.06] rounded-br-lg transition-colors duration-300 group-hover:border-red/20" />
            </div>
        </div>
    );
};

export default function Stats() {
    const sectionRef = useRef(null);
    const { stats, loading } = useStats();

    // Calculate win percentage
    const winPercentage = stats.totalGames > 0
        ? Math.round((stats.wins / stats.totalGames) * 100)
        : 0;

    const displayStats = [
        { icon: GameIcon, number: stats.totalGames || '0', label: 'Games Played' },
        { icon: TrophyIcon, number: stats.wins || '0', label: 'Victories' },
        { icon: ChartIcon, number: `${winPercentage}`, label: 'Win Rate %' },
        { icon: GoalIcon, number: stats.totalGoals || '0', label: 'Goals Scored' },
    ];

    useGSAP(() => {
        // Animate the section title
        gsap.set('.stats-title', { opacity: 0, y: 20 });

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to('.stats-title', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    }, { scope: sectionRef });

    if (loading) {
        return (
            <section className="relative py-16 lg:py-20 px-6 lg:px-12 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-off-white via-white to-off-white" />
                <div className="relative z-10 max-w-7xl mx-auto text-center text-navy/60">
                    <div className="inline-flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-red/50 border-t-red rounded-full animate-spin" />
                        Loading season stats...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            className="relative py-20 lg:py-24 px-6 lg:px-12 overflow-hidden"
        >
            {/* Light gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-off-white via-white to-off-white" />

            {/* Net texture background with light duotone effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'url(/net_closeup.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2) brightness(1.1)',
                    opacity: 0.04,
                    mixBlendMode: 'multiply'
                }}
            />

            {/* Subtle decorative orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-navy/5 rounded-full blur-[100px]" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(6,22,73,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,22,73,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Top and bottom decorative lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/20 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="stats-title text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-red/10 border border-red/20 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-red mb-4">
                        <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse" />
                        Season Statistics
                    </div>
                    <h2 className="font-bebas text-5xl lg:text-6xl text-navy tracking-tight">
                        By The <span className="text-red">Numbers</span>
                    </h2>
                    <p className="text-navy/50 text-sm mt-3 max-w-md mx-auto">
                        Track our team's performance throughout the season
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {displayStats.map((stat, index) => (
                        <StatCard
                            key={index}
                            icon={stat.icon}
                            number={stat.number}
                            label={stat.label}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom accent */}
                <div className="flex justify-center mt-12 lg:mt-16">
                    <div className="flex items-center gap-4 text-navy/30 text-xs uppercase tracking-widest">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-navy/20" />
                        <span>Updated in Real-Time</span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-navy/20" />
                    </div>
                </div>
            </div>
        </section>
    );
}
