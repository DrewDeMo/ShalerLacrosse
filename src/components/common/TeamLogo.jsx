import { useState } from 'react';

/**
 * TeamLogo Component - Premium 2025/26 Athletic Design
 * Displays team logo with fallback to team initials
 * Supports three sizes: small (48px), default (64px), large (80px)
 * Always renders in a perfect square container for consistent alignment
 */
export default function TeamLogo({
    logoUrl,
    teamName,
    size = 'default',
    className = '',
    primaryColor = '#061649' // Default to Titans navy
}) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const sizeConfig = {
        small: { container: 'w-12 h-12', text: 'text-base', ringSize: 'ring-2' },
        default: { container: 'w-16 h-16', text: 'text-xl', ringSize: 'ring-2' },
        large: { container: 'w-20 h-20 md:w-24 md:h-24', text: 'text-2xl md:text-3xl', ringSize: 'ring-[3px]' }
    };

    const config = sizeConfig[size] || sizeConfig.default;

    // Generate team initials from team name
    const getInitials = () => {
        if (!teamName) return '?';

        const words = teamName.trim().split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        // Take first letter of first two words
        return words
            .slice(0, 2)
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    // If no logo or image failed to load, show initials fallback
    if (!logoUrl || imageError) {
        return (
            <div
                className={`${config.container} ${className} rounded-full flex items-center justify-center font-bebas relative overflow-hidden transition-all duration-300 cursor-default group`}
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25)`,
                    border: `2px solid ${primaryColor}30`,
                    boxShadow: isHovered ? `0 0 20px ${primaryColor}30` : 'none'
                }}
                title={teamName || 'Team'}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span
                    className={`font-bold relative z-10 ${config.text} transition-transform duration-300 group-hover:scale-110`}
                    style={{ color: primaryColor }}
                >
                    {getInitials()}
                </span>
                {/* Subtle gradient overlay */}
                <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${primaryColor}, transparent)`
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={`${config.container} ${className} relative flex items-center justify-center group cursor-default`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Decorative ring on hover */}
            <div
                className={`absolute inset-0 rounded-full ${config.ringSize} ring-white/0 group-hover:ring-white/20 transition-all duration-300 scale-110`}
            />

            {/* Loading skeleton */}
            {imageLoading && (
                <div
                    className="absolute inset-0 rounded-lg animate-pulse"
                    style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                    }}
                />
            )}

            {/* Team logo image - centered in square container */}
            <img
                src={logoUrl}
                alt={`${teamName || 'Team'} logo`}
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${imageLoading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                    } ${isHovered ? 'scale-110' : ''}`}
                loading="lazy"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                }}
            />
        </div>
    );
}
