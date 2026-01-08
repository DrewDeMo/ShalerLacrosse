const stats = [
    { number: '2025', label: 'Season Year' },
    { number: '16', label: 'Games Scheduled' },
    { number: '30+', label: 'Athletes' },
    { number: '1', label: 'Community' },
];

export default function Stats() {
    return (
        <div className="bg-white/5 border-y border-white/10 py-12 px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="font-bebas text-6xl text-red leading-none mb-2">
                            {stat.number}
                        </div>
                        <div className="text-xs uppercase tracking-widest text-white/60">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
