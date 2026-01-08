import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

// Icon components
const CalendarIcon = () => (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2" />
    </svg>
);

const CameraIcon = () => (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const MessageIcon = () => (
    <svg fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const ArrowIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const ctaCards = [
    {
        icon: <CalendarIcon />,
        title: 'View Full Schedule',
        description: 'See all games, times, and locations for the 2025–26 season.',
        link: '#schedule',
        accent: 'from-red to-red/70',
        stat: '20+',
        statLabel: 'Games'
    },
    {
        icon: <CameraIcon />,
        title: 'Follow the Team',
        description: 'Stay updated with game highlights, photos, and team news.',
        link: 'https://www.instagram.com',
        accent: 'from-navy to-navy/70',
        stat: '📸',
        statLabel: 'Updates'
    },
    {
        icon: <MessageIcon />,
        title: 'Contact Coaching Staff',
        description: 'Questions about the program? Reach out to our coaches.',
        link: 'mailto:ShalerAreaLacrosse@gmail.com',
        accent: 'from-red to-red/70',
        stat: '24h',
        statLabel: 'Response'
    }
];

// CTA Card Component
const CTACard = ({ card, index }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;

        gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.95 });

        const trigger = ScrollTrigger.create({
            trigger: cardRef.current,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.to(cardRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    delay: index * 0.15,
                    ease: 'power3.out'
                });
            }
        });

        return () => trigger.kill();
    }, [index]);

    return (
        <a
            ref={cardRef}
            href={card.link}
            target={card.link.startsWith('http') ? '_blank' : undefined}
            rel={card.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group relative block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card */}
            <div
                className="relative rounded-2xl overflow-hidden transition-all duration-500 h-full"
                style={{
                    background: 'white',
                    boxShadow: isHovered
                        ? '0 25px 50px -12px rgba(6, 22, 73, 0.2), 0 0 0 1px rgba(173, 29, 52, 0.2)'
                        : '0 4px 20px -4px rgba(6, 22, 73, 0.1), 0 0 0 1px rgba(6, 22, 73, 0.05)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                }}
            >
                {/* Top accent bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.accent} transition-all duration-500`}
                    style={{
                        transform: isHovered ? 'scaleX(1)' : 'scaleX(0.3)',
                        transformOrigin: 'left'
                    }}
                />

                {/* Decorative corner element */}
                <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full transition-all duration-500"
                    style={{
                        background: isHovered ? 'rgba(173, 29, 52, 0.05)' : 'rgba(6, 22, 73, 0.03)',
                    }}
                />

                <div className="relative p-8 lg:p-10">
                    {/* Icon and stat row */}
                    <div className="flex items-start justify-between mb-6">
                        {/* Icon container */}
                        <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center transition-all duration-500`}
                            style={{
                                transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
                                boxShadow: isHovered ? '0 10px 30px rgba(173, 29, 52, 0.3)' : '0 4px 15px rgba(6, 22, 73, 0.15)'
                            }}
                        >
                            <div className="w-8 h-8 text-white">
                                {card.icon}
                            </div>
                        </div>

                        {/* Mini stat badge */}
                        <div
                            className="text-right transition-all duration-300"
                            style={{
                                opacity: isHovered ? 1 : 0.6,
                                transform: isHovered ? 'translateY(0)' : 'translateY(4px)'
                            }}
                        >
                            <div className="font-bebas text-2xl text-navy leading-none">
                                {card.stat}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-navy/50 font-medium">
                                {card.statLabel}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <h3
                            className="font-bebas text-2xl tracking-wide mb-2 transition-colors duration-300"
                            style={{ color: isHovered ? '#ad1d34' : '#061649' }}
                        >
                            {card.title}
                        </h3>
                        {/* Animated underline */}
                        <div
                            className="h-0.5 bg-gradient-to-r from-red to-transparent transition-all duration-500 mb-4"
                            style={{ width: isHovered ? '60%' : '0%' }}
                        />
                        <p className="text-sm text-navy/60 leading-relaxed">
                            {card.description}
                        </p>
                    </div>

                    {/* CTA link */}
                    <div
                        className="flex items-center gap-2 text-sm font-semibold transition-all duration-300"
                        style={{
                            color: isHovered ? '#ad1d34' : '#061649',
                        }}
                    >
                        <span className="uppercase tracking-wider text-xs">
                            {card.link.startsWith('mailto') ? 'Send Email' : card.link.startsWith('http') ? 'Follow Us' : 'View Now'}
                        </span>
                        <div
                            className="transition-transform duration-300"
                            style={{
                                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                            }}
                        >
                            <ArrowIcon />
                        </div>
                    </div>
                </div>

                {/* Bottom decorative line */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(173, 29, 52, 0.2), transparent)',
                        opacity: isHovered ? 1 : 0
                    }}
                />
            </div>
        </a>
    );
};

export default function CTA() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current || !titleRef.current) return;

        gsap.set(titleRef.current, { opacity: 0, y: 30 });

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        });

        return () => trigger.kill();
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="relative py-24 px-6 lg:px-12 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-off-white via-white to-slate-50" />

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #061649 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red/[0.02] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-navy/[0.03] rounded-full blur-[80px]" />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-8 h-px bg-gradient-to-r from-transparent to-red/50" />
                        <span className="text-xs font-bold text-red tracking-[0.2em] uppercase">Get Involved</span>
                        <div className="w-8 h-px bg-gradient-to-l from-transparent to-red/50" />
                    </div>
                    <h2 className="font-bebas text-5xl md:text-6xl tracking-wide leading-none text-navy">
                        CONNECT WITH <span className="text-red">TITANS</span> LACROSSE
                    </h2>
                    <p className="text-navy/50 text-sm mt-4 max-w-md mx-auto">
                        Be part of the Shaler Area lacrosse community
                    </p>
                </div>

                {/* CTA Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {ctaCards.map((card, index) => (
                        <CTACard key={index} card={card} index={index} />
                    ))}
                </div>

                {/* Bottom decorative element */}
                <div className="flex justify-center mt-16">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red/20" />
                        <div className="w-3 h-3 rounded-full bg-red/40" />
                        <div className="w-2 h-2 rounded-full bg-red/20" />
                    </div>
                </div>
            </div>
        </section>
    );
}
