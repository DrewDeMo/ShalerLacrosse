const ctaCards = [
    {
        icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        title: 'View Full Schedule',
        description: 'See all games, times, and locations for the 2025–26 season.',
        link: '#schedule'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        ),
        title: 'Follow the Team',
        description: 'Stay updated with game highlights, photos, and team news.',
        link: 'https://www.instagram.com'
    },
    {
        icon: (
            <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
        ),
        title: 'Contact Coaching Staff',
        description: 'Questions about the program? Reach out to our coaches.',
        link: 'mailto:ShalerAreaLacrosse@gmail.com'
    }
];

export default function CTA() {
    return (
        <section id="contact" className="py-24 px-12 bg-off-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {ctaCards.map((card, index) => (
                    <a
                        key={index}
                        href={card.link}
                        target={card.link.startsWith('http') ? '_blank' : undefined}
                        rel={card.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="bg-white rounded-3xl p-10 text-center transition-all duration-300 border border-gray-200 text-navy block hover:-translate-y-2 hover:shadow-2xl hover:border-red group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-navy to-navy/80 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-red group-hover:to-red/80 group-hover:scale-110">
                            <div className="w-7 h-7 text-white">
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}
