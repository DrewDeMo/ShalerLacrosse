import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, User, Award } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Helper function to convert grade number to class name
const getClassName = (grade) => {
    const gradeNum = parseInt(grade);
    switch (gradeNum) {
        case 9: return 'Freshman';
        case 10: return 'Sophomore';
        case 11: return 'Junior';
        case 12: return 'Senior';
        default: return `Grade ${grade}`;
    }
};

// Position Icons with athletic styling
const PositionIcon = ({ position }) => {
    const icons = {
        attack: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 12l8 10 8-10L12 2zm0 4l4 6-4 5-4-5 4-6z" />
            </svg>
        ),
        midfield: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
        ),
        defense: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 3.18l6 2.67v4.15c0 4.03-2.79 7.77-6 8.83-3.21-1.06-6-4.8-6-8.83V6.85l6-2.67z" />
            </svg>
        ),
        goalie: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M4 12h16M12 4v16" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    };

    const posLower = position?.toLowerCase() || '';
    for (const [key, icon] of Object.entries(icons)) {
        if (posLower.includes(key)) return icon;
    }
    return icons.midfield;
};

// Player Card Component with premium styling
const PlayerCard = ({ player, index }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;

        gsap.set(cardRef.current, { opacity: 0, y: 40, scale: 0.95 });

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
                    delay: (index % 4) * 0.08,
                    ease: 'power3.out'
                });
            }
        });

        return () => trigger.kill();
    }, [index]);

    return (
        <div
            ref={cardRef}
            className="group relative h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card with glassmorphism */}
            <div
                className="relative rounded-2xl overflow-hidden h-full transition-all duration-500"
                style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isHovered
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(200, 16, 46, 0.15), inset 0 1px 1px rgba(255,255,255,0.1)'
                        : '0 10px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.05)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                }}
            >
                {/* Animated gradient border */}
                <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                        padding: '1px',
                        background: 'linear-gradient(135deg, rgba(200, 16, 46, 0.5), transparent 40%, rgba(0, 59, 92, 0.5))',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        opacity: isHovered ? 1 : 0.3
                    }}
                />

                {/* Top accent bar */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
                    style={{
                        background: isHovered
                            ? 'linear-gradient(90deg, #C8102E, #C8102E80, transparent)'
                            : 'linear-gradient(90deg, rgba(200, 16, 46, 0.3), transparent)'
                    }}
                />

                {/* Player Photo Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-navy/20 to-navy/40">
                    {player.photo_url ? (
                        <>
                            <img
                                src={player.photo_url}
                                alt={`${player.first_name} ${player.last_name}`}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0 transition-opacity duration-500"
                                style={{
                                    background: 'linear-gradient(180deg, transparent 40%, rgba(0, 36, 54, 0.95) 100%)',
                                    opacity: isHovered ? 0.8 : 1
                                }}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center relative">
                            {/* Decorative background pattern */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, #C8102E 25%, transparent 25%), linear-gradient(-45deg, #C8102E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #C8102E 75%), linear-gradient(-45deg, transparent 75%, #C8102E 75%)`,
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }}
                            />
                            <div className="relative">
                                {/* Large initials with glow */}
                                <div
                                    className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500"
                                    style={{
                                        background: 'linear-gradient(135deg, #C8102E, #8a0b1f)',
                                        boxShadow: isHovered
                                            ? '0 0 60px rgba(200, 16, 46, 0.5), inset 0 2px 10px rgba(255,255,255,0.2)'
                                            : '0 0 30px rgba(200, 16, 46, 0.3), inset 0 2px 10px rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <span className="font-bebas text-5xl text-white tracking-wider">
                                        {player.first_name?.[0]}{player.last_name?.[0]}
                                    </span>
                                </div>
                            </div>
                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(180deg, transparent 50%, rgba(0, 36, 54, 0.9) 100%)'
                                }}
                            />
                        </div>
                    )}

                    {/* Jersey Number Badge - Floating */}
                    {player.jersey_number && (
                        <div
                            className="absolute top-4 right-4 transition-all duration-500"
                            style={{
                                transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center relative"
                                style={{
                                    background: 'linear-gradient(135deg, #C8102E, #8a0b1f)',
                                    boxShadow: isHovered
                                        ? '0 10px 30px rgba(200, 16, 46, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)'
                                        : '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255,255,255,0.1)'
                                }}
                            >
                                <span className="font-bebas text-2xl text-white">
                                    #{player.jersey_number}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Position Badge - Bottom left */}
                    {player.position && (
                        <div className="absolute bottom-4 left-4">
                            <div
                                className="px-3 py-1.5 rounded-full flex items-center gap-2 transition-all duration-300"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                <PositionIcon position={player.position} />
                                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                                    {player.position}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Player Info Section */}
                <div className="relative p-5">
                    {/* Name with hover effect */}
                    <div className="mb-3">
                        <h3
                            className="font-bebas text-2xl tracking-wide transition-colors duration-300"
                            style={{ color: isHovered ? '#C8102E' : 'white' }}
                        >
                            {player.first_name} {player.last_name}
                        </h3>
                        {/* Animated underline */}
                        <div
                            className="h-0.5 bg-gradient-to-r from-red to-transparent transition-all duration-500"
                            style={{ width: isHovered ? '100%' : '0%' }}
                        />
                    </div>

                    {/* Grade / Class Year */}
                    {player.grade && (
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                <Award className="w-3.5 h-3.5 text-red" />
                            </div>
                            <span className="text-sm text-white/60">
                                {getClassName(player.grade)}
                            </span>
                        </div>
                    )}

                    {/* Bio preview */}
                    {player.bio && (
                        <p
                            className="text-sm text-white/50 line-clamp-2 transition-colors duration-300"
                            style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)' }}
                        >
                            {player.bio}
                        </p>
                    )}

                    {/* Bottom decorative element */}
                    <div className="absolute bottom-3 right-3">
                        <div
                            className="w-8 h-8 rounded-lg transition-all duration-500"
                            style={{
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderTopColor: 'transparent',
                                borderLeftColor: 'transparent',
                                opacity: isHovered ? 0.5 : 0.2,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter Button Component
const FilterButton = ({ label, isActive, onClick, index }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!buttonRef.current) return;

        gsap.set(buttonRef.current, { opacity: 0, y: 20 });

        const trigger = ScrollTrigger.create({
            trigger: buttonRef.current,
            start: 'top 95%',
            once: true,
            onEnter: () => {
                gsap.to(buttonRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: 'power2.out'
                });
            }
        });

        return () => trigger.kill();
    }, [index]);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className="relative group"
        >
            <div
                className="px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 relative overflow-hidden"
                style={{
                    background: isActive
                        ? 'linear-gradient(135deg, #C8102E, #8a0b1f)'
                        : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    boxShadow: isActive
                        ? '0 10px 30px rgba(200, 16, 46, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)'
                        : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Hover glow */}
                {!isActive && (
                    <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(200, 16, 46, 0.2), transparent)',
                        }}
                    />
                )}
                <span className="relative z-10">{label}</span>
            </div>
        </button>
    );
};

