import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Don't show header on admin pages
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#schedule', label: 'Schedule' },
        { href: '#results', label: 'Results' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 lg:py-5 flex justify-between items-center transition-all duration-500 ease-in-out ${scrolled
                ? 'bg-navy/95 backdrop-blur-md shadow-lg'
                : 'bg-transparent'
                }`}>
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 font-bebas text-xl lg:text-2xl tracking-wider text-white no-underline z-50">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-red rounded-lg flex items-center justify-center text-lg lg:text-xl">
                        T
                    </div>
                    TITANS LAX
                </a>

                {/* Desktop Navigation */}
                <ul className="hidden lg:flex gap-10 list-none">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} className="nav-link">{link.label}</a>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 group"
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {/* Hamburger lines that transform to X */}
                    <span
                        className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2' : 'group-hover:w-7'
                            }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${mobileMenuOpen ? 'opacity-0 scale-0' : 'group-hover:w-5'
                            }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-out origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : 'group-hover:w-7'
                            }`}
                    />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-navy/98 backdrop-blur-xl transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Decorative gradient glow */}
                <div className={`absolute top-1/4 right-0 w-80 h-80 bg-red/20 rounded-full blur-[100px] transition-all duration-700 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                    }`} />
                <div className={`absolute bottom-1/4 left-0 w-60 h-60 bg-red/15 rounded-full blur-[80px] transition-all duration-700 delay-100 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                    }`} />

                {/* Menu Content */}
                <div className="relative h-full flex flex-col justify-center items-center px-8">
                    {/* Navigation Links */}
                    <ul className="flex flex-col items-center gap-2">
                        {navLinks.map((link, index) => (
                            <li
                                key={link.href}
                                className={`overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: mobileMenuOpen ? `${150 + index * 75}ms` : '0ms' }}
                            >
                                <a
                                    href={link.href}
                                    onClick={handleNavClick}
                                    className="mobile-nav-link block font-bebas text-5xl sm:text-6xl tracking-wide text-white/90 hover:text-red py-3 transition-colors duration-300"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Divider */}
                    <div className={`w-16 h-px bg-white/20 my-8 transition-all duration-500 delay-500 ${mobileMenuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        }`} />

                    {/* Secondary Action */}
                    <div className={`transition-all duration-500 delay-700 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                        <span className="text-white/40 text-sm tracking-widest uppercase">2025–26 Season</span>
                    </div>
                </div>

                {/* Bottom decoration */}
                <div className={`absolute bottom-12 left-0 right-0 flex justify-center gap-2 transition-all duration-500 delay-[800ms] ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                    <span className="w-2 h-2 rounded-full bg-red"></span>
                    <span className="w-2 h-2 rounded-full bg-white/30"></span>
                    <span className="w-2 h-2 rounded-full bg-white/30"></span>
                </div>
            </div>
        </>
    );
}
