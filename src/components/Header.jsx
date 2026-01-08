import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Don't show header on admin pages
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 px-12 py-5 flex justify-between items-center transition-all duration-300 bg-navy/95 backdrop-blur-md ${scrolled ? 'shadow-lg' : ''
            }`}>
            <a href="#" className="flex items-center gap-3 font-bebas text-2xl tracking-wider text-white no-underline">
                <div className="w-10 h-10 bg-red rounded-lg flex items-center justify-center text-xl">
                    T
                </div>
                TITANS LAX
            </a>
            <ul className="flex gap-10 list-none">
                <li><a href="#home" className="nav-link">Home</a></li>
                <li><a href="#schedule" className="nav-link">Schedule</a></li>
                <li><a href="#results" className="nav-link">Results</a></li>
                <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
        </nav>
    );
}
