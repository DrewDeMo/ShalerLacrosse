import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

// Split text component for animated headlines
const SplitText = ({ children, className = '', as: Tag = 'span' }) => {
    const text = typeof children === 'string' ? children : '';

    return (
        <Tag className={`split-text ${className}`}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="char inline-block align-baseline"
                    style={{
                        display: char === ' ' ? 'inline' : 'inline-block',
                        verticalAlign: 'baseline'
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </Tag>
    );
};

// Stats counter component
const StatCounter = ({ value, label, suffix = '', delay = 0 }) => {
    const counterRef = useRef(null);
    const hasAnimated = useRef(false);

    useGSAP(() => {
        if (hasAnimated.current) return;

        const counter = counterRef.current;
        const obj = { value: 0 };

        gsap.to(obj, {
            value: parseInt(value),
            duration: 2.5,
            delay: delay + 1.5,
            ease: 'power2.out',
            onUpdate: () => {
                counter.textContent = Math.round(obj.value) + suffix;
            },
        });

        hasAnimated.current = true;
    }, [value]);

    return (
        <div className="stat-item text-center">
            <div
                ref={counterRef}
                className="font-bebas text-3xl lg:text-4xl text-white"
            >
                0{suffix}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-medium">{label}</div>
        </div>
    );
};

export default function Hero() {
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);
    const glowRef = useRef(null);
    const glow2Ref = useRef(null);
    const gridRef = useRef(null);

    useGSAP(() => {
        const hero = heroRef.current;
        const content = contentRef.current;
        const image = imageRef.current;
        const glow = glowRef.current;
        const glow2 = glow2Ref.current;
        const grid = gridRef.current;

        // Set initial states
        gsap.set('.hero-badge', { opacity: 0, y: 20 });
        gsap.set('.main-title .char', { opacity: 0, y: 50 });
        gsap.set('.subtitle .char', { opacity: 0, y: 30 });
        gsap.set('.hero-tagline', { opacity: 0, y: 20 });
        gsap.set('.hero-buttons a', { opacity: 0, y: 15 });
        gsap.set('.hero-stats', { opacity: 0, y: 20 });
        gsap.set(image, { opacity: 0, x: 40, scale: 0.98 });
        gsap.set('.hero-image-border', { opacity: 0, scale: 0.96 });
        gsap.set(grid, { opacity: 0 });
        gsap.set(glow, { opacity: 0 });
        gsap.set(glow2, { opacity: 0 });

        // Create master timeline with professional easing
        const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            delay: 0.2
        });

        // Grid fade in first (subtle)
        tl.to(grid, {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.inOut',
        }, 0);

        // Glows fade in
        tl.to([glow, glow2], {
            opacity: 1,
            duration: 2,
            ease: 'power2.inOut',
        }, 0.3);

        // Badge - clean slide up
        tl.to('.hero-badge', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, 0.3);

        // Main headline - professional character reveal
        const mainChars = content.querySelectorAll('.main-title .char');
        tl.to(mainChars, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.025,
            ease: 'power3.out',
        }, 0.4);

        // Subtitle - smoother reveal
        const subtitleChars = content.querySelectorAll('.subtitle .char');
        tl.to(subtitleChars, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: 'power2.out',
        }, 0.7);

        // Tagline - elegant fade
        tl.to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, 1);

        // Buttons - subtle stagger
        tl.to('.hero-buttons a', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
        }, 1.1);

        // Stats - clean reveal
        tl.to('.hero-stats', {
            opacity: 1,
            y: 0,
            duration: 0.7,
        }, 1.3);

        // Image container - smooth slide in
        tl.to(image, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
        }, 0.5);

        // Border frame - subtle reveal
        tl.to('.hero-image-border', {
            opacity: 0.4,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
        }, 0.8);

        // Interactive mouse parallax for glows
        const handleMouseMove = (e) => {
            const rect = hero.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width;
            const mouseY = (e.clientY - rect.top) / rect.height;

            // Move primary glow following mouse
            gsap.to(glow, {
                x: (mouseX - 0.5) * 150,
                y: (mouseY - 0.5) * 100,
                duration: 1.5,
                ease: 'power2.out',
            });

            // Move secondary glow opposite direction for depth
            gsap.to(glow2, {
                x: (mouseX - 0.5) * -80,
                y: (mouseY - 0.5) * -60,
                duration: 2,
                ease: 'power2.out',
            });

            // Subtle parallax on image
            gsap.to(image, {
                x: (mouseX - 0.5) * 15,
                y: (mouseY - 0.5) * 10,
                duration: 1,
                ease: 'power2.out',
            });
        };

        hero.addEventListener('mousemove', handleMouseMove);

        // Scroll-triggered exit animation (smooth)
        ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            onUpdate: (self) => {
                const progress = self.progress;

                gsap.set(content, {
                    y: progress * -80,
                    opacity: 1 - progress * 0.6,
                });

                gsap.set(image, {
                    y: progress * -40,
                    opacity: 1 - progress * 0.4,
                });
            },
        });

        return () => {
            hero.removeEventListener('mousemove', handleMouseMove);
        };
    }, { scope: heroRef });

    return (
        <section
            ref={heroRef}
            id="home"
            className="min-h-[calc(100vh-120px)] flex items-center relative overflow-hidden px-6 lg:px-12 pt-24 pb-16"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                {/* Trendy gradient background - purple/red to dark blue */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #5a1d47 0%, #451a3d 10%, #3d1b3a 20%, #2d1b3f 30%, #1e2448 45%, #142140 60%, #0c1a38 75%, #061530 90%, #031225 100%)',
                    }}
                />

                {/* Red accent gradient overlay for sports energy */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 40%)',
                    }}
                />

                {/* Interactive red glow - primary (right side) */}
                <div
                    ref={glowRef}
                    className="absolute top-1/4 right-[15%] w-[600px] h-[600px] bg-red/20 rounded-full blur-[180px] pointer-events-none"
                />

                {/* Secondary glow - bottom left for variety */}
                <div
                    ref={glow2Ref}
                    className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-red/15 rounded-full blur-[150px] pointer-events-none"
                />

                {/* Grid overlay */}
                <div
                    ref={gridRef}
                    className="absolute inset-0 hero-grid-pattern opacity-0"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-7xl mx-auto w-full items-center">
                {/* Text Content */}
                <div ref={contentRef}>
                    {/* Season Badge */}
                    <div className="hero-badge inline-flex items-center gap-2 bg-red/10 border border-red/25 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 text-red">
                        <span className="w-1.5 h-1.5 bg-red rounded-full animate-pulse" />
                        2025–26 Season
                    </div>

                    {/* Main Headline - Bebas Neue with proper styling */}
                    <h1 className="font-bebas mb-4" style={{ lineHeight: '0.9' }}>
                        <span
                            className="main-title block text-white whitespace-nowrap overflow-visible"
                            style={{
                                fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                                fontWeight: 700,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            <SplitText>SHALER AREA</SplitText>
                        </span>
                        <span
                            className="subtitle block text-red mt-1 whitespace-nowrap overflow-visible"
                            style={{
                                fontSize: 'clamp(1.25rem, 3.5vw, 3rem)',
                                fontWeight: 700,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            <SplitText>TITANS LACROSSE</SplitText>
                        </span>
                    </h1>

                    {/* Tagline */}
                    <p className="hero-tagline text-base lg:text-lg text-white/60 font-light mb-8 max-w-md leading-relaxed" style={{ fontStyle: 'italic' }}>
                        Built on discipline. Played with pride. Representing Shaler Area with honor on every field.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-buttons flex gap-4 flex-wrap mb-10">
                        <a href="#schedule" className="btn-primary group">
                            View Schedule
                            <svg
                                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                viewBox="0 0 24 24"
                            >
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </a>
                        <a href="#contact" className="btn-secondary-compact">
                            Contact Us
                        </a>
                    </div>

                    {/* Quick Stats */}
                    <div className="hero-stats flex gap-8 lg:gap-10">
                        <StatCounter value="15" label="Years" suffix="+" delay={0} />
                        <StatCounter value="200" label="Athletes" suffix="+" delay={0.15} />
                        <StatCounter value="50" label="Wins" suffix="+" delay={0.3} />
                    </div>
                </div>

                {/* Hero Image / Visual */}
                <div ref={imageRef} className="relative group">
                    {/* Main image container */}
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden relative border border-white/[0.08]">
                        {/* Responsive Hero Images */}
                        <picture>
                            <source media="(min-width: 1024px)" srcSet="/hero_desktop.webp" />
                            <img
                                src="/hero_mobile.webp"
                                alt="Shaler Area Titans Lacrosse Action"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </picture>

                        {/* Blue-red color overlay that fades on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-red-900/40 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-20 pointer-events-none" />

                        {/* Gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Animated border frame */}
                    <div className="hero-image-border absolute -inset-3 lg:-inset-4 border border-red/30 rounded-3xl pointer-events-none" />

                    {/* Subtle glow behind */}
                    <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-red rounded-full blur-[60px] opacity-30 pointer-events-none" />
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
            </div>
        </section>
    );
}
