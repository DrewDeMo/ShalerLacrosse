export default function Footer() {
    return (
        <footer className="bg-navy px-12 pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-16 mb-12">
                    <div>
                        <h3 className="font-bebas text-3xl tracking-wide mb-4">
                            SHALER AREA TITANS LACROSSE
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                            Developing student-athletes through the sport of lacrosse. Building character, discipline, and teamwork in the Shaler Area community.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase tracking-widest mb-5 text-red">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="#home" className="footer-link">Home</a></li>
                            <li><a href="#schedule" className="footer-link">Schedule</a></li>
                            <li><a href="#results" className="footer-link">Results</a></li>
                            <li><a href="#contact" className="footer-link">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs uppercase tracking-widest mb-5 text-red">Contact Info</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:ShalerAreaLacrosse@gmail.com" className="footer-link">
                                    ShalerAreaLacrosse@gmail.com
                                </a>
                            </li>
                            <li className="text-white/70 text-sm">1800 Mt. Royal Boulevard</li>
                            <li className="text-white/70 text-sm">Glenshaw, PA 15116</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4 text-xs text-white/40">
                    <p>© 2025 Shaler Area Boys' Lacrosse Club. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="social-link" aria-label="Facebook">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
