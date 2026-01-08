import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

// Social media icons
const FacebookIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const XIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LocationIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

export default function Footer() {
    const footerRef = useRef(null);

    useEffect(() => {
        if (!footerRef.current) return;

        const elements = footerRef.current.querySelectorAll('.footer-animate');
        gsap.set(elements, { opacity: 0, y: 20 });

        const trigger = ScrollTrigger.create({
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        });

        return () => trigger.kill();
    }, []);

    return (
        <footer ref={footerRef} className="relative bg-navy overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#071a38] to-[#050d1d]" />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Gradient orb */}
            <div
                className="absolute -bottom-32 -left-32 w-64 h-64 bg-red/5 rounded-full blur-[100px]"
            />

            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/30 to-transparent" />

            <div className="relative z-10 px-6 lg:px-12 pt-16 pb-6">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-2 footer-animate">
                            <div className="flex items-center gap-4 mb-5">
                                <img
                                    src="/slax_logo.webp"
                                    alt="Shaler Area Lacrosse Logo"
                                    className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
                                />
                                <h3 className="font-bebas text-3xl lg:text-4xl tracking-wide text-white">
                                    SHALER AREA <span className="text-red">TITANS</span> LACROSSE
                                </h3>
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-6">
                                Developing student-athletes through the sport of lacrosse. Building character,
                                discipline, and teamwork in the Shaler Area community since 2010.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white/60 hover:text-red transition-all duration-300 group"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                    aria-label="Facebook"
                                >
                                    <div className="group-hover:scale-110 transition-transform">
                                        <FacebookIcon />
                                    </div>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white/60 hover:text-red transition-all duration-300 group"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                    aria-label="Instagram"
                                >
                                    <div className="group-hover:scale-110 transition-transform">
                                        <InstagramIcon />
                                    </div>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white/60 hover:text-red transition-all duration-300 group"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)'
                                    }}
                                    aria-label="X (Twitter)"
                                >
                                    <div className="group-hover:scale-110 transition-transform">
                                        <XIcon />
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-animate">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="w-1.5 h-1.5 bg-red rounded-full" />
                                <h4 className="text-xs uppercase tracking-[0.2em] text-red font-bold">Quick Links</h4>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Home', href: '#home' },
                                    { name: 'Schedule', href: '#schedule' },
                                    { name: 'Roster', href: '#roster' },
                                    { name: 'Results', href: '#results' },
                                ].map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-white/60 text-sm hover:text-white hover:pl-2 transition-all duration-300 inline-block"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-animate">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="w-1.5 h-1.5 bg-red rounded-full" />
                                <h4 className="text-xs uppercase tracking-[0.2em] text-red font-bold">Contact</h4>
                            </div>
                            <ul className="space-y-4">
                                <li>
                                    <a
                                        href="mailto:ShalerAreaLacrosse@gmail.com"
                                        className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 mt-0.5 group-hover:border-red/30 transition-colors">
                                            <MailIcon />
                                        </div>
                                        <span className="text-sm leading-relaxed">
                                            ShalerAreaLacrosse<br />@gmail.com
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3 text-white/60">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 mt-0.5">
                                            <LocationIcon />
                                        </div>
                                        <span className="text-sm leading-relaxed">
                                            1800 Mt. Royal Boulevard<br />
                                            Glenshaw, PA 15116
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-6 border-t border-white/[0.06]">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {/* Copyright */}
                            <p className="text-xs text-white/30 footer-animate">
                                © {new Date().getFullYear()} Shaler Area Boys' Lacrosse Club. All rights reserved.
                            </p>

                            {/* Developer Credit */}
                            <div className="footer-animate">
                                <a
                                    href="https://www.linkedin.com/in/drew-demaiolo-22112851/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[11px] text-white/25 hover:text-white/50 transition-colors duration-300 group"
                                >
                                    <span>Designed & Developed by</span>
                                    <span className="flex items-center gap-1.5 text-white/40 group-hover:text-red/70 transition-colors">
                                        <span className="font-medium">Drew DeMaiolo</span>
                                        <LinkedInIcon />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
