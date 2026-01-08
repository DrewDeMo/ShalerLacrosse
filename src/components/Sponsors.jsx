import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Placeholder sponsors - will be connected to admin later
const sponsors = [
    { id: 1, name: 'Local Business 1' },
    { id: 2, name: 'Sports Store' },
    { id: 3, name: 'Community Bank' },
    { id: 4, name: 'Pizza Place' },
    { id: 5, name: 'Auto Shop' },
    { id: 6, name: 'Medical Center' },
    { id: 7, name: 'Local Restaurant' },
    { id: 8, name: 'Insurance Co' },
];

export default function Sponsors() {
    return (
        <div className="relative bg-navy/50 border-y border-white/[0.06] py-6 overflow-hidden">
            {/* Red accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red to-transparent opacity-60" />

            {/* Subtle gradient overlays for edge fade */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-navy/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-navy/80 to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Minimal header with red accent */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-red/40" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
                        Proudly Supported By
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-red/40" />
                </div>

                {/* Auto-scrolling logo carousel */}
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={48}
                    slidesPerView="auto"
                    loop={true}
                    speed={4000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    allowTouchMove={false}
                    className="sponsors-swiper"
                >
                    {/* Double the sponsors for seamless loop */}
                    {[...sponsors, ...sponsors].map((sponsor, index) => (
                        <SwiperSlide key={`${sponsor.id}-${index}`} className="!w-auto">
                            <div className="flex items-center justify-center h-10 px-2 group cursor-default">
                                {/* Placeholder logo box - replace with actual images later */}
                                <div className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-300">
                                    <div className="w-8 h-8 rounded bg-white/[0.08] border border-white/[0.06] flex items-center justify-center">
                                        <span className="text-white/50 text-xs font-bold">
                                            {sponsor.name.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-white/40 text-sm font-medium whitespace-nowrap">
                                        {sponsor.name}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
