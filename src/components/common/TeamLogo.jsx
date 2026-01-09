import { useState } from 'react';

/**
 * TeamLogo Component - Premium 2025/26 Athletic Design
 * Displays team logo with fallback to team initials
 * Uses max-width and max-height constraints for consistent alignment
 * regardless of logo aspect ratio (tall, wide, or square)
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

    // Size configurations with max dimensions
    // The container is always square, logos scale to fit within while maintaining aspect ratio
    const sizeConfig = {
        small: {
            container: 'w-12 h-12',
            text: 'text-base',
            maxDimension: '48px'
        },
        default: {
            container: 'w-16 h-16',
            text: 'text-xl',
            maxDimension: '64px'
        },
        large: {
            container: 'w-full h-full',
            text: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
            maxDimension: '100%'
        }
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
                className={`${config.container} ${className} rounded-full flex items-center justify-center font-bebas relative overflow-hidden cursor-default`}
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25)`,
                    border: `2px solid ${primaryColor}30`,
                    maxWidth: config.maxDimension,
                    maxHeight: config.maxDimension,
                    aspectRatio: '1 / 1'
                }}
                title={teamName || 'Team'}
            >
                <span
                    className={`font-bold relative z-10 ${config.text}`}
                    style={{ color: primaryColor }}
                >
                    {getInitials()}
                </span>
                {/* Subtle gradient overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${primaryColor}, transparent)`
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={`${config.container} ${className} relative flex items-center justify-center cursor-default`}
            style={{
                maxWidth: config.maxDimension,
                maxHeight: config.maxDimension
            }}
        >
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

            {/* Team logo image - constrained by max dimensions, maintains aspect ratio */}
            <img
                src={logoUrl}
                alt={`${teamName || 'Team'} logo`}
                className={`transition-all duration-300 ${imageLoading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
                style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                }}
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