export default function Roster() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('is_active', true)
                .order('jersey_number', { ascending: true });

            if (error) throw error;
            setPlayers(data || []);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    // Animate title on scroll
    useEffect(() => {
        if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return;

        gsap.set(titleRef.current, { opacity: 0, y: 30 });
        gsap.set(subtitleRef.current, { opacity: 0, x: -20 });

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(subtitleRef.current, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
                gsap.to(titleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: 'power3.out'
                });
            }
        });

        return () => trigger.kill();
    }, [loading]);

    const filteredPlayers = filter === 'all'
        ? players
        : players.filter(p => p.position?.toLowerCase().includes(filter.toLowerCase()));

    const filterOptions = [
        { key: 'all', label: 'All Players' },
        { key: 'attack', label: 'Attack' },
        { key: 'midfield', label: 'Midfield' },
        { key: 'defense', label: 'Defense' },
        { key: 'goalie', label: 'Goalie' },
    ];

    if (loading) {
        return (
            <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
                {/* Dark background */}
                <div className="absolute inset-0 bg-gradient-to-b from-off-white via-slate-100 to-white" />
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 text-navy/60">
                        <div className="w-5 h-5 border-2 border-red/50 border-t-red rounded-full animate-spin" />
                        Loading roster...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            id="roster"
            className="relative py-24 px-6 lg:px-12 overflow-hidden"
        >
            {/* Premium dark background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#0a1d4a] to-navy" />

            {/* Lacrosse crosse & ball texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'url(/crosse&ball.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(100%) contrast(1.2) brightness(0.85)',
                    opacity: 0.03,
                    mixBlendMode: 'screen'
                }}
            />

            {/* Navy/Red duotone color overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, rgba(0, 59, 92, 0.9) 0%, rgba(200, 16, 46, 0.08) 50%, rgba(10, 29, 74, 0.95) 100%)',
                    mixBlendMode: 'multiply'
                }}
            />

            {/* Animated gradient orbs */}
            <div
                className="absolute top-1/4 -left-32 w-96 h-96 bg-red/10 rounded-full blur-[150px] animate-pulse"
                style={{ animationDuration: '5s' }}
            />
            <div
                className="absolute bottom-1/4 -right-32 w-80 h-80 bg-red/5 rounded-full blur-[120px] animate-pulse"
                style={{ animationDuration: '7s', animationDelay: '2s' }}
            />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Watermark background text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="font-bebas text-[25vw] text-white/[0.02] tracking-wider whitespace-nowrap">
                    TITANS
                </span>
            </div>

            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/30 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header - Athletic styling */}
                <div className="mb-16">
                    <div ref={subtitleRef} className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-red to-red/50 rounded-full" />
                        <div className="inline-flex items-center gap-3 bg-red/10 border border-red/20 px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-red tracking-[0.2em] uppercase">
                                Meet The Team
                            </span>
                        </div>
                    </div>
                    <div ref={titleRef}>
                        <h2 className="font-bebas text-6xl md:text-7xl lg:text-8xl tracking-wide leading-none text-white">
                            2025 <span className="text-red">ROSTER</span>
                        </h2>
                        <p className="text-white/50 text-sm mt-4 max-w-md">
                            The athletes representing Shaler Area this season
                        </p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex justify-center gap-3 mb-12 flex-wrap">
                    {filterOptions.map((option, index) => (
                        <FilterButton
                            key={option.key}
                            label={option.label}
                            isActive={filter === option.key}
                            onClick={() => setFilter(option.key)}
                            index={index}
                        />
                    ))}
                </div>

                {/* Player Slider */}
                {filteredPlayers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                            <User className="w-12 h-12 text-white/30" />
                            <p className="text-white/60">No players found for this position.</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative roster-slider">
                        {/* Custom Navigation Buttons */}
                        <button
                            className="roster-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 -ml-4 lg:-ml-7 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-red transition-colors" />
                        </button>
                        <button
                            className="roster-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 -mr-4 lg:-mr-7 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed group"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-red transition-colors" />
                        </button>

                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            navigation={{
                                prevEl: '.roster-prev',
                                nextEl: '.roster-next',
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: true,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 24,
                                },
                            }}
                            className="pb-16 !px-2"
                        >
                            {filteredPlayers.map((player, index) => (
                                <SwiperSlide key={player.id} className="h-auto">
                                    <PlayerCard player={player} index={index} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}

                {/* Bottom accent with player count */}
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-4 text-white/30 text-xs uppercase tracking-widest">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
                        <span className="flex items-center gap-2">
                            <span className="text-red font-bold">{filteredPlayers.length}</span>
                            <span>Active Players</span>
                        </span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>
    );
}
